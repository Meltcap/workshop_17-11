# Specification: AI-Enhanced Browser-Based Stock Dashboard

**Status:** Draft  
**Created:** 2025-11-14  
**Last Updated:** 2025-11-14  
**Constitution Alignment:** v1.0.0

## Overview

This feature provides a single-page educational web application that allows workshop participants to explore stock market data for Dutch companies and receive AI-generated educational insights. Users can select stock tickers, view current prices with historical trends visualized in charts, and request balanced educational analysis powered by Google Gemini. The application demonstrates modern browser APIs, external API integration, and responsible AI usage in financial contexts, all within a beginner-friendly Dutch-language interface.

## Constitution Compliance Check

- [x] Browser-Only Architecture: No backend/tooling introduced - pure client-side application
- [x] Minimal Technology Stack: Uses only HTML/CSS/JS, Chart.js CDN, Finnhub API, Gemini API
- [x] Radical Simplicity: Direct data flow with explicit functions, no abstractions
- [x] Dutch-First UX: All UI text specified in Dutch
- [x] Lightweight State Management: Simple localStorage for ticker and advice history
- [x] Responsible AI Integration: Explicit disclaimers on all AI-generated content
- [x] Manual Validation: Testing approach documented below

## Requirements

### Functional Requirements

#### Stock Selection

1. **Predefined Ticker Selection**: Users must be able to select from approximately 10 predefined Dutch company tickers displayed as clickable buttons (ASML, ADYEN, ING, UNA, AD, HEIA, PHIA, RAND, KPN, DSFIR)

2. **Manual Ticker Input**: Users must be able to type any stock ticker symbol into a text input field and submit it for lookup

3. **Ticker Validation**: When a ticker is selected or entered, the system must validate it by successfully fetching data from Finnhub before proceeding

#### Market Data Display

4. **Current Price Display**: The application must display the current stock price for the selected ticker in a clear, prominent format

5. **Price Change Display**: The application must show both absolute change and percentage change compared to the previous close, with clear indication of direction (up/down)

6. **Historical Chart**: The application must display a line chart showing closing prices for approximately the last 30 calendar days using Chart.js

7. **Data Freshness**: Price and chart data must be fetched from Finnhub REST API (Quote endpoint for current price, Candle endpoint for historical data) upon ticker selection

#### AI Advice Generation

8. **Conditional Advice Button**: A "Genereer advies" button must appear only after market data has been successfully loaded and displayed

9. **Structured AI Prompt**: When the advice button is clicked, the system must send a structured prompt to Google Gemini API containing:
   - The ticker symbol
   - A human-readable summary of recent price movement (trend direction, volatility)
   - High-level context such as overall percentage change over the data period

10. **AI Response Display**: The AI-generated response must be displayed in a clearly labeled "AI-advies" section below the chart

11. **Balanced Educational Content**: The AI response must explain recent price behavior in simple language and discuss potential risks and opportunities in a balanced manner

12. **Mandatory Disclaimer**: Every AI response must include an explicit disclaimer stating this is not financial advice and is for educational purposes only

#### Data Persistence

13. **Last Ticker Persistence**: The application must save the last selected ticker to localStorage and reload it automatically on page refresh

14. **Advice History**: The application must maintain a history of recent AI-generated advice entries in localStorage, including:
    - Ticker symbol
    - Timestamp
    - Summary label (e.g., "optimistisch", "voorzichtig", derived heuristically or from AI output)

15. **History Size Limit**: Store only the last 5-10 advice entries to keep storage lightweight

#### Data Reset

16. **Reset Functionality**: Users must have access to a "Wis gegevens" button that clears all localStorage data and resets the UI to initial state

### Non-Functional Requirements

- **Performance:** 
  - Chart rendering must complete within 2 seconds of receiving data
  - API calls should show loading indicators after 500ms
  - AI advice generation may take 3-5 seconds (acceptable for educational context)

- **Usability:** 
  - Single-screen layout with clear visual hierarchy
  - No scrolling required to see core functionality on standard laptop screens (1366x768+)
  - Color-coded price changes (green for positive, red for negative) for quick visual understanding
  - Loading states for all asynchronous operations

- **Error Handling:** 
  - Non-200 responses from Finnhub: Display user-friendly error message in Dutch explaining the issue
  - Empty or missing candle data: Show message indicating insufficient historical data
  - Gemini API failures: Display error message with option to retry
  - Invalid ticker symbols: Show clear feedback that the symbol was not found
  - localStorage unavailable or corrupt: Gracefully fall back to no persistence with informational message

## User Interface

### UI Text (Dutch)

**Section Headers:**
- "Aandelenselectie" (Stock Selection)
- "Marktdata" (Market Data)
- "Historische Koers" (Historical Price)
- "AI-advies" (AI Advice)

