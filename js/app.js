// Combined Snake Game Application - No ES6 modules (works with file:// protocol)

// ========================================
// ScoreStorage class - LocalStorage wrapper for score persistence
// ========================================

class ScoreStorage {
    constructor(storageKey = 'snakeGameScores') {
        this.storageKey = storageKey;
    }
    
    // Load all rounds from storage
    async loadRounds() {
        try {
            const data = localStorage.getItem(this.storageKey);
            
            if (!data) {
                return [];
            }
            
            const rounds = JSON.parse(data);
            
            if (!Array.isArray(rounds)) {
                console.error('Corrupted data in localStorage: not an array');
                return [];
            }
            
            return rounds;
        } catch (error) {
            console.error('Error loading rounds from localStorage:', error);
            return [];
        }
    }
    
    // Save a round to storage
    async saveRound(round) {
        try {
            // Validate round data
            if (!round.playerName || round.playerName.trim().length === 0) {
                throw new Error('Player name is required');
            }
            
            if (typeof round.score !== 'number' || round.score < 0) {
                throw new Error('Invalid score value');
            }
            
            if (typeof round.timestamp !== 'number' || round.timestamp > Date.now()) {
                throw new Error('Invalid timestamp');
            }
            
            // Load existing rounds
            const rounds = await this.loadRounds();
            
            // Add new round
            rounds.push({
                playerName: round.playerName,
                score: round.score,
                timestamp: round.timestamp
            });
            
            // Save to localStorage
            try {
                localStorage.setItem(this.storageKey, JSON.stringify(rounds));
            } catch (e) {
                if (e.name === 'QuotaExceededError') {
                    throw new Error('QUOTA_EXCEEDED: Storage quota exceeded');
                }
                throw e;
            }
        } catch (error) {
            if (error.message.startsWith('QUOTA_EXCEEDED')) {
                console.error('Storage quota exceeded');
            }
            throw error;
        }
    }
    
    // Get rounds sorted by score (descending)
    async getSortedRounds(limit) {
        const rounds = await this.loadRounds();
        
        // Sort by score (descending), then by timestamp (descending) for tie-breaking
        rounds.sort((a, b) => {
            if (b.score !== a.score) {
                return b.score - a.score;
            }
            return b.timestamp - a.timestamp;
        });
        
        if (limit && limit > 0) {
            return rounds.slice(0, limit);
        }
        
        return rounds;
    }
    
    // Get top 3 rounds
    async getTop3Rounds() {
        return await this.getSortedRounds(3);
    }
    
    // Get rounds for a specific player
    async getPlayerRounds(playerName) {
        const rounds = await this.loadRounds();
        return rounds.filter(round => round.playerName === playerName);
    }
    
    // Clear all saved rounds
    async clearAll() {
        try {
            localStorage.removeItem(this.storageKey);
        } catch (error) {
            console.error('Error clearing storage:', error);
            throw error;
        }
    }
}

// ========================================
// Game class - Core game logic for Snake gameplay
// ========================================

class Game {
    constructor(canvas, options = {}) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        
        // Options with defaults
        this.cellSize = options.cellSize || 20;
        this.gameSpeed = options.gameSpeed || 150;
        this.initialLength = options.initialLength || 3;
        
        // Calculate grid dimensions
        this.gridWidth = Math.floor(this.canvas.width / this.cellSize);
        this.gridHeight = Math.floor(this.canvas.height / this.cellSize);
        
        // Game state
        this.status = 'waiting';
        this.snake = [];
        this.direction = 'right';
        this.nextDirection = null;
        this.food = null;
        this.score = 0;
        
        // Game loop
        this.lastUpdate = 0;
        this.animationId = null;
        
