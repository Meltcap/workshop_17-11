# Snake Game

A browser-based Snake game with high score tracking. Built with vanilla JavaScript, HTML5, and CSS3.

## Features

- **Core Snake Gameplay**: Control the snake with arrow keys, eat food to grow, avoid collisions
- **Score Persistence**: Scores saved to browser localStorage
- **High Score Display**: Top 3 high scores displayed when no game is active
- **FD BUSINESS Styling**: Professional color scheme with custom background
- **Offline Functionality**: Works completely offline, no server required
- **Multiple Players**: Track scores for different players

## Quick Start

1. Open `index.html` in a modern web browser (Chrome, Firefox, Safari, Edge)
2. Enter your name and click "Start Game"
3. Control the snake with arrow keys (↑ ↓ ← →)
4. After Game Over, play again or let another player take a turn
5. High scores are automatically saved and displayed

## Project Structure

```
Snake-game/
├── index.html          # Main HTML file
├── styles/
│   ├── main.css        # Core styling with FD BUSINESS colors
│   └── game.css        # Game-specific styling
├── js/
│   └── app.js          # Complete game application
└── assets/
    └── BG.png          # Background image
```

## Game Controls

- **Arrow Up**: Move snake up
- **Arrow Down**: Move snake down
- **Arrow Left**: Move snake left
- **Arrow Right**: Move snake right

## Technical Details

- **Language**: Vanilla JavaScript (ES6+)
- **Rendering**: HTML5 Canvas API
- **Game Loop**: requestAnimationFrame (60 fps)
- **Storage**: Browser localStorage API
- **Performance**: <100ms input response time
- **No Dependencies**: Pure JavaScript, no frameworks or libraries

## Browser Compatibility

Requires a modern browser with support for:
- ES6 JavaScript
- HTML5 Canvas
- localStorage API
- CSS3

Tested on Chrome, Firefox, Safari, and Edge (latest versions).

## Score Storage

Scores are stored locally in the browser using localStorage:
- Key: `snakeGameScores`
- Format: JSON array of game rounds
- Persistence: Survives browser restarts
- Capacity: Subject to browser storage limits

## Multiple Players

While this is a single-player game (one person plays at a time), it supports tracking scores for multiple players:
- Each player enters their name before playing
- All scores are saved with player names
- Top 3 high scores are displayed regardless of player
- Players can see their personal best in the high score list

## Development

The game is built with:
- No dependencies (vanilla JavaScript)
- No build process required
- No backend or server needed
- Complete offline functionality
- Single HTML file can be opened directly in browser

## License

This is a learning project for educational purposes.