**Buttons and Labels:**
- "Genereer advies" (Generate advice)
- "Wis gegevens" (Clear data)
- "Zoek" or "Laden" (Search/Load)
- "Huidige koers:" (Current price:)
- "Verandering:" (Change:)

**Error Messages:**
- "Ticker niet gevonden. Controleer de symbool en probeer opnieuw." (Ticker not found. Check symbol and try again.)
- "Kan marktdata niet ophalen. Probeer het later opnieuw." (Cannot fetch market data. Try again later.)
- "AI-service tijdelijk niet beschikbaar." (AI service temporarily unavailable.)
- "Onvoldoende historische data beschikbaar." (Insufficient historical data available.)
- "API-sleutel ontbreekt of ongeldig." (API key missing or invalid.)

**AI Disclaimer:**
- "⚠️ Dit is geen financieel advies. Deze informatie is uitsluitend bedoeld voor educatieve doeleinden. Raadpleeg altijd een financieel adviseur voordat u investeringsbeslissingen neemt." (This is not financial advice. This information is for educational purposes only. Always consult a financial advisor before making investment decisions.)

**Advice History Labels:**
- "Eerdere adviezen:" (Previous advice:)
- "Geen adviesgeschiedenis beschikbaar" (No advice history available)

### Layout

```
┌─────────────────────────────────────────────────┐
│              AANDELENSELECTIE                   │
│  [ASML] [ADYEN] [ING] [UNA] [AD] [HEIA]        │
│  [PHIA] [RAND] [KPN] [DSFIR]                   │
│                                                 │
│  Of typ een ticker: [________] [Zoek]          │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│              MARKTDATA                          │
│  Ticker: ASML                                   │
│  Huidige koers: €725.50                         │
│  Verandering: +€12.30 (+1.73%) ↑                │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│          HISTORISCHE KOERS (30 dagen)           │
│                                                 │
│  [Chart.js Line Chart Visualization]            │
│                                                 │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│              AI-ADVIES                          │
│  [Genereer advies]                              │
│                                                 │
│  [AI response text appears here]                │
│                                                 │
│  ⚠️ Disclaimer text                             │
└─────────────────────────────────────────────────┘

                   [Wis gegevens]
```

Layout is vertically stacked, responsive to viewport width, with clear section separation using visual boundaries (borders/background colors).

## Technical Design

### Data Flow

1. **Page Load:**
   - Check localStorage for last selected ticker
   - If found, automatically trigger data fetch for that ticker
   - If not found or fetch fails, show empty state with ticker selection

2. **Ticker Selection:**
   - User clicks predefined button or enters manual ticker
   - Show loading indicator
   - Fetch current quote from Finnhub Quote endpoint
   - Fetch 30-day candle data from Finnhub Candle endpoint
   - If both succeed: Display price data, render chart, show "Genereer advies" button
   - If either fails: Display appropriate error message
   - Save selected ticker to localStorage

3. **AI Advice Generation:**
   - User clicks "Genereer advies" button
   - Calculate price trend summary from loaded candle data
   - Construct prompt with ticker, trend summary, percentage change
   - Send to Gemini API with parameters for educational, balanced response
   - Display response in AI-advies section with disclaimer
   - Extract/derive sentiment label (optimistisch/voorzichtig/neutraal)
   - Save advice entry to localStorage history

4. **Data Reset:**
   - User clicks "Wis gegevens"
   - Clear localStorage keys
   - Reset UI to initial empty state
   - Show confirmation message

### API Integration

- **Finnhub API:**
  - **Endpoints used:** 
    - Quote: `/quote?symbol={TICKER}`
    - Candle: `/stock/candle?symbol={TICKER}&resolution=D&from={UNIX_TIMESTAMP}&to={UNIX_TIMESTAMP}`
  - **Error handling:** 
    - Check response status codes
    - Handle 401 (invalid API key), 429 (rate limit), 404 (ticker not found)
    - Display Dutch error messages for each case
    - Log errors to console for workshop debugging

- **Gemini API:**
  - **Model:** gemini-2.5-flash
  - **Endpoint:** `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`
  - **Prompt structure:** 
    ```
    Je bent een educatieve financiële assistent. Analyseer de volgende aandelinformatie en geef een kort, 
    evenwichtig educatief inzicht.

    Ticker: {SYMBOL}
    Recente trend: {TREND_DESCRIPTION}
    Prijsverandering (30 dagen): {PERCENTAGE_CHANGE}%

    Geef een korte uitleg (max 150 woorden) over:
    1. Wat het recente prijsgedrag betekent
    2. Mogelijke risico's
    3. Mogelijke kansen

    Gebruik eenvoudige taal. Geen specifieke aankoop-/verkoopaanbevelingen.
    ```
  - **Disclaimer handling:** 
    - Disclaimer is automatically appended to every AI response in the UI
    - Always visible regardless of API response content
  - **Error handling:**
    - Handle 400 (bad request), 401 (invalid API key), 429 (rate limit), 500 (server error)
    - Show "AI-service tijdelijk niet beschikbaar" message
    - Provide retry button

