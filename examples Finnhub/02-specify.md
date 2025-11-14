# 02-specify.md

speckit specify

For an AI-Enhanced Browser-Based Stock Dashboard

I want to create a single-page web app that:
• The entire user interface (UI), including all labels, buttons, error messages, instructions, and section titles, must be fully in Dutch.

Lets the user select a stock ticker in two ways:
• By clicking one of ~10 predefined company tickers (e.g. AAPL, MSFT, GOOGL, TSLA, NVDA, META, NFLX, AMD, INTC, AMZN — exact ticker format may need to match Finnhub's requirements).
• By manually typing a ticker symbol into a text input field.

Fetches the latest price information for the selected symbol from the Finnhub REST API (quote endpoint only, free tier).

**Note:** Finnhub free tier only supports quote endpoint. Candle (historical) and metrics endpoints require paid subscription.

Displays:
• The current price.
• The absolute and percentage change compared to the previous close.

Provides a clearly separated AI advice area that:
• Shows a button "Genereer advies" once market data has been successfully loaded.
• When clicked, sends a structured prompt to the LiteLLM proxy (OpenAI-compatible) containing:
  – The ticker symbol.
  – A short, human-readable summary of the daily price movement (e.g. "stijgend +2.5% vandaag").
  – Context derived from the quote data (current price, daily change percentage).
• Receives a short, text-only answer that:
  – Explains the daily price behaviour in simple language.
  – Discusses potential risks and opportunities in a balanced way.
  – Includes an explicit disclaimer that this is not financial advice and is for educational purposes only.
• Renders this answer in the UI in a clearly labelled "AI-advies" section.

Uses localStorage to persist a small JSON object with:
• The last selected ticker (so it can be reloaded on page refresh).
• A short history of the last few AI-generated advice entries, including at least:
  – symbol,
  – timestamp,
  – a short summary label (e.g. "optimistisch", "voorzichtig", etc., if available from the AI output or derived heuristically).

Provides a simple way to reset stored data (e.g. a "Reset app" or "Wis gegevens" button that clears relevant localStorage keys and resets the UI).

Non-goals / Out of scope for this feature:
• No authentication, user accounts, or server-side persistence.
• No portfolio management, orders, or realistic trading simulation.
• No historical data or financial metrics dashboard (Finnhub free tier limitation).
• No complex chart interactions or historical price charts.
• No advanced AI features such as multi-turn chat, tools, or retrieval-augmented generation.
• No additional external APIs beyond Finnhub (for quotes) and LiteLLM proxy (for AI text).
• No back-end proxy for APIs in this Level 1 version.