        // Event listeners
        this.eventListeners = {
            foodEaten: [],
            collision: [],
            scoreChanged: []
        };
    }
    
    // Initialize snake at starting position
    _initSnake() {
        const startX = Math.floor(this.gridWidth / 2);
        const startY = Math.floor(this.gridHeight / 2);
        
        this.snake = [];
        for (let i = 0; i < this.initialLength; i++) {
            this.snake.push({ x: startX - i, y: startY });
        }
    }
    
    // Place food at random empty location
    _placeFood() {
        let validPosition = false;
        let foodX, foodY;
        
        while (!validPosition) {
            foodX = Math.floor(Math.random() * this.gridWidth);
            foodY = Math.floor(Math.random() * this.gridHeight);
            
            // Check if food position overlaps with snake
            validPosition = !this.snake.some(segment => 
                segment.x === foodX && segment.y === foodY
            );
        }
        
        this.food = { x: foodX, y: foodY };
    }
    
    // Start game loop
    start() {
        if (this.status === 'active') return;
        
        this.status = 'active';
        this.score = 0;
        this.direction = 'right';
        this.nextDirection = null;
        
        this._initSnake();
        this._placeFood();
        
        this.lastUpdate = Date.now();
        this._gameLoop();
    }
    
    // Game loop using requestAnimationFrame
    _gameLoop() {
        if (this.status !== 'active') return;
        
        const now = Date.now();
        const deltaTime = now - this.lastUpdate;
        
        if (deltaTime >= this.gameSpeed) {
            this._update();
            this._render();
            this.lastUpdate = now;
        }
        
        this.animationId = requestAnimationFrame(() => this._gameLoop());
    }
    
    // Update game state
    _update() {
        // Apply queued direction change
        if (this.nextDirection) {
            this.direction = this.nextDirection;
            this.nextDirection = null;
        }
        
        // Calculate new head position
        const head = { ...this.snake[0] };
        
        switch (this.direction) {
            case 'up':
                head.y--;
                break;
            case 'down':
                head.y++;
                break;
            case 'left':
                head.x--;
                break;
            case 'right':
                head.x++;
                break;
        }
        
        // Check collision
        if (this._checkCollision(head)) {
            this.end();
            return;
        }
        
        // Add new head
        this.snake.unshift(head);
        
        // Check if food eaten
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score++;
            this._emit('scoreChanged', { score: this.score });
            this._emit('foodEaten', { score: this.score });
            this._placeFood();
        } else {
            // Remove tail (snake doesn't grow)
            this.snake.pop();
        }
    }
    
    // Handle direction changes with rapid key press handling
    changeDirection(newDirection) {
        const opposites = {
            'up': 'down',
            'down': 'up',
            'left': 'right',
            'right': 'left'
        };
        
        // Check against queued direction if it exists, otherwise against current direction
        const currentDir = this.nextDirection || this.direction;
        
        // Prevent reverse direction
        if (opposites[newDirection] === currentDir) {
            return;
        }
        
        // Queue direction change (handles rapid key presses)
        this.nextDirection = newDirection;
    }
    
    // Check collision with walls or self
    _checkCollision(head) {
        // Wall collision
        if (head.x < 0 || head.x >= this.gridWidth || 
            head.y < 0 || head.y >= this.gridHeight) {
            this._emit('collision', { reason: 'wall', score: this.score });
            return true;
        }
        
        // Self collision
        if (this.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            this._emit('collision', { reason: 'self', score: this.score });
            return true;
        }
        
        // Check if snake fills entire playable area (maximum length)
        const maxLength = this.gridWidth * this.gridHeight;
        if (this.snake.length >= maxLength - 1) {
            this._emit('collision', { reason: 'win', score: this.score });
            return true;
        }
        
        return false;
    }
    
    // Render game to canvas
    _render() {
        // Clear canvas
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw snake
        this.ctx.fillStyle = '#379596'; // Primary color
        this.snake.forEach(segment => {
            this.ctx.fillRect(
                segment.x * this.cellSize,
                segment.y * this.cellSize,
                this.cellSize - 1,
                this.cellSize - 1
            );
        });
        
        // Draw food
        this.ctx.fillStyle = '#191919'; // Content color
        this.ctx.fillRect(
            this.food.x * this.cellSize,
            this.food.y * this.cellSize,
            this.cellSize - 1,
            this.cellSize - 1
        );
    }
    
    // End game
    end() {
        this.status = 'ended';
        
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        
        return {
            score: this.score,
            reason: this.status === 'ended' ? 'collision' : 'manual'
        };
    }
    
    // Event system
    on(event, callback) {
        if (this.eventListeners[event]) {
            this.eventListeners[event].push(callback);
        }
    }
    
    off(event, callback) {
        if (this.eventListeners[event]) {
            this.eventListeners[event] = this.eventListeners[event].filter(
                cb => cb !== callback
            );
        }
    }
    
    _emit(event, data) {
        if (this.eventListeners[event]) {
            this.eventListeners[event].forEach(callback => callback(data));
        }
    }
}

// ========================================
// GameUI class - UI management for player input, turn management, and high score display
// ========================================

