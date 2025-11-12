# Contract: Game Module (game.js)

**Module**: `js/game.js`  
**Purpose**: Core game logic for Snake gameplay

## Exports

### `class Game`

Main game controller class.

#### Constructor

```javascript
new Game(canvas: HTMLCanvasElement, options?: GameOptions)
```

**Parameters**:
- `canvas` (HTMLCanvasElement, required): Canvas element for rendering
- `options` (GameOptions, optional): Configuration options
  ```typescript
  interface GameOptions {
    cellSize?: number;        // Size of each grid cell in pixels (default: 20)
    gameSpeed?: number;       // Milliseconds between moves (default: 150)
    initialLength?: number;   // Initial snake length (default: 3)
  }
  ```

#### Methods

##### `start()`

Start the game loop and initialize game state.

**Returns**: `void`

**Side Effects**:
- Initializes snake at starting position
- Places food at random location
- Starts game loop (requestAnimationFrame)
- Sets game status to "active"

**Errors**: None expected

---

##### `pause()`

Pause the game loop.

**Returns**: `void`

**Side Effects**:
- Stops game loop
- Sets game status to "paused"

**Errors**: None expected

---

##### `resume()`

Resume paused game.

**Returns**: `void`

**Side Effects**:
- Restarts game loop
- Sets game status to "active"

**Errors**: Throws if game not paused

---

##### `end()`

End the current game.

**Returns**: `GameResult`

**Side Effects**:
- Stops game loop
- Sets game status to "ended"
- Clears game state

**Return Type**:
```typescript
interface GameResult {
  score: number;
  reason: "wall" | "self" | "manual";
}
```

**Errors**: None expected

---

##### `changeDirection(direction: Direction)`

Change snake movement direction.

**Parameters**:
- `direction` (Direction, required): New direction
  ```typescript
  type Direction = "up" | "down" | "left" | "right";
  ```

**Returns**: `void`

**Side Effects**:
- Queues direction change (applied on next move)
- Validates direction (prevents reverse)

**Errors**: 
- Throws if direction is invalid
- Silently ignores if direction would reverse current direction

---

##### `getState()`

Get current game state.

**Returns**: `GameState`

**Return Type**:
```typescript
interface GameState {
  status: "waiting" | "active" | "paused" | "ended";
  score: number;
  snake: Array<{x: number, y: number}>;
  food: {x: number, y: number} | null;
  direction: Direction;
}
```

**Errors**: None expected

---

##### `on(event: string, callback: Function)`

Register event listener.

**Parameters**:
- `event` (string, required): Event name
  - `"foodEaten"`: Emitted when snake eats food
  - `"collision"`: Emitted when collision detected
  - `"scoreChanged"`: Emitted when score changes
- `callback` (Function, required): Event handler

**Returns**: `void`

**Errors**: None expected

---

##### `off(event: string, callback: Function)`

Remove event listener.

**Parameters**:
- `event` (string, required): Event name
- `callback` (Function, required): Event handler to remove

**Returns**: `void`

**Errors**: None expected

---

## Internal Methods (Private)

### `_update()`

Update game state (called by game loop).

**Returns**: `void`

**Side Effects**:
- Moves snake
- Checks collisions
- Handles food eating
- Updates score

---

### `_render()`

Render game to canvas.

**Returns**: `void`

**Side Effects**:
- Clears canvas
- Draws snake
- Draws food
- Draws score (optional)

---

### `_checkCollision()`

Check for collisions (wall or self).

**Returns**: `boolean` (true if collision detected)

---

### `_placeFood()`

Place food at random empty location.

**Returns**: `void`

**Side Effects**:
- Sets food position
- Ensures food not on snake

---

## Events

### `foodEaten`

Emitted when snake head touches food.

**Payload**: `{score: number}`

---

### `collision`

Emitted when collision detected.

**Payload**: `{reason: "wall" | "self", score: number}`

---

### `scoreChanged`

Emitted when score changes.

**Payload**: `{score: number}`

---

## Usage Example

```javascript
import { Game } from './game.js';

const canvas = document.getElementById('gameCanvas');
const game = new Game(canvas, { cellSize: 20, gameSpeed: 150 });

game.on('collision', (data) => {
  console.log(`Game over! Score: ${data.score}`);
  // Handle game end
});

game.on('foodEaten', (data) => {
  console.log(`Score: ${data.score}`);
});

game.start();

// Handle keyboard input
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowUp') game.changeDirection('up');
  if (e.key === 'ArrowDown') game.changeDirection('down');
  if (e.key === 'ArrowLeft') game.changeDirection('left');
  if (e.key === 'ArrowRight') game.changeDirection('right');
});
```

