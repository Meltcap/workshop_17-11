# Contract: Main Module (main.js)

**Module**: `js/main.js`  
**Purpose**: Application entry point and orchestration

## Exports

### `class SnakeGameApp`

Main application controller that orchestrates game, storage, and UI modules.

#### Constructor

```javascript
new SnakeGameApp(config: AppConfig)
```

**Parameters**:
```typescript
interface AppConfig {
  canvas: HTMLCanvasElement;
  playerInput: HTMLElement;
  startButton: HTMLElement;
  scoreDisplay: HTMLElement;
  highScoreList: HTMLElement;
  turnIndicator: HTMLElement;
  gameContainer: HTMLElement;
  storageKey?: string;
  gameOptions?: GameOptions;
}
```

---

#### Methods

##### `async initialize(): Promise<void>`

Initialize application and load saved scores.

**Returns**: `Promise<void>`

**Side Effects**:
- Loads high scores from storage
- Displays high score list
- Sets up event listeners
- Shows player input for first player

**Errors**:
- Handles storage errors gracefully
- Shows error message if initialization fails

---

##### `startGame(playerName: string, playerNumber: 1 | 2): Promise<void>`

Start a new game round for specified player.

**Parameters**:
- `playerName` (string, required): Player name
- `playerNumber` (1 | 2, required): Player number

**Returns**: `Promise<void>`

**Side Effects**:
- Validates player name
- Initializes game state
- Starts game loop
- Updates UI (hides input, shows game)
- Sets up keyboard listeners

**Errors**:
- Throws if player name invalid
- Throws if game already active

---

##### `async endGame(score: number, reason: string): Promise<void>`

End current game and save score.

**Parameters**:
- `score` (number, required): Final score
- `reason` (string, required): Game over reason

**Returns**: `Promise<void>`

**Side Effects**:
- Stops game loop
- Saves round to storage
- Updates high score list
- Shows game over message
- Prepares for next player's turn

**Errors**:
- Handles storage errors
- Shows error if save fails

---

##### `switchPlayer(): void`

Switch to next player's turn.

**Returns**: `void`

**Side Effects**:
- Updates current player (1→2 or 2→1)
- Shows player input for next player
- Updates turn indicator

**Errors**: None expected

---

##### `handleKeyPress(event: KeyboardEvent): void`

Handle keyboard input for game control.

**Parameters**:
- `event` (KeyboardEvent, required): Keyboard event

**Returns**: `void`

**Side Effects**:
- Filters arrow key presses
- Updates game direction
- Prevents default behavior (page scroll)

**Key Mapping**:
- ArrowUp → "up"
- ArrowDown → "down"
- ArrowLeft → "left"
- ArrowRight → "right"

**Errors**: None expected

---

##### `getCurrentPlayer(): 1 | 2 | null`

Get current player number.

**Returns**: `1 | 2 | null`

**Errors**: None expected

---

##### `getCurrentPlayerName(): string | null`

Get current player name.

**Returns**: `string | null`

**Errors**: None expected

---

## Initialization Flow

1. **Page Load**:
   ```javascript
   const app = new SnakeGameApp(config);
   await app.initialize();
   ```

2. **Player 1 Turn**:
   - UI shows input for player 1
   - Player enters name, clicks start
   - `app.startGame(playerName, 1)` called
   - Game starts, keyboard listeners active

3. **Game End**:
   - Collision detected
   - `app.endGame(score, reason)` called
   - Score saved, high score list updated
   - `app.switchPlayer()` called

4. **Player 2 Turn**:
   - UI shows input for player 2
   - Process repeats

5. **Alternating Turns**:
   - Continues alternating between players

---

## Usage Example

```javascript
import { SnakeGameApp } from './main.js';

// Get DOM elements
const canvas = document.getElementById('gameCanvas');
const playerInput = document.getElementById('playerInput');
const startButton = document.getElementById('startButton');
const scoreDisplay = document.getElementById('scoreDisplay');
const highScoreList = document.getElementById('highScoreList');
const turnIndicator = document.getElementById('turnIndicator');
const gameContainer = document.getElementById('gameContainer');

// Initialize app
const app = new SnakeGameApp({
  canvas,
  playerInput,
  startButton,
  scoreDisplay,
  highScoreList,
  turnIndicator,
  gameContainer,
  gameOptions: {
    cellSize: 20,
    gameSpeed: 150
  }
});

// Start application
app.initialize().then(() => {
  console.log('Game ready!');
});

// Set up UI event handlers
const ui = app.getUI();
ui.on('startGame', async (data) => {
  try {
    await app.startGame(data.playerName, data.playerNumber);
  } catch (error) {
    ui.showError('Failed to start game');
  }
});

// Set up game event handlers
const game = app.getGame();
game.on('collision', async (data) => {
  await app.endGame(data.score, data.reason);
  app.switchPlayer();
});

game.on('foodEaten', (data) => {
  ui.updateScore(data.score);
});

// Handle keyboard input
document.addEventListener('keydown', (e) => {
  app.handleKeyPress(e);
});
```

---

## Module Dependencies

- `./game.js` - Game logic
- `./storage.js` - Score persistence
- `./ui.js` - UI management

---

## Error Handling

All errors are caught and displayed to user via UI error messages. Storage errors are handled gracefully with fallback behavior (e.g., keep scores in memory if storage fails).