class GameUI {
    constructor(options) {
        this.playerInput = options.playerInput;
        this.startButton = options.startButton;
        this.scoreDisplay = options.scoreDisplay;
        this.highScoreList = options.highScoreList;
        this.gameContainer = options.gameContainer;
        
        // Event listeners
        this.eventListeners = {
            startGame: [],
            playerNameEntered: []
        };
        
        // Set up start button event
        this.startButton.addEventListener('click', () => this._handleStartGame());
        
        // Set up enter key on input
        this.playerInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this._handleStartGame();
            }
        });
    }
    
    // Handle start game button click
    _handleStartGame() {
        const playerName = this.getPlayerName();
        if (playerName) {
            this._emit('startGame', { playerName });
        } else {
            alert('Please enter your name');
        }
    }
    
    // Show player input form
    showPlayerInput() {
        const container = this.playerInput.closest('#player-input-container');
        if (container) {
            container.style.display = 'block';
        }
        this.playerInput.value = '';
        this.playerInput.focus();
        this.playerInput.placeholder = 'Enter your name';
    }
    
    // Hide player input form
    hidePlayerInput() {
        const container = this.playerInput.closest('#player-input-container');
        if (container) {
            container.style.display = 'none';
        }
    }
    
    // Get player name with validation
    getPlayerName() {
        const name = this.playerInput.value.trim();
        
        // Check for empty or whitespace-only names
        if (!name || name.length === 0) {
            return null;
        }
        
        // Enforce minimum length (1 character)
        if (name.length < 1) {
            return null;
        }
        
        // Enforce maximum length (50 characters)
        if (name.length > 50) {
            return name.substring(0, 50);
        }
        
        return name;
    }
    
    // Update displayed current score
    updateScore(score) {
        const scoreValue = document.getElementById('score-value');
        if (scoreValue) {
            scoreValue.textContent = score;
        }
    }
    
    // Display game over message and final score
    showGameOver(score, reason) {
        // Remove game-active class
        this.gameContainer.classList.remove('game-active');
        
        // Show game over modal
        setTimeout(() => {
            const modal = document.getElementById('game-over-modal');
            const messageEl = document.getElementById('game-over-message');
            const scoreEl = document.getElementById('game-over-score');
            const okButton = document.getElementById('game-over-ok');
            
            // Set message based on reason
            let message = '';
            if (reason === 'wall') {
                message = 'You hit the wall!';
            } else if (reason === 'self') {
                message = 'You hit yourself!';
            } else if (reason === 'win') {
                message = 'Congratulations! You won!';
            } else {
                message = 'Game ended';
            }
            
            messageEl.textContent = message;
            scoreEl.textContent = `Final Score: ${score}`;
            
            // Show modal
            modal.classList.add('show');
            
            // Handle OK button click
            const closeModal = () => {
                modal.classList.remove('show');
                okButton.removeEventListener('click', closeModal);
            };
            
            okButton.addEventListener('click', closeModal);
        }, 100);
    }
    
    // Display high scores in white rectangle area
    displayHighScores(rounds) {
        this.highScoreList.innerHTML = '';
        
        if (!rounds || rounds.length === 0) {
            const li = document.createElement('li');
            li.textContent = 'No scores yet. Play a game!';
            this.highScoreList.appendChild(li);
            return;
        }
        
        // Display top 3 scores
        const topScores = rounds.slice(0, 3);
        topScores.forEach((round, index) => {
            const li = document.createElement('li');
            li.textContent = `${index + 1}. ${round.playerName}: ${round.score}`;
            this.highScoreList.appendChild(li);
        });
    }
    
    // Show turn indicator (optional, not used in single-player)
    showTurnIndicator(playerName) {
        // Not used in single-player mode
    }
    
    // Hide turn indicator (optional, not used in single-player)
    hideTurnIndicator() {
        // Not used in single-player mode
    }
    
    // Show error message
    showError(message) {
        alert(`Error: ${message}`);
    }
    
    // Clear error message
    clearError() {
        // Error is handled by alert, so nothing to clear
    }
    
    // Event system
    on(event, callback) {
        if (this.eventListeners[event]) {
            this.eventListeners[event].push(callback);
        }
    }
    
    off(event, callback) {
        if (this.eventListeners[event]) {
            this.eventListeners[event] = this.eventListeners[event].filter(
                cb => cb !== callback
            );
        }
    }
    
    _emit(event, data) {
        if (this.eventListeners[event]) {
            this.eventListeners[event].forEach(callback => callback(data));
        }
    }
}