### State Management

**localStorage structure:**

```json
{
  "lastTicker": "ASML",
  "adviceHistory": [
    {
      "symbol": "ASML",
      "timestamp": "2025-11-14T10:30:00Z",
      "summaryLabel": "optimistisch",
      "adviceSnippet": "De koers toont een stijgende trend..."
    },
    {
      "symbol": "ADYEN",
      "timestamp": "2025-11-14T09:15:00Z",
      "summaryLabel": "voorzichtig",
      "adviceSnippet": "Er is toegenomen volatiliteit..."
    }
  ]
}
```

**Graceful degradation:**
- If localStorage is unavailable (private browsing, storage full), app still functions but without persistence
- Show one-time informational message: "Gegevens worden niet opgeslagen in deze sessie"
- If stored JSON is invalid/corrupt, reset to empty state and log warning

## User Scenarios & Acceptance Criteria

### Scenario 1: First-Time User Explores ASML Stock

**Steps:**
1. User opens `index.html` in browser
2. User sees empty dashboard with ticker selection options
3. User clicks "ASML" button
4. Current price, change, and 30-day chart appear
5. User clicks "Genereer advies"
6. AI-generated educational insight appears with disclaimer

**Acceptance Criteria:**
- [ ] Price data loads within 3 seconds
- [ ] Chart displays 30 data points
- [ ] Price change shows positive/negative with color coding
- [ ] AI advice appears within 5 seconds of clicking button
- [ ] Disclaimer is visible and in Dutch
- [ ] ASML ticker is saved to localStorage

### Scenario 2: Returning User Sees Last Ticker

**Steps:**
1. User previously selected "ING" and closes browser
2. User reopens `index.html`
3. Dashboard automatically loads ING data

**Acceptance Criteria:**
- [ ] ING ticker is highlighted/indicated as selected
- [ ] ING data loads automatically without requiring user action
- [ ] If data fetch fails, clear error message is shown with option to select different ticker

### Scenario 3: User Searches Custom Ticker

**Steps:**
1. User types "TSLA" in manual input field
2. User clicks "Zoek" button
3. Data for TSLA loads and displays

**Acceptance Criteria:**
- [ ] Input accepts alphanumeric characters
- [ ] Case-insensitive search (TSLA = tsla)
- [ ] If ticker not found, clear error message in Dutch
- [ ] Successful search saves ticker to localStorage

### Scenario 4: User Resets Application Data

**Steps:**
1. User has viewed multiple tickers and generated advice
2. User clicks "Wis gegevens" button
3. All localStorage cleared and UI resets

**Acceptance Criteria:**
- [ ] localStorage keys are removed
- [ ] UI returns to initial empty state
- [ ] Advice history no longer visible
- [ ] Confirmation message shown: "Alle gegevens gewist"

### Scenario 5: API Error Handling

**Steps:**
1. User selects ticker but Finnhub API returns error (invalid API key)
2. Error message appears in Dutch

**Acceptance Criteria:**
- [ ] No technical error messages or stack traces visible to user
- [ ] Dutch error message clearly explains issue
- [ ] User can try selecting different ticker
- [ ] Console logs technical details for workshop debugging

## Assumptions

1. **API Keys Available**: Workshop participants will have valid Finnhub and Gemini API keys with sufficient quota for demonstration
2. **Ticker Format**: Finnhub expects standard ticker symbols (may require suffix like ".AS" for Amsterdam stocks - to be validated during implementation)
3. **Data Availability**: Finnhub provides reliable data for the 10 predefined Dutch tickers
4. **Browser Support**: Modern evergreen browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+) with JavaScript enabled
5. **Network Connectivity**: Users have stable internet connection for API calls
6. **Sentiment Derivation**: Summary labels (optimistisch/voorzichtig/neutraal) derived heuristically from price trend percentage if not explicitly extractable from AI response
7. **Chart Time Range**: "Last 30 days" calculated as 30 calendar days prior to current date, which may include weekends/holidays with no trading data
8. **Single Concurrent Request**: User waits for one API operation to complete before triggering another (no request queuing needed)

## Out of Scope

The following features are explicitly excluded from this implementation:

