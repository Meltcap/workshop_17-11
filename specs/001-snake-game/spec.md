# Feature Specification: Two-Player Turn-Based Snake Game

**Feature Branch**: `001-snake-game`  
**Created**: 2025-11-12  
**Status**: Draft  
**Input**: User description: "We want to build a simple browser-based Snake Game that two people can play in turns."

## Clarifications

### Session 2025-11-12

- Q: What happens when two players have the same name - how are their scores distinguished? → A: Allow duplicate player names; scores are distinguished by timestamp
- Q: Where should the game be displayed in relation to BG.png? → A: The game canvas must be displayed inside the white rectangle area of BG.png
- Q: Where and how should high scores be displayed? → A: Display top 3 high scores in the white rectangle area when no game is actively playing

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Core Snake Gameplay (Priority: P1)

A player can play a single round of Snake game with proper visual styling and controls.

**Why this priority**: This is the foundational gameplay experience. Without a playable Snake game, no other features (scoring, turn-taking) have value. This delivers the core entertainment value independently.

**Independent Test**: Can be fully tested by having a single player enter their name, play the game using arrow keys, see their score increase as they collect food, and see the game end when the snake collides with itself or the boundaries. The game must display with the correct visual styling (FD BUSINESS colors and BG.png background) and the playable area must be positioned within the white rectangle of the background image.

**Acceptance Scenarios**:

1. **Given** the game page is loaded, **When** a player enters their name and starts the game, **Then** the Snake game appears with the playable area positioned inside the white rectangle of BG.png (replacing the high score display), using FD BUSINESS color scheme (primary: #379596, content: #191919, background: #ffeadb)
2. **Given** the game is active, **When** the player presses arrow keys (Up, Down, Left, Right), **Then** the snake moves in the corresponding direction
3. **Given** the snake is moving, **When** the snake's head touches food, **Then** the snake grows longer, the score increases, and new food appears at a random location
4. **Given** the snake is moving, **When** the snake's head touches the game boundaries or its own body, **Then** the game ends and the final score is displayed
5. **Given** the game has ended, **When** the player views the game screen, **Then** they can see their final score for that round, and the top 3 high scores are displayed in the white rectangle area

---

### User Story 2 - Score Persistence and High Score Display (Priority: P2)

Game scores are saved to a local JSON file and a high score list is displayed on the game page.

**Why this priority**: Score tracking enables competitive play and historical record-keeping. This feature can be tested independently by verifying that scores are saved and loaded correctly, even without turn-based functionality.

**Independent Test**: Can be fully tested by playing multiple rounds, verifying that each round's player name and score are saved to the local JSON file, and confirming that the high score list on the page displays all saved scores sorted appropriately (highest first). The system must work completely offline without any server connection.

**Acceptance Scenarios**:

1. **Given** a game round has ended with a score, **When** the round completes, **Then** the player's name and score are automatically saved to a local JSON file in the browser
2. **Given** scores have been saved from previous rounds, **When** the game page loads and no game is active, **Then** the top 3 high scores are displayed in the white rectangle area showing player names and scores from the JSON file
3. **Given** multiple scores exist in the JSON file, **When** the high score list is displayed, **Then** scores are sorted from highest to lowest and only the top 3 are shown in the white rectangle area
4. **Given** the browser is offline, **When** scores are saved or loaded, **Then** all operations complete successfully using only local browser storage
5. **Given** a player has played multiple rounds, **When** viewing the high score list, **Then** all rounds for that player are shown with their respective scores

---

### User Story 3 - Turn-Based Two-Player Mode (Priority: P3)

Two players can take turns playing the game, with only one player active per round.

**Why this priority**: This enables the collaborative two-player experience. While the core game (P1) and scoring (P2) work independently, this story adds the turn-taking mechanism that makes it a two-player game. This can be tested independently by verifying that players can alternate turns correctly.

**Independent Test**: Can be fully tested by having two players enter their names, verifying that only one player can play at a time, and confirming that after one player's round ends, the system prompts for the next player to take their turn. Each player's scores should be tracked separately and appear in the high score list.

**Acceptance Scenarios**:

1. **Given** the game page is loaded, **When** two players want to play, **Then** the first player enters their name and plays their round
2. **Given** the first player's round has ended, **When** their game ends, **Then** the system prompts for the second player to enter their name and play
3. **Given** the second player's round has ended, **When** their game ends, **Then** the system allows the first player to play again (alternating turns)
4. **Given** players are taking turns, **When** viewing the game interface, **Then** it is clear which player's turn it is and only that player can control the game
5. **Given** both players have completed rounds, **When** viewing the high score list, **Then** scores from both players are displayed with their respective names

---

### Edge Cases

- What happens when a player enters an empty name or only whitespace?
- What happens when the JSON file becomes corrupted or unreadable?
- What happens when browser storage quota is exceeded?
- What happens when a player presses multiple arrow keys rapidly in succession?
- What happens when the snake reaches maximum possible length (fills entire playable area)?
- What happens when the game is closed mid-round - is the score saved or discarded?
- What happens when two players have the same name - how are their scores distinguished? → **RESOLVED**: Duplicate player names are allowed; scores are distinguished by timestamp (FR-017)
- What happens when the BG.png image fails to load?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow each player to enter their name before playing a round
- **FR-002**: System MUST enforce that only one player plays per round
- **FR-003**: System MUST control the snake using arrow keys (Up, Down, Left, Right)
- **FR-004**: System MUST use FD BUSINESS color scheme: primary color #379596, content color #191919, background color #ffeadb
- **FR-005**: System MUST display BG.png as the game background image
- **FR-006**: System MUST position the playable Snake game area inside the white rectangle of BG.png
- **FR-007**: System MUST save player name and score to a local JSON file after each round completes
- **FR-008**: System MUST store all game rounds and scores in the same local JSON file
- **FR-009**: System MUST operate without any backend server or network connection
- **FR-010**: System MUST display a high score list on the game page showing the top 3 scores
- **FR-011**: System MUST load high scores from the local JSON file when the page loads
- **FR-012**: System MUST work completely offline in the browser
- **FR-013**: System MUST allow players to take turns, alternating between two players
- **FR-014**: System MUST prevent player input during the other player's turn
- **FR-015**: System MUST display whose turn it is to play
- **FR-016**: System MUST display the top 3 high scores in the white rectangle area when no game is actively playing
- **FR-017**: System MUST allow duplicate player names; scores with the same player name are distinguished by timestamp

### Key Entities *(include if feature involves data)*

- **Player**: Represents a person playing the game. Key attributes: name (text entered by player). Note: Duplicate player names are allowed; scores are distinguished by timestamp.
- **Game Round**: Represents a single play session. Key attributes: player name, score (numeric), timestamp (when the round was played). Timestamp is used to distinguish rounds from players with the same name.
- **High Score List**: Collection of all game rounds, sorted by score (highest first). Displayed on the game page showing top 3 scores in the white rectangle area when no game is active, and persisted in JSON file
- **Game State**: Current state of an active game. Key attributes: snake position, food position, current score, direction, game status (active/ended)

## Assumptions

- Players have access to a modern web browser with JavaScript enabled
- Players have a keyboard with arrow keys available
- The BG.png image file is available in the expected location
- Browser supports local storage mechanisms for saving JSON data
- Players understand basic Snake game mechanics (snake grows when eating food, game ends on collision)
- The game is designed for two players sharing the same device/browser

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Players can complete a full game round (from name entry to game over) in under 5 minutes
- **SC-002**: The game responds to arrow key input within 100 milliseconds of key press
- **SC-003**: Score data persists correctly across browser sessions (100% of saved scores are retrievable after page reload)
- **SC-004**: The high score list displays correctly for up to 100 saved game rounds without performance degradation
- **SC-005**: The game functions completely offline without requiring any network connectivity
- **SC-006**: Two players can successfully alternate turns without confusion about whose turn it is (100% clarity in turn indication)
- **SC-007**: The playable game area is correctly positioned within the white rectangle of BG.png with no visual overflow or misalignment
