// GameUI class - UI management for player input, turn management, and high score display

export class GameUI {
    constructor(options) {
        this.playerInput = options.playerInput;
        this.startButton = options.startButton;
        this.scoreDisplay = options.scoreDisplay;
        this.highScoreList = options.highScoreList;
        this.turnIndicator = options.turnIndicator;
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
    showPlayerInput(playerNumber = 1) {
        const container = this.playerInput.closest('#player-input-container');
        if (container) {
            container.style.display = 'block';
        }
        this.playerInput.value = '';
        this.playerInput.focus();
        
        // Update placeholder based on player number
        this.playerInput.placeholder = `Player ${playerNumber}: Enter your name`;
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
        // Show game over alert
        setTimeout(() => {
            alert(`Game Over! Your score: ${score}\nReason: ${reason === 'wall' ? 'Hit the wall' : 'Hit yourself'}`);
        }, 100);
        
        // Remove game-active class
        this.gameContainer.classList.remove('game-active');
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
    
    // Show turn indicator
    showTurnIndicator(playerNumber, playerName) {
        this.turnIndicator.textContent = `Player ${playerNumber}: ${playerName}'s turn`;
        this.turnIndicator.style.display = 'block';
    }
    
    // Hide turn indicator
    hideTurnIndicator() {
        this.turnIndicator.textContent = '';
        this.turnIndicator.style.display = 'none';
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
