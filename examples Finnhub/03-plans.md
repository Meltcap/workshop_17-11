# 03-plans.md

speckit plans

Make a plan with the following tech requirements:
Tech stack and runtime environment

This is a pure client-side web app:
Plain HTML, CSS, vanilla JavaScript.
No backend, no frameworks, no build tooling, no Docker.

Use Chart.js via CDN:
<https://cdn.jsdelivr.net/npm/chart.js>
Use the browser Fetch API for all HTTP calls.

Use Finnhub REST API for:
Quote endpoint (current price, change).
Candle endpoint (daily OHLC for ~30 days).
API documentation: https://finnhub.io/docs/api/introduction 
Use Google Gemini API (free tier) via REST calls from JavaScript:
Follow the REST example from: https://ai.google.dev/gemini-api/docs 

Model: gemini-2.5-flash
Use window.localStorage for simple JSON persistence.

API keys:
FINNHUB_API_KEY and GEMINI_API_KEY must be placed at the top of script.js as constants.

Mention clearly that this is only acceptable for workshop/demo purposes.
Error handling and edge cases (technical)

How to handle:
Non-200 responses or error JSON from Finnhub.
Empty or missing candle data.
Gemini REST call failures, timeouts, or invalid JSON.
localStorage unavailable or containing invalid JSON.