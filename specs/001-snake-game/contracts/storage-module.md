# Contract: Storage Module (storage.js)

**Module**: `js/storage.js`  
**Purpose**: LocalStorage wrapper for score persistence

## Exports

### `class ScoreStorage`

Manages game score persistence using browser localStorage.

#### Constructor

```javascript
new ScoreStorage(storageKey?: string)
```

**Parameters**:
- `storageKey` (string, optional): localStorage key (default: "snakeGameScores")

---

#### Methods

##### `saveRound(round: GameRound): Promise<void>`

Save a game round to storage.

**Parameters**:
- `round` (GameRound, required): Round data to save
  ```typescript
  interface GameRound {
    playerName: string;
    score: number;
    timestamp: number;
  }
  ```

**Returns**: `Promise<void>`

**Side Effects**:
- Loads existing rounds from localStorage
- Appends new round to array
- Saves updated array back to localStorage

**Errors**:
- Throws `QuotaExceededError` if storage quota exceeded
- Throws `StorageError` if localStorage unavailable

**Validation**:
- Validates round data (playerName non-empty, score >= 0, valid timestamp)
- Throws `ValidationError` if validation fails

---

##### `loadRounds(): Promise<Array<GameRound>>`

Load all saved rounds from storage.

**Returns**: `Promise<Array<GameRound>>`

**Side Effects**: None

**Errors**:
- Returns empty array if storage key doesn't exist
- Returns empty array if data is corrupted (logs error)
- Throws `StorageError` if localStorage unavailable

**Data Format**:
- Expects JSON array of GameRound objects
- Handles corrupted/malformed JSON gracefully

---

##### `getSortedRounds(limit?: number): Promise<Array<GameRound>>`

Get rounds sorted by score (descending).

**Parameters**:
- `limit` (number, optional): Maximum number of rounds to return (default: all rounds)

**Returns**: `Promise<Array<GameRound>>`

**Side Effects**: None

**Sorting**:
- Primary: Score (descending)
- Secondary: Timestamp (descending, for tie-breaking and distinguishing duplicate player names)

**Errors**: Same as `loadRounds()`

---

##### `getTop3Rounds(): Promise<Array<GameRound>>`

Get top 3 rounds sorted by score (descending).

**Returns**: `Promise<Array<GameRound>>`

**Side Effects**: None

**Sorting**:
- Primary: Score (descending)
- Secondary: Timestamp (descending, for tie-breaking and distinguishing duplicate player names)
- Returns maximum 3 rounds

**Errors**: Same as `loadRounds()`

---

##### `getPlayerRounds(playerName: string): Promise<Array<GameRound>>`

Get all rounds for a specific player.

**Parameters**:
- `playerName` (string, required): Player name to filter by

**Returns**: `Promise<Array<GameRound>>`

**Side Effects**: None

**Errors**: Same as `loadRounds()`

---

##### `clearAll(): Promise<void>`

Clear all saved rounds.

**Returns**: `Promise<void>`

**Side Effects**:
- Removes storage key from localStorage

**Errors**:
- Throws `StorageError` if localStorage unavailable

---

##### `getStorageSize(): number`

Get approximate storage size used (in bytes).

**Returns**: `number` (bytes used)

**Side Effects**: None

**Errors**: None expected

---

## Error Types

### `QuotaExceededError`

Thrown when localStorage quota is exceeded.

**Properties**:
- `message`: Error message
- `code`: "QUOTA_EXCEEDED"

---

### `StorageError`

Thrown when localStorage is unavailable.

**Properties**:
- `message`: Error message
- `code`: "STORAGE_UNAVAILABLE"

---

### `ValidationError`

Thrown when round data validation fails.

**Properties**:
- `message`: Error message
- `code`: "VALIDATION_ERROR"
- `field`: Field that failed validation

---

## Usage Example

```javascript
import { ScoreStorage } from './storage.js';

const storage = new ScoreStorage();

// Save a round
try {
  await storage.saveRound({
    playerName: "Alice",
    score: 150,
    timestamp: Date.now()
  });
} catch (error) {
  if (error.code === 'QUOTA_EXCEEDED') {
    console.error('Storage full!');
  }
}

// Load all rounds
const rounds = await storage.loadRounds();

// Get top 10 scores
const topScores = await storage.getSortedRounds(10);

// Get player's rounds
const playerRounds = await storage.getPlayerRounds("Alice");
```

---

## Storage Format

**Key**: `"snakeGameScores"` (or custom key from constructor)

**Value**: JSON string

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
  }
]
```

