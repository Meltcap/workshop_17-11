// Game class - Core game logic for Snake gameplay

export class Game {
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
    
    // Pause game
    pause() {
        if (this.status !== 'active') return;
        
        this.status = 'paused';
        
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
    
    // Resume game
    resume() {
        if (this.status !== 'paused') {
            throw new Error('Game is not paused');
        }
        
        this.status = 'active';
        this.lastUpdate = Date.now();
        this._gameLoop();
    }
    
    // Get current game state
    getState() {
        return {
            status: this.status,
            score: this.score,
            snake: [...this.snake],
            food: this.food ? { ...this.food } : null,
            direction: this.direction
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
