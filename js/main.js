// Main application entry point
// SnakeGameApp class - Application orchestration

import { Game } from './game.js';
import { GameUI } from './ui.js';
import { ScoreStorage } from './storage.js';

class SnakeGameApp {
    constructor(config) {
        this.canvas = config.canvas;
        this.game = null;
        this.ui = null;
        this.storage = null;
        
        // Two-player state
        this.currentPlayer = null;
        this.player1Name = null;
        this.player2Name = null;
    }
    
    // Get current player number
    getCurrentPlayer() {
        return this.currentPlayer;
    }
    
    // Get current player name
    getCurrentPlayerName() {
        if (this.currentPlayer === 1) {
            return this.player1Name;
        } else if (this.currentPlayer === 2) {
            return this.player2Name;
        }
        return null;
    }
    
    // Switch player
    switchPlayer() {
        if (this.currentPlayer === null) {
            this.currentPlayer = 1;
        } else if (this.currentPlayer === 1) {
            this.currentPlayer = 2;
        } else {
            this.currentPlayer = 1;
        }
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
            turnIndicator: document.getElementById('turn-indicator'),
            gameContainer: document.getElementById('game-container')
        });
        
        // Wire up UI event listeners
        this.ui.on('startGame', (data) => {
            this.startGame(data.playerName);
        });
        
        // Load and display high scores
        await this.loadHighScores();
        
        // Show player input for player 1
        this.currentPlayer = 1;
        this.ui.showPlayerInput(1);
        this.ui.showTurnIndicator(1, 'Waiting...');
        
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
        if (this.currentPlayer === 1) {
            this.player1Name = playerName;
        } else if (this.currentPlayer === 2) {
            this.player2Name = playerName;
        }
        
        // Hide player input and high scores, show game
        this.ui.hidePlayerInput();
        document.getElementById('game-container').classList.add('game-active');
        
        // Update turn indicator
        this.ui.showTurnIndicator(this.currentPlayer, this.getCurrentPlayerName());
        
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
                playerName: this.getCurrentPlayerName(),
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
        
        // Switch to next player
        this.switchPlayer();
        
        // Show player input for next player
        this.ui.showPlayerInput(this.currentPlayer);
        this.ui.showTurnIndicator(this.currentPlayer, this.getCurrentPlayerName() || 'Waiting...');
    }
}

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    const canvas = document.getElementById('game-canvas');
    
    const app = new SnakeGameApp({
        canvas: canvas
    });
    
    await app.initialize();
});
