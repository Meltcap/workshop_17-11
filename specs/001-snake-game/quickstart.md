# Quickstart Guide: Two-Player Turn-Based Snake Game

**Feature**: [spec.md](./spec.md)  
**Plan**: [plan.md](./plan.md)

## Overview

This guide provides step-by-step instructions to get the Snake Game running locally in your browser.

## Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge - latest 2 versions)
- Text editor or IDE
- No build tools or package managers required (vanilla JavaScript)

## Project Structure

```
Snake-game/
├── index.html              # Main HTML file
├── styles/
│   ├── main.css           # FD BUSINESS styling
│   └── game.css           # Game-specific styles
├── js/
│   ├── game.js            # Core game logic
│   ├── storage.js         # Score persistence
│   ├── ui.js              # UI management
│   └── main.js            # Application entry point
└── assets/
    └── BG.png             # Background image
```

## Setup Steps

### 1. Create Project Files

Create the directory structure above in your project root.

### 2. Set Up HTML (index.html)

Create `index.html` with:
- Canvas element for game rendering
- Player name input field
- Start button
- Score display
- High score list container
- Turn indicator
- Link to CSS files
- Script tags for JavaScript modules

### 3. Set Up Styling (styles/main.css)

- Apply FD BUSINESS color scheme:
  - Primary: `#379596`
  - Content: `#191919`
  - Background: `#ffeadb`
- Set BG.png as page background
- Position game canvas inside white rectangle area (replaces high score display when active)
- Position high score list (top 3) inside white rectangle area when no game is active
- Style input fields, buttons, and high score list

### 4. Implement Game Logic (js/game.js)

- Create `Game` class with:
  - Canvas rendering
  - Snake movement logic
  - Collision detection
  - Food placement
  - Score tracking
  - Game loop using requestAnimationFrame

### 5. Implement Storage (js/storage.js)

- Create `ScoreStorage` class with:
  - localStorage wrapper
  - Save/load game rounds
  - Sort scores
  - Error handling for quota exceeded

### 6. Implement UI (js/ui.js)

- Create `GameUI` class with:
  - Player input management
  - Turn indicator
  - Score display updates
  - High score list rendering
  - Event handling

### 7. Implement Main App (js/main.js)

- Create `SnakeGameApp` class that:
  - Initializes all modules
  - Orchestrates game flow
  - Handles turn switching
  - Manages keyboard input

### 8. Initialize Application

In `index.html`, add initialization script:
```javascript
// Wait for DOM to load
document.addEventListener('DOMContentLoaded', async () => {
  const app = new SnakeGameApp(config);
  await app.initialize();
});
```

## Running the Game

1. **Open in Browser**:
   - Simply open `index.html` in your browser
   - Or use a local server (optional):
     ```bash
     # Python 3
     python -m http.server 8000
     
     # Node.js (if you have http-server installed)
     npx http-server
     ```

2. **Play the Game**:
   - Player 1 enters name and clicks "Start"
   - Use arrow keys to control snake
   - Game ends on collision
   - Score is saved automatically
   - Player 2 enters name and plays
   - Players alternate turns

## Testing

### Manual Testing Checklist

- [ ] Game loads and displays correctly
- [ ] BG.png background appears
- [ ] Game canvas is positioned in white rectangle
- [ ] Player can enter name
- [ ] Game starts when "Start" button clicked
- [ ] Arrow keys control snake movement
- [ ] Snake grows when eating food
- [ ] Score increases when food eaten
- [ ] Game ends on wall collision
- [ ] Game ends on self collision
- [ ] Score saves to localStorage after game ends
- [ ] High score list (top 3) displays in white rectangle area on page load when no game is active
- [ ] High score list updates after each round
- [ ] Scores are sorted highest to lowest
- [ ] Game canvas replaces high score display when game starts
- [ ] High score display returns to white rectangle when game ends
- [ ] Duplicate player names are allowed and distinguished by timestamp
- [ ] Turn switches between players correctly
- [ ] Turn indicator shows current player
- [ ] Game works offline (no network required)

### Browser Testing

Test in multiple browsers:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

### Edge Case Testing

- [ ] Empty player name (should show error)
- [ ] Whitespace-only name (should show error)
- [ ] Rapid arrow key presses (should queue direction changes)
- [ ] Browser storage quota exceeded (should show error)
- [ ] Corrupted localStorage data (should handle gracefully)
- [ ] BG.png missing (should handle gracefully)
- [ ] Tab loses focus during game (optional: pause game)

## Troubleshooting

### Game Not Starting

- Check browser console for JavaScript errors
- Verify all script files are loaded
- Check that canvas element exists in DOM

### Scores Not Saving

- Check browser console for storage errors
- Verify localStorage is enabled in browser
- Check storage quota (should be sufficient for 100+ rounds)

### Canvas Not Visible

- Check CSS positioning
- Verify canvas dimensions are set
- Check that BG.png white rectangle coordinates are correct

### Arrow Keys Not Working

- Verify keyboard event listeners are attached
- Check that game is in "active" state
- Ensure no other elements are capturing keyboard events

## Next Steps

After quickstart validation:
1. Review [plan.md](./plan.md) for implementation details
2. Check [data-model.md](./data-model.md) for data structures
3. Review [contracts/](./contracts/) for module interfaces
4. Proceed to `/speckit.tasks` to generate implementation tasks

## Validation

Before proceeding to implementation, verify:
- ✅ All files can be created and loaded
- ✅ Game renders correctly in browser
- ✅ Basic gameplay works (movement, collision)
- ✅ Scores save and load correctly
- ✅ Turn switching works
- ✅ High score list displays correctly

