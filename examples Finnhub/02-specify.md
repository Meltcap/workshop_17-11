# 02-specify.md

speckit specify

For a AI-Enhanced Browser-Based Stock Dashboard

I want to create a single-page web app that:
• The entire user interface (UI), including all labels, buttons, error messages, instructions, and section titles, must be fully in Dutch.

Lets the user select a stock ticker in two ways:
• By clicking one of ~10 predefined Dutch company tickers (e.g. ASML, ADYEN, ING, UNA, AD, HEIA, PHIA, RAND, KPN, DSFIR — exact ticker format may need to match Finnhub’s requirements).
• By manually typing a ticker symbol into a text input field.

Fetches the latest price information for the selected symbol from the Finnhub REST API.

Fetches daily historical candle data for approximately the last 30 calendar days for that symbol.

Displays:
• The current price.
• The absolute and percentage change compared to the previous close.
• A simple line chart of the closing prices over time using Chart.js.

Provides a clearly separated AI advice area that:
• Shows a button “Genereer advies” once market data has been successfully loaded.
• When clicked, sends a structured prompt to the Google Gemini API containing:
  – The ticker symbol.
  – A short, human-readable summary of the recent price movement (e.g. trend direction, volatility).
  – Any other high-level context derived from the loaded data (e.g. “prijs is omhoog/omlaag X% over de laatste 30 dagen”).
• Receives a short, text-only answer that:
  – Explains recent price behaviour in simple language.
  – Discusses potential risks and opportunities in a balanced way.
  – Includes an explicit disclaimer that this is not financial advice and is for educational purposes only.
• Renders this answer in the UI in a clearly labelled “AI-advies” section, below the chart.

Uses localStorage to persist a small JSON object with:
• The last selected ticker (so it can be reloaded on page refresh).
• A short history of the last few AI-generated advice entries, including at least:
  – symbol,
  – timestamp,
  – a short summary label (e.g. “optimistisch”, “voorzichtig”, etc., if available from the AI output or derived heuristically).

Provides a simple way to reset stored data (e.g. a “Reset app” or “Wis gegevens” button that clears relevant localStorage keys and resets the UI).

Non-goals / Out of scope for this feature:
• No authentication, user accounts, or server-side persistence.
• No portfolio management, orders, or realistic trading simulation.
• No complex chart interactions (zooming, panning, overlays of multiple symbols).
• No advanced AI features such as multi-turn chat, tools, or retrieval-augmented generation.
• No additional external APIs beyond Finnhub (for prices) and Google Gemini (for AI text).
• No back-end proxy for APIs in this Level 1 version.