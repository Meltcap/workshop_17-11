# 02-specify.md

## Instructies
1. Typ `/speckit.specify` + onderstaande prompt in de cursor chat
2. Klik op verstuur of ENTER.

## Prompt
We want to build a simple browser-based Snake Game that people can play.

**Requirements:**
- Each player enters their name before playing.
- Only one player plays per round, then the next player can play.
- The snake is controlled with arrow keys.
- The entire interface, including menu and gameplay, must be placed completely inside the white rectangle of /examples/BG.png as the background image.
- The game board and layout must use the FD BUSINESS color scheme (primary: #379596, content: #191919, background: #ffeadb).
- After each round, the player's name and score are saved in a local JSON file.
- All game rounds and scores are stored in this JSON file (no backend/server).
- A high score list is shown on the game page, loaded from the JSON file.
- When the game is over, show a centered floating Game Over box with the player's result and a button for the next round (not a browser alert).
- The game and all data must run purely locally in the browser, as a single HTML file with JS and JSON—no (web)server required at any point.
- No FD logo is needed in the game.