- **No Authentication**: No user accounts, login systems, or user-specific data isolation
- **No Server-Side Persistence**: No database, no backend APIs beyond Finnhub/Gemini
- **No Portfolio Management**: No ability to track multiple stocks simultaneously, create watchlists, or manage holdings
- **No Trading Simulation**: No mock orders, no buy/sell functionality, no balance tracking
- **No Advanced Charting**: No zooming, panning, technical indicators, candlestick charts, or multiple symbol overlays
- **No Multi-Turn AI Chat**: AI advice is single request/response only, no conversation history or follow-up questions
- **No Additional Data Sources**: Only Finnhub and Gemini APIs, no Bloomberg, Yahoo Finance, or other integrations
- **No API Proxy**: API keys placed directly in client code (acceptable only for workshop context with clear warnings)
- **No Real-Time Data**: Data is fetched on-demand only, no WebSocket streaming or auto-refresh
- **No Internationalization**: Dutch only, no language switching
- **No Mobile Optimization**: Functional on mobile but optimized for laptop/desktop workshop environment
- **No Automated Testing**: Manual validation only per constitution principle 7
- **No Advanced State Management**: No Redux, MobX, or state machines beyond simple localStorage

## Success Criteria

- [ ] Users can select any of the 10 predefined Dutch company tickers and view their current market data within 3 seconds
- [ ] Users can successfully enter custom ticker symbols and retrieve data for at least 90% of valid publicly traded symbols
- [ ] Historical price charts display 25-30 data points representing daily closing prices without visual errors or gaps
- [ ] AI-generated advice appears within 5 seconds of clicking the button and contains balanced educational content in Dutch
- [ ] Educational disclaimer is visible on 100% of AI advice displays in clear, readable Dutch text
- [ ] Last selected ticker persists across browser sessions and automatically loads when user returns to the page
- [ ] Advice history stores the last 5-10 advice entries and displays them chronologically
- [ ] Users can successfully reset all application data and return to an empty initial state with one click
- [ ] All error states (invalid API keys, network failures, ticker not found, rate limits) display clear Dutch error messages without exposing technical details
- [ ] Complete workshop demonstration flow (select ticker → view data → generate advice → reset) completes successfully in under 2 minutes
- [ ] All UI text including labels, buttons, error messages, and instructions appears in grammatically correct Dutch
- [ ] Application functions without any build step, allowing participants to open `index.html` directly in browser

## Manual Testing Checklist

### Happy Path Validation

- [ ] Open `index.html` in browser - page loads without console errors
- [ ] Click predefined ticker button (e.g., ASML) - data loads and displays
- [ ] Verify current price, change, and percentage are visible and correctly formatted
- [ ] Verify 30-day chart renders with visible trend line
- [ ] Click "Genereer advies" button - AI response appears below chart
- [ ] Verify disclaimer text is present and in Dutch
- [ ] Refresh page - last ticker loads automatically
- [ ] Type custom ticker in input field - data loads correctly
- [ ] Click "Wis gegevens" - all data clears and UI resets

### Error State Display

- [ ] Remove/invalidate Finnhub API key - appropriate error message in Dutch appears
- [ ] Enter invalid ticker symbol (e.g., "ZZZZZ") - "ticker niet gevonden" message displays
- [ ] Simulate network failure - error message appears with actionable guidance
- [ ] Remove/invalidate Gemini API key - AI service error message appears

### localStorage Persistence

- [ ] Select ticker → close browser → reopen → verify ticker reloads
- [ ] Generate 3 advice entries → verify all saved in history
- [ ] Verify localStorage contains valid JSON structure
- [ ] Corrupt localStorage data manually → verify app handles gracefully
- [ ] Test in private browsing mode → verify app functions without persistence

### UI Text in Dutch

- [ ] Verify all section headers are in Dutch
- [ ] Verify all button labels are in Dutch
- [ ] Verify all error messages are in Dutch
- [ ] Verify placeholder text in input fields is in Dutch
- [ ] Verify advice history labels are in Dutch

### Disclaimers Present

- [ ] Generate AI advice → verify disclaimer appears below response
- [ ] Verify disclaimer text matches educational requirements
- [ ] Verify disclaimer is always visible regardless of response length
- [ ] Verify disclaimer formatting is clear and prominent

### Cross-Browser Testing

- [ ] Test in Chrome - full functionality works
- [ ] Test in Firefox - full functionality works
- [ ] Test in Safari - full functionality works
- [ ] Test in Edge - full functionality works

### Performance Validation

- [ ] Measure time from ticker click to data display (target: <3 seconds)
- [ ] Measure time from advice button click to response display (target: <5 seconds)
- [ ] Verify chart rendering is smooth without visual lag
- [ ] Verify no memory leaks after multiple ticker selections