// ========================================
// SnakeGameApp class - Application orchestration
// ========================================

class SnakeGameApp {
    constructor(config) {
        this.canvas = config.canvas;
        this.game = null;
        this.ui = null;
        this.storage = null;
        this.currentPlayerName = null;
    }
    
    // Initialize application and load initial state
    async initialize() {
        // Initialize storage
        this.storage = new ScoreStorage();
        
        // Initialize UI
        this.ui = new GameUI({
            playerInput: document.getElementById('player-name-input'),
            startButton: document.getElementById('start-button'),
            scoreDisplay: document.getElementById('score-display'),
            highScoreList: document.getElementById('high-score-list'),
            gameContainer: document.getElementById('game-container')
        });
        
        // Wire up UI event listeners
        this.ui.on('startGame', (data) => {
            this.startGame(data.playerName);
        });
        
        // Load and display high scores
        await this.loadHighScores();
        
        // Show player input
        this.ui.showPlayerInput();
        
        console.log('Snake Game initialized');
    }
    
    // Load and display high scores
    async loadHighScores() {
        try {
            const topRounds = await this.storage.getTop3Rounds();
            this.ui.displayHighScores(topRounds);
        } catch (error) {
            console.error('Error loading high scores:', error);
            this.ui.showError('Failed to load high scores');
        }
    }
    
    // Start game for a player
    startGame(playerName) {
        // Store player name
        this.currentPlayerName = playerName;
        
        // Hide player input and high scores, show game
        this.ui.hidePlayerInput();
        this.ui.hideTurnIndicator();
        document.getElementById('game-container').classList.add('game-active');
        
        // Initialize game
        this.game = new Game(this.canvas, {
            cellSize: 20,
            gameSpeed: 150,
            initialLength: 3
        });
        
        // Wire up game event listeners
        this.game.on('collision', (data) => {
            this.endGame(data.score, data.reason);
        });
        
        this.game.on('foodEaten', (data) => {
            this.ui.updateScore(data.score);
        });
        
        this.game.on('scoreChanged', (data) => {
            this.ui.updateScore(data.score);
        });
        
        // Set up keyboard listeners
        this._setupKeyboardListeners();
        
        // Start game
        this.game.start();
        this.ui.updateScore(0);
    }
    
    // Set up keyboard event listeners
    _setupKeyboardListeners() {
        this.keyHandler = (e) => this.handleKeyPress(e);
        document.addEventListener('keydown', this.keyHandler);
    }
    
    // Remove keyboard event listeners
    _removeKeyboardListeners() {
        if (this.keyHandler) {
            document.removeEventListener('keydown', this.keyHandler);
            this.keyHandler = null;
        }
    }
    
    // Handle arrow key presses (only when current player's game is active)
    handleKeyPress(event) {
        if (!this.game || this.game.status !== 'active') {
            return;
        }
        
        switch (event.key) {
            case 'ArrowUp':
                event.preventDefault();
                this.game.changeDirection('up');
                break;
            case 'ArrowDown':
                event.preventDefault();
                this.game.changeDirection('down');
                break;
            case 'ArrowLeft':
                event.preventDefault();
                this.game.changeDirection('left');
                break;
            case 'ArrowRight':
                event.preventDefault();
                this.game.changeDirection('right');
                break;
        }
    }
    
    // End game and save score
    async endGame(score, reason) {
        // Remove keyboard listeners
        this._removeKeyboardListeners();
        
        // Save score to storage
        try {
            const round = {
                playerName: this.currentPlayerName,
                score: score,
                timestamp: Date.now()
            };
            
            await this.storage.saveRound(round);
            console.log('Score saved:', round);
        } catch (error) {
            console.error('Error saving score:', error);
            if (error.message.includes('QUOTA_EXCEEDED')) {
                this.ui.showError('Storage quota exceeded. Unable to save score.');
            } else {
                this.ui.showError('Failed to save score');
            }
        }
        
        // Reload and display updated high scores
        await this.loadHighScores();
        
        // Show game over
        this.ui.showGameOver(score, reason);
        
        // Show player input for next game
        this.ui.showPlayerInput();
    }
}

// ========================================
// Initialize application when DOM is loaded
// ========================================

document.addEventListener('DOMContentLoaded', async () => {
    const canvas = document.getElementById('game-canvas');
    
    const app = new SnakeGameApp({
        canvas: canvas
    });
    
    await app.initialize();
});

