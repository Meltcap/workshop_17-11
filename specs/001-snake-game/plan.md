# Implementation Plan: Two-Player Turn-Based Snake Game

**Branch**: `001-snake-game` | **Date**: 2025-11-12 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-snake-game/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Build a browser-based Snake Game that supports two players taking turns. The game features a clean HTML layout styled with FD BUSINESS colors, uses BG.png as background with the game area positioned inside the white rectangle, implements snake movement with arrow key controls, saves scores to local browser storage (simulating JSON file), and displays the top 3 high scores in the white rectangle area when no game is active. The entire application runs offline in the browser without any backend server or database.

## Technical Context

**Language/Version**: JavaScript (ES6+), HTML5, CSS3  
**Primary Dependencies**: None (vanilla JavaScript) or lightweight libraries for canvas/game loop if needed  
**Storage**: Browser localStorage API (simulating local JSON file persistence)  
**Testing**: Browser-based testing framework (Jest with jsdom or similar)  
**Target Platform**: Modern web browsers (Chrome, Firefox, Safari, Edge - latest 2 versions)  
**Project Type**: Web application (single-page application)  
**Performance Goals**: 60 fps for smooth snake movement, <100ms input response time  
**Constraints**: Must work completely offline, no backend/server required, browser-only storage, responsive layout  
**Scale/Scope**: 2 players, up to 100 saved game rounds, single device shared between players

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Pre-Research Check (Phase 0)

Verify compliance with all applicable principles from `.specify/memory/constitution.md`:

- **Inclusive Collaboration**: ✅ Design uses simple HTML/CSS/JavaScript that is accessible to developers of all skill levels. Clear separation of concerns (HTML structure, CSS styling, JavaScript logic) allows contributors to work on different aspects.
- **Open Communication**: ✅ All design decisions will be documented in research.md and data-model.md. Code will be well-commented for team understanding.
- **Score Persistence**: ✅ Player names and scores are saved to localStorage after each round (FR-007, FR-008). High score list displays all saved scores (FR-010, FR-011, FR-016).
- **Single Player Per Round**: ✅ Only one player plays per round enforced by game state management (FR-002, FR-014).
- **High Score Tracking**: ✅ High score list displays top 3 scores in white rectangle area when no game is active, loaded from localStorage, sorted highest to lowest (FR-010, FR-011, FR-016).
- **Collaborative Decision Making**: ✅ Design decisions documented in plan and research artifacts for team review.
- **FD BUSINESS Color Scheme**: ✅ All visual elements use specified colors: primary #379596, content #191919, background #ffeadb (FR-004).
- **Game Area Layout**: ✅ Game canvas positioned inside white rectangle of BG.png background image. High scores also displayed in white rectangle when game not active (FR-005, FR-006, FR-016).

**Status**: All constitution principles satisfied. No violations.

### Post-Design Check (Phase 1)

After completing research.md, data-model.md, and contracts:

- **Inclusive Collaboration**: ✅ Confirmed - Vanilla JavaScript with no complex dependencies. Module structure (game.js, storage.js, ui.js, main.js) allows parallel work by different skill levels.
- **Open Communication**: ✅ Confirmed - All design decisions documented in research.md (7 topics), data-model.md (4 entities with full specifications), and contracts (4 module interfaces).
- **Score Persistence**: ✅ Confirmed - ScoreStorage class (storage.js) implements localStorage persistence. GameRound entity includes playerName, score, timestamp. High score list loads on init and updates after each round. Duplicate player names allowed, distinguished by timestamp (FR-017).
- **Single Player Per Round**: ✅ Confirmed - GameState entity tracks currentPlayer (1|2|null). UI module manages turn switching. Main app orchestrates player alternation.
- **High Score Tracking**: ✅ Confirmed - HighScoreList entity with sorting by score (descending). UI module displays top 3 scores in white rectangle area when no game is active. Storage module provides getSortedRounds() method with limit support.
- **Collaborative Decision Making**: ✅ Confirmed - All technical decisions (Canvas API, localStorage, requestAnimationFrame, etc.) documented with rationale and alternatives in research.md.
- **FD BUSINESS Color Scheme**: ✅ Confirmed - CSS styling uses exact colors (#379596, #191919, #ffeadb). Styling separated into main.css for easy maintenance.
- **Game Area Layout**: ✅ Confirmed - Research.md documents CSS background-image approach with absolute canvas positioning. Canvas dimensions calculated from white rectangle coordinates in BG.png. High score display also positioned in white rectangle, replaced by game canvas when active.

**Status**: All constitution principles satisfied after Phase 1 design. No violations. Ready for implementation.

## Project Structure

### Documentation (this feature)

```text
specs/001-snake-game/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
index.html              # Main HTML file with game layout
styles/
├── main.css            # FD BUSINESS color scheme and layout styles
└── game.css            # Game-specific styling
js/
├── game.js             # Core game logic (snake movement, collision detection, scoring)
├── storage.js          # LocalStorage wrapper for score persistence
├── ui.js               # UI management (player input, turn management, high score display)
└── main.js             # Application entry point and initialization
assets/
└── BG.png              # Background image with white rectangle for game area
```

**Structure Decision**: Single-page web application structure. All code in root-level directories (styles/, js/, assets/) for simplicity and easy deployment. No build step required - can run directly in browser. This structure is accessible to developers of all skill levels and aligns with the inclusive collaboration principle.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations - all constitution principles satisfied.
