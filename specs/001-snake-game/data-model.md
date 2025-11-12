# Data Model: Two-Player Turn-Based Snake Game

**Date**: 2025-11-12  
**Feature**: [spec.md](./spec.md)  
**Plan**: [plan.md](./plan.md)

## Entities

### Player

Represents a person playing the game.

**Attributes**:
- `name` (string, required): Player's name entered before playing
  - Validation: Non-empty string after trimming whitespace
  - Min length: 1 character
  - Max length: 50 characters (reasonable limit)
  - Display: Shown in UI, high score list, and turn indicator
  - **Note**: Duplicate player names are allowed. Scores from players with the same name are distinguished by timestamp.

**Relationships**:
- Has many GameRound entries (one player can play multiple rounds)

**State Transitions**:
- Created when player enters name
- Active during their turn
- Inactive when other player's turn

---

### GameRound

Represents a single play session with its result.

**Attributes**:
- `playerName` (string, required): Name of player who played this round
  - References Player.name
  - Validation: Must match a player name from current session or historical data
- `score` (number, required): Final score achieved in this round
  - Validation: Non-negative integer
  - Min: 0 (game ended immediately)
  - Max: Theoretical maximum based on game area size
- `timestamp` (number, required): Unix timestamp (milliseconds) when round completed
  - Format: JavaScript Date.now() value
  - Used for sorting and display order
  - Used to distinguish rounds from players with duplicate names
  - Validation: Valid timestamp, not in future

**Relationships**:
- Belongs to Player (via playerName)
- Part of HighScoreList collection

**State Transitions**:
- Created when round starts (initialized with score 0)
- Updated during gameplay (score increments)
- Finalized when game ends (score saved, timestamp recorded)

**Storage**:
- Persisted in localStorage as part of scores array
- Key: "snakeGameScores"
- Format: JSON array of GameRound objects

---

### HighScoreList

Collection of all game rounds, sorted and displayed.

**Attributes**:
- `rounds` (array of GameRound, required): All saved game rounds
  - Default: Empty array []
  - Loaded from localStorage on page init
  - Updated after each round completion

**Operations**:
- `addRound(round: GameRound)`: Add new round to collection
- `getSortedRounds(limit?: number)`: Return rounds sorted by score (descending), optionally limited to top N
- `getTop3Rounds()`: Return top 3 rounds sorted by score (descending)
- `getPlayerRounds(playerName: string)`: Filter rounds by player name
- `loadFromStorage()`: Load rounds from localStorage
- `saveToStorage()`: Persist rounds to localStorage

**Sorting**:
- Primary: Score (descending - highest first)
- Secondary: Timestamp (descending - most recent first, for tie-breaking)

**Display**:
- Shows top 3 rounds in white rectangle area when no game is active
- Displays: playerName, score, optionally formatted timestamp
- Updates in real-time after each round
- Game canvas replaces high score display when game is active

---

### GameState

Current state of an active game session.

**Attributes**:
- `status` (enum, required): Current game status
  - Values: "waiting" | "active" | "paused" | "ended"
  - Transitions: waiting → active → ended
- `currentPlayer` (number | null, required): Which player's turn (1 or 2, null if waiting)
  - Validation: 1, 2, or null
- `player1Name` (string | null): Name of first player
- `player2Name` (string | null): Name of second player
- `snake` (array of coordinates, required): Snake body segments
  - Format: `[{x: number, y: number}, ...]`
  - First element is head, last is tail
  - Validation: All coordinates within game bounds
- `direction` (string, required): Current movement direction
  - Values: "up" | "down" | "left" | "right"
  - Validation: Must be valid direction
  - Cannot reverse (e.g., cannot go "down" if currently "up")
- `nextDirection` (string | null): Queued direction change
  - Used to handle rapid key presses
  - Applied on next movement tick
