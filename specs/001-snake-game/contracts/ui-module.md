# Contract: UI Module (ui.js)

**Module**: `js/ui.js`  
**Purpose**: UI management for player input, turn management, and high score display

## Exports

### `class GameUI`

Manages user interface elements and interactions.

#### Constructor

```javascript
new GameUI(options: UIOptions)
```

**Parameters**:
```typescript
interface UIOptions {
  playerInput: HTMLElement;        // Player name input element
  startButton: HTMLElement;        // Start game button
  scoreDisplay: HTMLElement;       // Current score display
  highScoreList: HTMLElement;      // High score list container
  turnIndicator: HTMLElement;      // Current player turn indicator
  gameContainer: HTMLElement;      // Game container element
}
```

---

#### Methods

##### `showPlayerInput(playerNumber: 1 | 2): void`

Show player input form for specified player.

**Parameters**:
- `playerNumber` (1 | 2, required): Which player's turn

**Returns**: `void`

**Side Effects**:
- Shows player input form
- Updates turn indicator
- Clears previous input
- Focuses input field

**Errors**: None expected

---

##### `hidePlayerInput(): void`

Hide player input form.

**Returns**: `void`

**Side Effects**:
- Hides player input form
- Clears input value

**Errors**: None expected

---

##### `getPlayerName(): string | null`

Get entered player name.

**Returns**: `string | null` (null if empty/invalid)

**Validation**:
- Trims whitespace
- Returns null if empty after trim
- Returns null if exceeds max length (50)

**Errors**: None expected

---

##### `updateScore(score: number): void`

Update displayed current score.

**Parameters**:
- `score` (number, required): Current score

**Returns**: `void`

**Side Effects**:
- Updates score display element

**Errors**: None expected

---

##### `displayHighScores(rounds: Array<GameRound>): void`

Display high score list in white rectangle area.

**Parameters**:
- `rounds` (Array<GameRound>, required): Sorted rounds to display (typically top 3)

**Returns**: `void`

**Side Effects**:
- Clears existing high score list
- Renders rounds as list items in white rectangle area
- Formats scores and player names
- Only displays when no game is active

**Format**:
- Each round: "PlayerName: Score"
- Sorted by score (highest first)
- Displays top 3 scores only
- Optional: Show timestamp or rank
- Positioned in white rectangle area of BG.png

**Errors**: None expected

---

##### `showGameOver(score: number, reason: string): void`

Show game over message and restore high score display.

**Parameters**:
- `score` (number, required): Final score
- `reason` (string, required): Reason for game over ("wall" | "self")

**Returns**: `void`

**Side Effects**:
- Displays game over message
- Shows final score
- Hides game canvas
- Shows top 3 high scores in white rectangle area
- Shows option to play again

**Errors**: None expected

---

##### `showTurnIndicator(playerNumber: 1 | 2, playerName: string): void`

Update turn indicator to show current player.

**Parameters**:
- `playerNumber` (1 | 2, required): Current player number
- `playerName` (string, required): Current player name

**Returns**: `void`

**Side Effects**:
- Updates turn indicator text
- Highlights current player

**Errors**: None expected

---

##### `hideTurnIndicator(): void`

Hide turn indicator.

**Returns**: `void`

**Side Effects**:
- Hides turn indicator element

**Errors**: None expected

---

##### `on(event: string, callback: Function): void`

Register event listener.

**Parameters**:
- `event` (string, required): Event name
  - `"startGame"`: Emitted when start button clicked
  - `"playerNameEntered"`: Emitted when player name submitted
- `callback` (Function, required): Event handler

**Returns**: `void`

**Errors**: None expected

---

##### `off(event: string, callback: Function): void`

Remove event listener.

**Parameters**:
- `event` (string, required): Event name
- `callback` (Function, required): Event handler to remove

**Returns**: `void`

**Errors**: None expected

---

##### `showError(message: string): void`

Display error message to user.

**Parameters**:
- `message` (string, required): Error message

**Returns**: `void`

**Side Effects**:
- Displays error message in UI
- Auto-dismisses after timeout (optional)

**Errors**: None expected

---

##### `clearError(): void`

Clear error message.

**Returns**: `void`

**Side Effects**:
- Removes error message from UI

**Errors**: None expected

---

## Events

### `startGame`

Emitted when start button is clicked.

**Payload**: `{playerName: string, playerNumber: 1 | 2}`

**Validation**:
- Only emitted if player name is valid
- Prevents emission if name is empty/invalid

---

### `playerNameEntered`

Emitted when player name is entered and validated.

**Payload**: `{playerName: string, playerNumber: 1 | 2}`

---

## Usage Example

```javascript
import { GameUI } from './ui.js';

const ui = new GameUI({
  playerInput: document.getElementById('playerInput'),
  startButton: document.getElementById('startButton'),
  scoreDisplay: document.getElementById('scoreDisplay'),
  highScoreList: document.getElementById('highScoreList'),
  turnIndicator: document.getElementById('turnIndicator'),
  gameContainer: document.getElementById('gameContainer')
});

ui.on('startGame', (data) => {
  console.log(`Starting game for ${data.playerName}`);
  // Start game logic
});

ui.showPlayerInput(1);
ui.updateScore(50);
ui.displayHighScores([
  { playerName: "Alice", score: 150, timestamp: 1701234567890 },
  { playerName: "Bob", score: 120, timestamp: 1701234500000 }
]);
```

