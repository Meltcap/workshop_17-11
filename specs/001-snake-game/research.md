# Research: Two-Player Turn-Based Snake Game

**Date**: 2025-11-12  
**Feature**: [spec.md](./spec.md)  
**Plan**: [plan.md](./plan.md)

## Research Topics

### 1. Canvas Rendering for Snake Game

**Decision**: Use HTML5 Canvas API for game rendering

**Rationale**: 
- Canvas provides pixel-level control needed for precise snake movement and food placement
- Better performance than DOM manipulation for game graphics
- Standard web API, no dependencies required
- Supports smooth 60fps rendering with requestAnimationFrame
- Easy to position within specific coordinates (white rectangle of BG.png)

**Alternatives considered**:
- SVG: More complex for grid-based games, slower performance
- DOM elements: Too slow for smooth game loop, harder to manage many elements
- WebGL: Overkill for 2D grid-based game, adds unnecessary complexity

**Implementation approach**:
- Use `<canvas>` element positioned absolutely within the white rectangle area
- Calculate canvas dimensions based on BG.png white rectangle coordinates
- Use 2D rendering context for drawing snake segments and food
- Canvas replaces high score display when game is active
- High score display (top 3) shown in white rectangle when no game is active

---

### 2. LocalStorage for JSON Persistence

**Decision**: Use browser localStorage API with JSON serialization

**Rationale**:
- localStorage is synchronous, simple to use, and works offline
- No external dependencies required
- Persists across browser sessions
- Sufficient storage capacity (typically 5-10MB) for 100+ game rounds
- Can simulate "JSON file" by storing stringified JSON data

**Alternatives considered**:
- IndexedDB: More complex API, overkill for simple score storage
- SessionStorage: Data lost on browser close, doesn't meet persistence requirement
- Cookies: Limited storage (4KB), sent with every request (unnecessary overhead)
- File System Access API: Requires user permission, not universally supported

**Implementation approach**:
- Store single key "snakeGameScores" containing JSON array of all game rounds
- Format: `[{playerName: string, score: number, timestamp: number}, ...]`
- Load on page init, save after each round completion
- Handle storage quota exceeded errors gracefully

---

### 3. Game Loop Pattern

**Decision**: Use requestAnimationFrame with fixed timestep for game updates

**Rationale**:
- requestAnimationFrame syncs with browser refresh rate (typically 60fps)
- Provides smooth animation without manual timing calculations
- Browser optimizes when tab is inactive (pauses automatically)
- Standard pattern for browser-based games

**Alternatives considered**:
- setInterval: Less smooth, doesn't sync with display refresh, continues when tab inactive
- setTimeout recursion: Similar issues to setInterval, more complex
- Web Workers: Unnecessary complexity for single-threaded game logic

**Implementation approach**:
- Game loop runs at ~60fps using requestAnimationFrame
- Snake moves at fixed intervals (e.g., every 150ms) independent of frame rate
- Separate update logic (game state) from render logic (canvas drawing)
- Pause loop when game is not active (between rounds, game over)

---

### 4. Background Image Positioning and Game Area Calculation

**Decision**: Use CSS background-image with absolute positioning for game canvas

**Rationale**:
- BG.png serves as page background via CSS
- Canvas positioned absolutely within calculated white rectangle coordinates
- Maintains responsive design while ensuring precise game area placement
- Background image scales with viewport, canvas scales proportionally

**Alternatives considered**:
- Single canvas with background drawn: More complex, harder to maintain aspect ratio
- SVG overlay: Unnecessary complexity for static background
- Multiple canvas layers: Overkill for this use case

**Implementation approach**:
- Set BG.png as body background-image with appropriate sizing (cover/contain)
- Calculate white rectangle coordinates from image dimensions
- Position canvas element absolutely at calculated coordinates
- Size canvas to match white rectangle dimensions
- Use CSS media queries if responsive adjustments needed