- `food` (object | null): Current food position
  - Format: `{x: number, y: number}`
  - Null if no food (shouldn't happen in normal gameplay)
  - Validation: Within game bounds, not overlapping snake
- `score` (number, required): Current score for this round
  - Starts at 0
  - Increments when food is eaten
  - Validation: Non-negative integer
- `gameSpeed` (number, required): Milliseconds between snake movements
  - Default: 150ms
  - Can be adjusted for difficulty
  - Validation: Positive number, reasonable range (50-500ms)

**State Transitions**:
```
waiting → active (when player enters name and starts)
active → paused (when tab loses focus - optional)
paused → active (when tab regains focus - optional)
active → ended (when collision detected)
ended → waiting (when ready for next player)
```

**Validation Rules**:
- Snake head cannot be outside game boundaries
- Snake segments cannot overlap (except during growth animation)
- Food must be placed in valid empty cell
- Direction changes must be 90-degree turns (no reverse)

---

## Data Flow

### Round Lifecycle

1. **Initialization**:
   - Player enters name
   - GameState created with status="waiting"
   - currentPlayer set to 1 or 2

2. **Game Start**:
   - GameState.status = "active"
   - Snake initialized at starting position
   - Food placed at random location
   - Score = 0
   - Game loop starts

3. **During Gameplay**:
   - Snake moves at fixed intervals
   - Direction updated from keyboard input
   - Collision detection each frame
   - Score increments when food eaten
   - Snake grows when food eaten
   - New food placed when eaten

4. **Game End**:
   - Collision detected (wall or self)
   - GameState.status = "ended"
   - Final score recorded
   - GameRound created with playerName, score, timestamp
   - GameRound added to HighScoreList
   - HighScoreList saved to localStorage
   - UI updated (high score list refreshed)

5. **Next Turn**:
   - GameState.currentPlayer switches (1→2 or 2→1)
   - GameState.status = "waiting"
   - UI prompts for next player name
   - Process repeats from step 1

### Storage Operations

**Load on Page Init**:
```javascript
1. Read localStorage.getItem("snakeGameScores")
2. Parse JSON string to array
3. Handle errors (corrupted data, missing key)
4. Initialize HighScoreList with loaded rounds
5. Display high score list in UI
```

**Save after Round**:
```javascript
1. Create GameRound object
2. Add to HighScoreList.rounds array
3. Sort HighScoreList (by score descending)
4. Stringify to JSON
5. localStorage.setItem("snakeGameScores", jsonString)
6. Handle quota exceeded errors
7. Update UI high score list
```

---

## Validation Rules

### Player Name
- Required: Yes
- Type: String
- Min length: 1 (after trim)
- Max length: 50
- Whitespace: Trimmed before validation
- Empty/whitespace-only: Rejected with error message

### Score
- Required: Yes
- Type: Number (integer)
- Min: 0
- Max: Theoretical maximum (game area size in cells)
- Validation: Non-negative integer

### Timestamp
- Required: Yes
- Type: Number (Unix timestamp in milliseconds)
- Validation: Valid number, not in future, reasonable range

### Game Coordinates
- X, Y: Integers within game bounds
- Game bounds: 0 to (canvasWidth/cellSize - 1), 0 to (canvasHeight/cellSize - 1)
- Validation: Within bounds, integer values

---

## Error Handling

### Storage Errors

**Quota Exceeded**:
- Detect: Catch QuotaExceededError
- Action: Show user-friendly error message
- Fallback: Keep in-memory, attempt save on next round
- Limit: Prevent further saves if quota consistently exceeded

**Corrupted Data**:
- Detect: JSON.parse() throws error
- Action: Initialize empty array, log error
- Recovery: Start fresh, previous scores lost (acceptable for local-only game)

**Missing Data**:
- Detect: localStorage.getItem() returns null
- Action: Initialize empty array (first time use)

### Game State Errors

**Invalid Direction**:
- Detect: Attempt to reverse direction
- Action: Ignore invalid direction change
- Prevention: Validate before applying direction

**Out of Bounds**:
- Detect: Snake head outside game area
- Action: Trigger game over (collision with wall)

**Overlap Detection**:
- Detect: Snake head overlaps body segment
- Action: Trigger game over (collision with self)

---

## Data Persistence Format

### localStorage Structure

**Key**: `"snakeGameScores"`

**Value**: JSON string representing array of GameRound objects

**Example**:
```json
[
  {
    "playerName": "Alice",
    "score": 150,
    "timestamp": 1701234567890
  },
  {
    "playerName": "Bob",
    "score": 120,
    "timestamp": 1701234500000
  },
  {
    "playerName": "Alice",
    "score": 95,
    "timestamp": 1701234400000
  }
]
```

**Migration**: Not applicable (first version, no migration needed)

**Backup**: Not required (local-only game, data loss acceptable per requirements)

