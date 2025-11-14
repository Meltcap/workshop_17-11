# 01-constitution.md

## Instructies
1. Typ `/speckit.constitution` + onderstaande prompt in de cursor chat
2. Klik op verstuur of ENTER.

## Prompt
We are creating a very simple, browser-only educational project for a workshop about stock market data, with a small AI-powered advice feature.

The principles should cover:

• Project scope  
A single HTML page (index.html) with style.css and script.js.  
Runs entirely in the browser; no backend, no tooling, no frameworks.

• Tech stack  
Plain HTML, CSS, vanilla JavaScript.  
Fetch API for all HTTP requests.  
Finnhub REST API for market data and financial metrics.  
LiteLLM proxy API for generating short educational text.  
API keys may be placed in script.js for workshop/demo use only.

• Code quality  
Keep everything extremely simple, readable, and explicit.  
Prefer small functions with clear names over abstraction.  
No clever patterns or premature optimisation.  
Focus on the happy flow; only minimal defensive code is needed.

• UX & UI  
Clear, beginner-friendly layout on one screen.  
All UI text must be in Dutch.  
Show helpful error states.  
AI output must include an educational disclaimer.

• State management  
Use localStorage for a small JSON object (last symbol, brief advice history).  
Gracefully handle empty or invalid stored data with minimal fallback logic.

• AI behaviour  
LiteLLM AI responses should produce short, balanced, educational insights.  
No financial advice, no risky behaviour, always include disclaimers.

• Testing  
No test suite or automated tests are required.  
Manual validation of the happy flow is sufficient for this workshop-level project.