**Note**: White rectangle coordinates need to be measured from BG.png image:
- Measure pixel coordinates of white rectangle in image
- Calculate percentage or fixed pixel positions
- Use JavaScript to dynamically calculate if image dimensions vary

---

### 5. Arrow Key Input Handling

**Decision**: Use keydown event listener with key code filtering

**Rationale**:
- Standard DOM event handling, no dependencies
- Arrow keys have consistent key codes across browsers
- Prevent default behavior to avoid page scrolling
- Queue direction changes to prevent rapid key press issues

**Alternatives considered**:
- Keyboard API: Limited browser support
- Gamepad API: Overkill for arrow keys only
- Touch gestures: Not required per spec (keyboard only)

**Implementation approach**:
- Listen for keydown events on window or game container
- Filter for ArrowUp (38), ArrowDown (40), ArrowLeft (37), ArrowRight (39)
- Prevent default to stop page scrolling
- Queue direction changes (don't apply immediately) to handle rapid presses
- Only allow 90-degree turns (prevent reverse direction)

---

### 6. Turn-Based State Management

**Decision**: Simple state machine with current player tracking

**Rationale**:
- Minimal complexity for two-player turn-taking
- Clear state transitions: waiting for player → player 1 turn → player 2 turn → repeat
- No need for complex state management library
- Easy to understand and maintain

**Alternatives considered**:
- Redux/state management library: Overkill for simple two-player state
- Event-driven architecture: Unnecessary complexity
- Observer pattern: Not needed for simple state transitions

**Implementation approach**:
- State object: `{currentPlayer: 1|2|null, player1Name: string, player2Name: string, gameActive: boolean}`
- After round ends: save score, switch to next player, show input for next player name
- Clear visual indicator of whose turn it is
- Disable input during other player's turn

---

### 7. Score Sorting and Display

**Decision**: Sort in-memory array by score (descending) before display

**Rationale**:
- Simple array sort operation, no performance concerns for 100 items
- Load all scores from localStorage, sort once, display
- No need for database-like sorting mechanisms

**Alternatives considered**:
- Sort on save: More complex, unnecessary
- External sorting library: Overkill for simple numeric sort
- IndexedDB with indexes: Unnecessary complexity

**Implementation approach**:
- Load JSON array from localStorage
- Sort by score property (descending): `scores.sort((a, b) => b.score - a.score)`
- Take top 3 scores for display
- Render top 3 sorted list to DOM in white rectangle area
- Display only when no game is active (game canvas replaces it when active)
- Update list after each new score is saved
- Duplicate player names are allowed; timestamp distinguishes rounds from same player name

---

## Technical Decisions Summary

| Topic | Decision | Key Rationale |
|-------|----------|---------------|
| Rendering | HTML5 Canvas | Performance, precision, standard API |
| Storage | localStorage + JSON | Simple, offline, sufficient capacity |
| Game Loop | requestAnimationFrame | Smooth 60fps, browser-optimized |
| Background | CSS background + absolute canvas | Maintains image, precise positioning |
| Input | keydown events | Standard, no dependencies |
| State | Simple state object | Minimal complexity for two players |
| Sorting | Array.sort() | Simple, sufficient for 100 items |

## Open Questions Resolved

- ✅ How to position game area in white rectangle: Absolute positioning with calculated coordinates
- ✅ How to persist scores without backend: localStorage with JSON serialization
- ✅ How to achieve smooth gameplay: requestAnimationFrame game loop
- ✅ How to handle rapid key presses: Queue direction changes, prevent reverse
- ✅ How to manage turn-taking: Simple state machine with player tracking

## Implementation Notes

- Canvas dimensions should be calculated based on white rectangle size in BG.png
- Game speed (snake movement interval) can be adjusted for difficulty
- localStorage key: "snakeGameScores" (single key for all rounds)
- Error handling needed for: storage quota exceeded, corrupted JSON data, missing BG.png
- Game should pause/resume appropriately when browser tab loses/gains focus

