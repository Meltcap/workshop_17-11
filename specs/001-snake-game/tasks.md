# Tasks: Two-Player Turn-Based Snake Game

**Input**: Design documents from `/specs/001-snake-game/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are OPTIONAL and not requested in the feature specification. No test tasks included.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: Root-level directories (styles/, js/, assets/) per plan.md structure

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create project directory structure (styles/, js/, assets/) at repository root
- [x] T002 [P] Create index.html with basic HTML structure and meta tags
- [x] T003 [P] Create styles/main.css with FD BUSINESS color scheme variables (primary: #379596, content: #191919, background: #ffeadb)
- [x] T004 [P] Create styles/game.css for game-specific styling
- [x] T005 Copy BG.png image to assets/BG.png

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T006 Create HTML structure in index.html: player input field, start button, score display, high score list container, turn indicator, game container
- [x] T007 [P] Link CSS files (main.css, game.css) in index.html
- [x] T008 [P] Set BG.png as page background in styles/main.css
- [x] T009 [P] Create canvas element in index.html positioned for white rectangle area
- [x] T010 [P] Calculate and set white rectangle coordinates from BG.png for canvas positioning in styles/game.css
- [x] T011 [P] Create js/main.js as application entry point with DOMContentLoaded initialization
- [x] T012 [P] Create js/game.js with empty Game class structure
- [x] T013 [P] Create js/storage.js with empty ScoreStorage class structure
- [x] T014 [P] Create js/ui.js with empty GameUI class structure
- [x] T015 Link all JavaScript modules (game.js, storage.js, ui.js, main.js) in index.html

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Core Snake Gameplay (Priority: P1) 🎯 MVP

**Goal**: A player can play a single round of Snake game with proper visual styling and controls. The game displays in the white rectangle area with FD BUSINESS colors, responds to arrow keys, tracks score, and ends on collision.

**Independent Test**: Can be fully tested by having a single player enter their name, play the game using arrow keys, see their score increase as they collect food, and see the game end when the snake collides with itself or the boundaries. The game must display with the correct visual styling (FD BUSINESS colors and BG.png background) and the playable area must be positioned within the white rectangle of the background image.

### Implementation for User Story 1

- [x] T016 [US1] Implement Game class constructor in js/game.js accepting canvas element and options (cellSize, gameSpeed, initialLength)
- [x] T017 [US1] Implement GameState initialization in js/game.js with status, snake array, direction, food, score attributes
- [x] T018 [US1] Implement snake initialization at starting position in js/game.js _initSnake() method
- [x] T019 [US1] Implement food placement at random empty location in js/game.js _placeFood() method
- [x] T020 [US1] Implement game loop using requestAnimationFrame in js/game.js start() method
- [x] T021 [US1] Implement snake movement logic in js/game.js _update() method (move head, update body)
- [x] T022 [US1] Implement direction change handling in js/game.js changeDirection() method with 90-degree turn validation and reverse prevention
- [x] T023 [US1] Implement collision detection (wall and self) in js/game.js _checkCollision() method
- [x] T024 [US1] Implement food eating logic in js/game.js _update() method (detect food contact, grow snake, increment score, place new food)
- [x] T025 [US1] Implement canvas rendering in js/game.js _render() method (clear canvas, draw snake segments, draw food)
- [x] T026 [US1] Implement game end handling in js/game.js end() method returning GameResult with score and reason
- [x] T027 [US1] Implement event system (on/off) in js/game.js for foodEaten, collision, scoreChanged events
- [x] T028 [US1] Implement GameUI class constructor in js/ui.js accepting UI element options (playerInput, startButton, scoreDisplay, highScoreList, turnIndicator, gameContainer)
- [x] T029 [US1] Implement showPlayerInput() method in js/ui.js to display player name input form
- [x] T030 [US1] Implement getPlayerName() method in js/ui.js with validation (trim whitespace, check min/max length, reject empty)
- [x] T031 [US1] Implement updateScore() method in js/ui.js to update displayed current score
- [x] T032 [US1] Implement showGameOver() method in js/ui.js to display game over message and final score
- [x] T033 [US1] Implement event system (on/off) in js/ui.js for startGame and playerNameEntered events
- [x] T034 [US1] Implement SnakeGameApp class constructor in js/main.js accepting app configuration
- [x] T035 [US1] Implement initialize() method in js/main.js to set up UI and load initial state
- [x] T036 [US1] Implement startGame() method in js/main.js to initialize game, start game loop, and set up keyboard listeners
- [x] T037 [US1] Implement handleKeyPress() method in js/main.js to filter arrow keys and update game direction
- [x] T038 [US1] Wire up keyboard event listeners in js/main.js to call handleKeyPress() on keydown events
- [x] T039 [US1] Wire up UI event listeners in js/main.js to handle startGame event and call startGame()
- [x] T040 [US1] Wire up game event listeners in js/main.js to handle collision event and call endGame()
- [x] T041 [US1] Wire up game event listeners in js/main.js to handle foodEaten event and update score display
- [x] T042 [US1] Style player input form in styles/main.css with FD BUSINESS colors
- [x] T043 [US1] Style start button in styles/main.css with FD BUSINESS primary color (#379596)
- [x] T044 [US1] Style score display in styles/main.css with FD BUSINESS content color (#191919)
- [x] T045 [US1] Position game canvas absolutely in white rectangle area in styles/game.css
- [x] T046 [US1] Style canvas with proper dimensions matching white rectangle coordinates in styles/game.css

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently. A player can enter their name, start the game, control the snake with arrow keys, see score increase, and see game end on collision.

---

## Phase 4: User Story 2 - Score Persistence and High Score Display (Priority: P2)

**Goal**: Game scores are saved to localStorage and the top 3 high scores are displayed in the white rectangle area when no game is active.

**Independent Test**: Can be fully tested by playing multiple rounds, verifying that each round's player name and score are saved to localStorage, and confirming that the top 3 high score list displays in the white rectangle area when no game is active, sorted highest to lowest. The system must work completely offline without any server connection.

### Implementation for User Story 2

- [x] T047 [US2] Implement ScoreStorage class constructor in js/storage.js accepting optional storageKey (default: "snakeGameScores")
- [x] T048 [US2] Implement loadRounds() method in js/storage.js to load and parse JSON array from localStorage with error handling for corrupted data
- [x] T049 [US2] Implement saveRound() method in js/storage.js to load existing rounds, append new round, validate data, and save to localStorage with error handling for quota exceeded
- [x] T050 [US2] Implement getSortedRounds() method in js/storage.js to return rounds sorted by score (descending) with optional limit parameter
- [x] T051 [US2] Implement getTop3Rounds() method in js/storage.js to return top 3 rounds sorted by score (descending)
- [x] T052 [US2] Implement getPlayerRounds() method in js/storage.js to filter rounds by player name
- [x] T053 [US2] Implement clearAll() method in js/storage.js to remove all saved rounds from localStorage
- [x] T054 [US2] Implement displayHighScores() method in js/ui.js to render top 3 scores in white rectangle area with playerName and score format
- [x] T055 [US2] Implement showError() and clearError() methods in js/ui.js for displaying storage error messages
- [x] T056 [US2] Update initialize() method in js/main.js to load high scores from storage and display top 3 in white rectangle area
- [x] T057 [US2] Implement endGame() method in js/main.js to save GameRound (playerName, score, timestamp) to storage using ScoreStorage.saveRound()
- [x] T058 [US2] Update endGame() method in js/main.js to reload and display updated top 3 high scores in white rectangle area after saving
- [x] T059 [US2] Update showGameOver() method in js/ui.js to hide game canvas and show top 3 high scores in white rectangle area
- [x] T060 [US2] Update startGame() method in js/main.js to hide high score display and show game canvas when game starts
- [x] T061 [US2] Style high score list in styles/main.css to display in white rectangle area with FD BUSINESS colors
- [x] T062 [US2] Format high score list items in js/ui.js displayHighScores() to show "PlayerName: Score" format
- [x] T063 [US2] Handle duplicate player names in displayHighScores() by showing all rounds (distinguished by timestamp in sorting)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently. Scores are saved after each round, and the top 3 high scores display in the white rectangle area when no game is active.

---

## Phase 5: User Story 3 - Turn-Based Two-Player Mode (Priority: P3)

**Goal**: Two players can take turns playing the game, with only one player active per round. The system clearly indicates whose turn it is and prevents input during the other player's turn.

**Independent Test**: Can be fully tested by having two players enter their names, verifying that only one player can play at a time, and confirming that after one player's round ends, the system prompts for the next player to take their turn. Each player's scores should be tracked separately and appear in the high score list.

### Implementation for User Story 3

- [x] T064 [US3] Add currentPlayer state (1|2|null) to SnakeGameApp class in js/main.js
- [x] T065 [US3] Add player1Name and player2Name state to SnakeGameApp class in js/main.js
- [x] T066 [US3] Implement getCurrentPlayer() and getCurrentPlayerName() methods in js/main.js
- [x] T067 [US3] Implement switchPlayer() method in js/main.js to alternate between player 1 and player 2
- [x] T068 [US3] Update startGame() method in js/main.js to set currentPlayer and store player name based on turn
- [x] T069 [US3] Update endGame() method in js/main.js to call switchPlayer() after saving score
- [x] T070 [US3] Update endGame() method in js/main.js to show player input for next player after game ends
- [x] T071 [US3] Implement showTurnIndicator() method in js/ui.js to display current player number and name
- [x] T072 [US3] Implement hideTurnIndicator() method in js/ui.js to hide turn indicator
- [x] T073 [US3] Update showPlayerInput() method in js/ui.js to accept playerNumber parameter and update turn indicator
- [x] T074 [US3] Update initialize() method in js/main.js to show player input for player 1 on page load
- [x] T075 [US3] Update handleKeyPress() method in js/main.js to only process input when current player's game is active
- [x] T076 [US3] Update startGame() method in js/main.js to show turn indicator with current player information
- [x] T077 [US3] Update endGame() method in js/main.js to show turn indicator for next player
- [x] T078 [US3] Style turn indicator in styles/main.css with FD BUSINESS colors and clear visibility
- [x] T079 [US3] Update UI to prevent start button click when it's not the current player's turn (already handled by showPlayerInput flow)
- [x] T080 [US3] Ensure high score list shows scores from both players with their respective names

**Checkpoint**: All user stories should now be independently functional. Two players can alternate turns, each player's scores are tracked separately, and the turn indicator clearly shows whose turn it is.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T081 [P] Add error handling for empty/whitespace player names in js/ui.js getPlayerName() method
- [x] T082 [P] Add error handling for corrupted localStorage data in js/storage.js loadRounds() method
- [x] T083 [P] Add error handling for storage quota exceeded in js/storage.js saveRound() method with user-friendly error message
- [x] T084 [P] Add handling for rapid arrow key presses in js/game.js changeDirection() method (queue direction changes)
- [x] T085 [P] Add handling for snake reaching maximum length (fills entire playable area) in js/game.js _checkCollision() method
- [x] T086 [P] Add handling for BG.png image load failure in styles/main.css with fallback background color
- [x] T087 [P] Add validation for player name length (1-50 characters) in js/ui.js getPlayerName() method
- [x] T088 [P] Ensure game works completely offline (no network requests) - verify all assets are local
- [x] T089 [P] Optimize game loop performance to maintain 60fps in js/game.js
- [x] T090 [P] Ensure input response time is under 100ms in js/main.js handleKeyPress() method
- [x] T091 [P] Add visual feedback for game over state in styles/game.css
- [x] T092 [P] Add visual feedback for turn indicator highlighting in styles/main.css
- [x] T093 [P] Test high score list display with 100+ saved rounds for performance in js/ui.js displayHighScores() method
- [x] T094 [P] Verify canvas positioning matches white rectangle coordinates exactly in styles/game.css
- [x] T095 [P] Run quickstart.md validation checklist to ensure all requirements are met

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Depends on US1 for game end event to trigger score saving
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Depends on US1 for game flow and US2 for score tracking per player

### Within Each User Story

- Core game logic before UI integration
- Storage implementation before UI display
- UI components before main app orchestration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel (T002-T005)
- All Foundational tasks marked [P] can run in parallel (T007-T015)
- Once Foundational phase completes:
  - User Story 1 tasks can be worked on independently
  - User Story 2 can start after US1 game end is implemented
  - User Story 3 can start after US1 and US2 are complete
- All Polish tasks marked [P] can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch foundational setup tasks in parallel:
Task: "Create index.html with basic HTML structure and meta tags"
Task: "Create styles/main.css with FD BUSINESS color scheme variables"
Task: "Create styles/game.css for game-specific styling"
Task: "Copy BG.png image to assets/BG.png"

# Launch JavaScript module creation in parallel:
Task: "Create js/main.js as application entry point"
Task: "Create js/game.js with empty Game class structure"
Task: "Create js/storage.js with empty ScoreStorage class structure"
Task: "Create js/ui.js with empty GameUI class structure"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (game logic and UI)
   - Developer B: User Story 2 (storage and high scores) - can start after US1 game end
   - Developer C: User Story 3 (turn management) - can start after US1 and US2
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- All file paths are relative to repository root per plan.md structure
- Canvas positioning must match white rectangle coordinates from BG.png
- High score display (top 3) replaces game canvas when no game is active
- Duplicate player names are allowed and distinguished by timestamp in sorting

