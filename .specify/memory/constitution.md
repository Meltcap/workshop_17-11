<!--
Sync Impact Report:
Version change: N/A → 1.0.0 (initial constitution)
Modified principles: N/A (new file)
Added sections: Core Principles, Visual Design Requirements, Collaborative Development, Governance
Removed sections: N/A
Templates requiring updates:
  ✅ plan-template.md - Constitution Check section references constitution principles
  ✅ spec-template.md - No direct constitution references, but aligns with collaborative principles
  ✅ tasks-template.md - No direct constitution references, but aligns with collaborative principles
Follow-up TODOs: None
-->

# Snake Game Constitution

## Core Principles

### I. Inclusive Collaboration
Everyone can contribute, regardless of coding experience. The project welcomes all team members and values diverse perspectives and skill levels. Learning and growth are core objectives of this project.

### II. Open Communication
We discuss ideas openly and help each other. All team members are encouraged to share thoughts, ask questions, and provide assistance. Transparent communication ensures everyone stays informed and can contribute effectively.

### III. Score Persistence
After each game, player names and scores MUST be saved. The system MUST persist game results to enable tracking and historical analysis. This ensures players can see their progress over time.

### IV. Single Player Per Round with High Score Tracking
Only one player plays per round; high scores are tracked. Each game session involves a single player, and the system MUST maintain and display high score records. This principle ensures clear game flow and competitive tracking.

### V. Collaborative Decision Making
All decisions and problems are shared and solved together. No unilateral decisions are made; the team discusses and reaches consensus on changes, issues, and improvements. This ensures collective ownership and alignment.

## Visual Design Requirements

### VI. FD BUSINESS Color Scheme
The game MUST use the FD BUSINESS color scheme and be visually styled to match. All UI elements, graphics, and visual components must adhere to the specified brand colors and styling guidelines.

### VII. Game Area Layout Constraint
The snake game area MUST be placed inside the white rectangle of the provided BG.png image. The game canvas must be positioned and sized to fit within the designated white rectangle area of the background image, ensuring proper visual integration.

## Governance

This constitution supersedes all other practices and guidelines. Amendments require:
- Team discussion and consensus
- Documentation of the rationale for change
- Update to this constitution file with version increment
- Propagation of changes to dependent templates and documentation

**Versioning Policy**: Follow semantic versioning (MAJOR.MINOR.PATCH):
- **MAJOR**: Backward incompatible principle removals or redefinitions
- **MINOR**: New principle/section added or materially expanded guidance
- **PATCH**: Clarifications, wording improvements, typo fixes, non-semantic refinements

**Compliance Review**: All implementation plans, feature specifications, and code changes must verify compliance with these principles. The Constitution Check section in implementation plans must explicitly validate adherence to all applicable principles.

**Version**: 1.0.0 | **Ratified**: 2025-01-27 | **Last Amended**: 2025-01-27
