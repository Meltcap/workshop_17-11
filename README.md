# Two-Player Turn-Based Snake Game

A browser-based Snake game that supports two players taking turns. Built with vanilla JavaScript, HTML5, and CSS3.

## Features

- **Core Snake Gameplay**: Control the snake with arrow keys, eat food to grow, avoid collisions
- **Two-Player Mode**: Players alternate turns with clear turn indicators
- **Score Persistence**: Scores saved to browser localStorage
- **High Score Display**: Top 3 high scores displayed when no game is active
- **FD BUSINESS Styling**: Professional color scheme (#379596, #191919, #ffeadb)
- **Offline Functionality**: Works completely offline, no server required

## Quick Start

1. Open `index.html` in a modern web browser (Chrome, Firefox, Safari, Edge)
2. Enter Player 1 name and click "Start Game"
3. Control the snake with arrow keys (↑ ↓ ← →)
4. After game ends, Player 2 takes their turn
5. High scores are automatically saved and displayed

## Project Structure

```
Snake-game/
├── index.html          # Main HTML file
├── styles/
│   ├── main.css        # Core styling with FD BUSINESS colors
│   └── game.css        # Game-specific styling
├── js/
│   ├── main.js         # Application entry point
│   ├── game.js         # Core game logic
│   ├── ui.js           # UI management
│   └── storage.js      # LocalStorage persistence
└── assets/
    └── BG.png          # Background image
```

## Game Controls

- **Arrow Up**: Move snake up
- **Arrow Down**: Move snake down
- **Arrow Left**: Move snake left
- **Arrow Right**: Move snake right

## Technical Details

- **Language**: JavaScript (ES6+ modules)
- **Rendering**: HTML5 Canvas API
- **Game Loop**: requestAnimationFrame (60 fps)
- **Storage**: Browser localStorage API
- **Performance**: <100ms input response time

## Browser Compatibility

Requires a modern browser with support for:
- ES6 JavaScript modules
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

## Development

The game is built with:
- No dependencies (vanilla JavaScript)
- No build process required
- No backend or server needed
- Complete offline functionality

## License

This is a learning project for educational purposes.

