# Implementation Plan: AI-Enhanced Browser-Based Stock Dashboard

**Specification:** [spec.md](./spec.md)  
**Target Date:** Workshop delivery ready  
**Status:** Planning  
**Constitution Version:** v1.0.0

## Constitution Check

Before proceeding, verify alignment with project principles:

- [x] **Browser-Only Architecture:** Three static files only (index.html, style.css, script.js) - no backend, build tools, or frameworks
- [x] **Minimal Tech Stack:** HTML5/CSS3/ES6+ JavaScript + Chart.js CDN, Finnhub REST API, Gemini REST API
- [x] **Radical Simplicity:** Small explicit functions, imperative code flow, no abstractions or patterns
- [x] **Dutch-First UX:** All UI text, error messages, and disclaimers in Dutch (see spec UI section)
- [x] **Lightweight State:** Single localStorage JSON object with lastTicker and adviceHistory (max 10 entries)
- [x] **Responsible AI:** Mandatory disclaimer on all AI output, balanced educational prompts, no financial advice
- [x] **Manual Validation:** Comprehensive manual testing checklist in spec, no automated test frameworks

## Technical Context

**Runtime Environment:**
- Pure client-side browser execution (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- No build step, no package manager, no bundler
- ES6+ JavaScript with native browser APIs (Fetch, localStorage, DOM manipulation)

**External Dependencies:**
- **Chart.js:** `https://cdn.jsdelivr.net/npm/chart.js` (latest version via CDN)
- **Finnhub API:** `https://finnhub.io/api/v1`
  - Quote endpoint: `/quote?symbol={TICKER}&token={API_KEY}`
  - Candle endpoint: `/stock/candle?symbol={TICKER}&resolution=D&from={FROM}&to={TO}&token={API_KEY}`
- **Gemini API:** `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={API_KEY}`
  - Model: gemini-2.5-flash
  - REST POST with JSON body

**API Key Management:**
- Hardcoded constants at top of script.js
- `FINNHUB_API_KEY` and `GEMINI_API_KEY`
- Include prominent comment: "⚠️ WORKSHOP ONLY: Never expose API keys in production client code!"

**Data Persistence:**
- localStorage key: `stockDashboardState`
- JSON structure: `{ lastTicker: string, adviceHistory: Array<{symbol, timestamp, summaryLabel, adviceSnippet}> }`
- Max history size: 10 entries (FIFO)

**Error Handling Requirements:**
- Non-200 Finnhub responses → Dutch error message + console.error for debugging
- Empty/missing candle data → "Onvoldoende historische data beschikbaar"
- Gemini failures/timeouts → "AI-service tijdelijk niet beschikbaar" + retry button
- localStorage unavailable → "Gegevens worden niet opgeslagen in deze sessie" (one-time notice)
- Invalid/corrupt localStorage JSON → Reset to empty state with warning

## Implementation Steps

### Step 1: Create HTML Structure

**Files to create:**
- `index.html`

**Changes:**
- HTML5 boilerplate with Dutch lang attribute (`<html lang="nl">`)
- Include Chart.js CDN in `<head>`
- Create semantic sections:
  - `<section id="ticker-selection">` with predefined ticker buttons + manual input field
  - `<section id="market-data">` with price display divs
  - `<section id="chart-container">` with `<canvas id="price-chart">`
  - `<section id="ai-advice">` with button and response area + disclaimer
  - `<button id="reset-btn">` at bottom
- Link to `style.css` and `script.js`
- Add loading spinner elements (hidden by default)

**Constitution alignment:**
- Browser-Only Architecture: Static HTML file, no server-side rendering
- Dutch-First UX: All section headers, button labels, placeholder text in Dutch
- Radical Simplicity: Straightforward semantic HTML structure

**Estimated effort:** 1 hour

---

### Step 2: Style the Interface

**Files to create:**
- `style.css`

**Changes:**
- Reset/normalize basic styles
- Single-column layout, vertically stacked sections
- Clear visual separation between sections (borders, background colors, spacing)
- Button styles for:
  - Predefined ticker buttons (grid layout, 2 rows of 5)
  - "Zoek" button for manual input
  - "Genereer advies" button (prominent, disabled state)
  - "Wis gegevens" button (secondary style)
- Color coding for price changes:
  - Green (#28a745) for positive changes
  - Red (#dc3545) for negative changes
- Loading spinner animations
- Responsive to viewport width (min 1366px optimized, degrades gracefully)
- Chart container sizing (height: 400px)
- AI disclaimer prominent styling (border, icon, slightly larger text)

**Constitution alignment:**
- Radical Simplicity: Plain CSS, no preprocessors or frameworks
- Dutch-First UX: Clear visual hierarchy supporting Dutch text content
- Browser-Only Architecture: CSS-only styling, no build step

**Estimated effort:** 2 hours

---

### Step 3: Initialize JavaScript Structure

**Files to create:**
- `script.js`

**Changes:**
- Add API key constants at top with warning comment:
  ```javascript
  // ⚠️ WORKSHOP ONLY: Never expose API keys in production client code!
  const FINNHUB_API_KEY = 'YOUR_FINNHUB_KEY_HERE'; // Get from: https://finnhub.io
  const GEMINI_API_KEY = 'YOUR_GEMINI_KEY_HERE';   // Get from: https://aistudio.google.com
  ```
- Define API endpoint constants
- Create empty function stubs for core functionality:
  - `initApp()` - entry point
  - `loadStoredState()` - localStorage retrieval
  - `saveState(state)` - localStorage persistence
  - `selectTicker(symbol)` - ticker selection handler
  - `fetchQuote(symbol)` - Finnhub quote API call
  - `fetchCandles(symbol)` - Finnhub candle API call
  - `displayMarketData(quoteData)` - render price info
  - `renderChart(candleData)` - Chart.js rendering
  - `generateAdvice()` - Gemini API call
  - `displayAdvice(text)` - render AI response
  - `resetApp()` - clear state
  - `showError(message)` - error display
  - `showLoading(section)` / `hideLoading(section)` - loading states
- Add event listener setup in DOMContentLoaded
- Add console.log statements for debugging flow

**Constitution alignment:**
- Radical Simplicity: Small, single-purpose functions with clear names
- Browser-Only Architecture: Vanilla JavaScript, no transpilation needed
- Minimal Tech Stack: No frameworks or libraries beyond Chart.js

**Estimated effort:** 1 hour

---

### Step 4: Implement localStorage State Management

**Files to modify:**
- `script.js`

**Changes:**
- Implement `loadStoredState()`:
  - Try to parse `localStorage.getItem('stockDashboardState')`
  - Catch JSON parse errors → reset to empty state
  - Return `{ lastTicker: null, adviceHistory: [] }` if not found
- Implement `saveState(state)`:
  - Stringify state object
  - Try `localStorage.setItem('stockDashboardState', json)`
  - Catch quota exceeded or unavailable errors → show one-time notice
- Implement `resetApp()`:
  - Clear localStorage key
  - Reset global state variable
  - Clear UI elements
  - Show confirmation: "Alle gegevens gewist"
- Add advice history management:
  - Function `addToHistory(entry)` that maintains max 10 entries
  - FIFO removal if exceeding limit
- Handle localStorage unavailable:
  - Feature detection: `if (typeof Storage !== 'undefined')`
  - Show notice: "Gegevens worden niet opgeslagen in deze sessie" if unavailable

**Constitution alignment:**
- Lightweight State: Simple JSON object, graceful degradation
- Radical Simplicity: Direct localStorage API usage, minimal logic
- Dutch-First UX: All error/notice messages in Dutch

**Estimated effort:** 1.5 hours

---

### Step 5: Implement Finnhub API Integration

**Files to modify:**
- `script.js`

**Changes:**
- Implement `fetchQuote(symbol)`:
  ```javascript
  async function fetchQuote(symbol) {
    const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`;
    const response = await fetch(url);
    if (!response.ok) {
      if (response.status === 401) throw new Error('API-sleutel ongeldig');
      if (response.status === 429) throw new Error('Te veel verzoeken. Probeer later opnieuw.');
      if (response.status === 404) throw new Error('Ticker niet gevonden');
      throw new Error('Kan marktdata niet ophalen');
    }
    return await response.json();
  }
  ```
- Implement `fetchCandles(symbol)`:
  - Calculate Unix timestamps for 30 days ago and today
  - Construct URL with resolution=D (daily)
  - Handle same error codes as fetchQuote
  - Validate response has `c` (close prices) array with data
  - Throw error if array is empty: "Onvoldoende historische data beschikbaar"
- Implement `selectTicker(symbol)`:
  - Show loading indicator
  - Call both fetchQuote and fetchCandles in parallel (Promise.all)
  - If successful: display data, save to localStorage, enable "Genereer advies" button
  - If error: hide loading, display Dutch error message, log to console
- Add ticker format handling:
  - Research task: Determine if Dutch tickers need ".AS" suffix for Finnhub
  - Implement normalization function if needed

**Constitution alignment:**
- Minimal Tech Stack: Native Fetch API, no axios or request libraries
- Radical Simplicity: Direct async/await flow, clear error handling
- Dutch-First UX: All error messages translated

**Estimated effort:** 2 hours

---

### Step 6: Implement Market Data Display

**Files to modify:**
- `script.js`

**Changes:**
- Implement `displayMarketData(quoteData)`:
  - Extract `c` (current price), `d` (change), `dp` (change percent) from quote response
  - Update DOM elements with formatted values
  - Apply color coding:
    - Add class `positive` (green) if change > 0
    - Add class `negative` (red) if change < 0
  - Format currency with Euro symbol (€) and 2 decimal places
  - Add up/down arrow (↑/↓) based on direction
  - Show ticker symbol
- Add number formatting helper:
  - Function `formatPrice(value)` → "€725.50"
  - Function `formatChange(value, percent)` → "+€12.30 (+1.73%)"
- Update UI visibility:
  - Show market-data section (hidden by default)
  - Fade-in animation for smooth UX

**Constitution alignment:**
- Dutch-First UX: Euro currency formatting, Dutch decimal conventions
- Radical Simplicity: Direct DOM manipulation, no virtual DOM
- Browser-Only Architecture: Native JavaScript formatting, no i18n libraries

**Estimated effort:** 1.5 hours

---

### Step 7: Implement Chart.js Visualization

**Files to modify:**
- `script.js`

**Changes:**
- Implement `renderChart(candleData)`:
  - Extract `c` (close prices) and `t` (timestamps) arrays from candle response
  - Convert Unix timestamps to Date objects
  - Format dates for x-axis labels (Dutch format: "DD-MM")
  - Create Chart.js configuration:
    ```javascript
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: dateLabels,
        datasets: [{
          label: 'Slotkoers',
          data: closePrices,
          borderColor: '#007bff',
          backgroundColor: 'rgba(0, 123, 255, 0.1)',
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: true },
          title: { display: true, text: 'Historische Koers (30 dagen)' }
        },
        scales: {
          y: { beginAtZero: false, ticks: { callback: (val) => '€' + val } }
        }
      }
    });
    ```
  - Destroy previous chart instance if exists (prevent memory leaks)
  - Store chart reference globally for cleanup
- Add date formatting helper:
  - Function `formatChartDate(unixTimestamp)` → "14-11"
- Handle missing/incomplete data:
  - Filter out null/undefined values
  - Show error if less than 10 data points

**Constitution alignment:**
- Minimal Tech Stack: Chart.js from CDN, no custom charting code
- Dutch-First UX: Dutch labels, date formatting, currency symbols
- Radical Simplicity: Standard Chart.js patterns, no complex configurations

**Estimated effort:** 2 hours

---

### Step 8: Implement Gemini AI Integration

**Files to modify:**
- `script.js`

**Changes:**
- Implement `generateAdvice()`:
  - Calculate trend summary from loaded candle data:
    - Compare first and last close prices
    - Calculate percentage change over period
    - Determine trend direction: "stijgend" / "dalend" / "stabiel"
    - Calculate volatility (optional): standard deviation or range
  - Construct prompt in Dutch:
    ```javascript
    const prompt = `Je bent een educatieve financiële assistent. Analyseer de volgende aandelinformatie en geef een kort, evenwichtig educatief inzicht.

    Ticker: ${currentTicker}
    Recente trend: ${trendDescription}
    Prijsverandering (30 dagen): ${percentageChange}%

    Geef een korte uitleg (max 150 woorden) over:
    1. Wat het recente prijsgedrag betekent
    2. Mogelijke risico's
    3. Mogelijke kansen

    Gebruik eenvoudige taal. Geen specifieke aankoop-/verkoopaanbevelingen.`;
    ```
  - Make POST request to Gemini API:
    ```javascript
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );
    ```
  - Extract text from response: `response.candidates[0].content.parts[0].text`
  - Handle errors: 400/401/429/500 → "AI-service tijdelijk niet beschikbaar" + retry button
  - Derive sentiment label heuristically:
    - If percentage change > 5%: "optimistisch"
    - If percentage change < -5%: "voorzichtig"
    - Otherwise: "neutraal"
- Implement `displayAdvice(text, sentiment)`:
  - Show AI response text in designated div
  - Show disclaimer below (always visible)
  - Add to advice history with timestamp
  - Save updated state to localStorage
- Add retry mechanism for failed AI requests

**Constitution alignment:**
- Responsible AI: Educational prompts, no financial advice, mandatory disclaimers
- Minimal Tech Stack: Direct REST API calls, no SDK dependencies
- Dutch-First UX: Prompt and all UI text in Dutch

**Estimated effort:** 2.5 hours

---

### Step 9: Implement UI Event Handlers

**Files to modify:**
- `script.js`

**Changes:**
- Set up event listeners in `initApp()`:
  - Predefined ticker buttons → click handlers calling `selectTicker(symbol)`
  - Manual input field → Enter key + "Zoek" button click → validate and call `selectTicker(value)`
  - "Genereer advies" button → call `generateAdvice()` (disabled until data loaded)
  - "Wis gegevens" button → confirm dialog + call `resetApp()`
- Implement button state management:
  - Disable "Genereer advies" by default
  - Enable after successful data load
  - Disable during API call (prevent double-click)
  - Re-enable after completion
- Add input validation:
  - Trim whitespace
  - Convert to uppercase
  - Alphanumeric only
  - Show inline error for invalid characters
- Add loading states:
  - Show spinner during data fetch
  - Show spinner during AI generation
  - Disable relevant buttons during operations
  - Hide spinners on completion/error

**Constitution alignment:**
- Radical Simplicity: Direct event listener registration, no event bus
- Dutch-First UX: Confirmation dialogs and validation messages in Dutch
- Browser-Only Architecture: Native DOM events, no jQuery

**Estimated effort:** 2 hours

---

### Step 10: Implement Error Handling & Edge Cases

**Files to modify:**
- `script.js`

**Changes:**
- Implement `showError(message, section)`:
  - Create/update error div in specified section
  - Apply error styling (red border, icon)
  - Auto-dismiss after 5 seconds (optional)
  - Log technical details to console.error for workshop debugging
- Add comprehensive error handling:
  - Network failures: "Netwerkfout. Controleer je internetverbinding."
  - API key missing: Check if keys are still placeholder values on app init
  - Rate limiting: Implement exponential backoff for retry
  - Timeout handling: AbortController with 10-second timeout for Gemini
- Implement fallbacks:
  - localStorage unavailable: App functions without persistence
  - Chart.js fails to load: Show message "Grafiek kan niet geladen worden"
  - Partial data: Display what's available with notice
- Add validation guards:
  - Check Finnhub response structure before accessing fields
  - Check Gemini response format before parsing
  - Validate localStorage JSON schema on load
- Handle edge cases:
  - No internet connection on load → clear error message
  - User closes browser during API call → no hanging state on reload
  - Multiple rapid ticker selections → cancel in-flight requests (AbortController)

**Constitution alignment:**
- Dutch-First UX: All error messages in Dutch
- Radical Simplicity: Straightforward try/catch blocks, clear error paths
- Lightweight State: Graceful degradation when localStorage unavailable

**Estimated effort:** 2 hours

---

### Step 11: Implement Auto-Load on Page Refresh

**Files to modify:**
- `script.js`

**Changes:**
- Update `initApp()`:
  - Call `loadStoredState()`
  - Check if `lastTicker` exists
  - If exists: automatically call `selectTicker(lastTicker)` to reload data
  - If fetch fails: clear error message with option to manually select ticker
  - If not exists: show empty state with ticker selection prompt
- Add visual indicator for auto-loaded ticker:
  - Highlight the button if ticker is in predefined list
  - Show ticker symbol in manual input if custom ticker
- Add option to cancel auto-load:
  - Show brief "Laden van laatste ticker..." message with cancel link
  - 2-second window to cancel before fetching
  - Only implement if user testing shows need

**Constitution alignment:**
- Lightweight State: Seamless restoration from localStorage
- Radical Simplicity: Direct function calls, no complex lifecycle
- Dutch-First UX: Status messages in Dutch

**Estimated effort:** 1 hour

---

### Step 12: Add Advice History Display (Optional Enhancement)

**Files to modify:**
- `index.html`
- `style.css`
- `script.js`

**Changes:**
- Add collapsible "Eerdere adviezen" section to HTML (below AI advice)
- Style as compact list with:
  - Ticker symbol
  - Sentiment badge (color-coded)
  - Timestamp (relative: "2 uur geleden" or absolute)
  - First 50 characters of advice as preview
  - Click to expand full advice (optional)
- Implement `displayAdviceHistory()`:
  - Load from state.adviceHistory
  - Render list items in reverse chronological order
  - Show "Geen adviesgeschiedenis beschikbaar" if empty
- Update after each new advice generation
- Clear when user resets app

**Constitution alignment:**
- Lightweight State: Uses existing adviceHistory from localStorage
- Dutch-First UX: Labels and timestamps in Dutch
- Radical Simplicity: Simple list rendering, no complex interactions

**Estimated effort:** 1.5 hours (optional - can defer if time-constrained)

---

## API Keys Configuration

**Location:** Top of `script.js`

```javascript
// ⚠️ WORKSHOP ONLY: Never expose API keys in production client code!
// In production, use a backend proxy to securely call external APIs.

const FINNHUB_API_KEY = 'YOUR_FINNHUB_KEY_HERE'; // Get free key at: https://finnhub.io
const GEMINI_API_KEY = 'YOUR_GEMINI_KEY_HERE';   // Get free key at: https://aistudio.google.com
```

**⚠️ Workshop Warning:** 
This approach is ONLY acceptable for educational demos and workshops. Production applications must:
- Use environment variables on a backend server
- Implement API proxies to hide keys from client code
- Add rate limiting and authentication
- Never commit API keys to version control

## Dependencies

### External Libraries (CDN)

- **Chart.js:** `https://cdn.jsdelivr.net/npm/chart.js` (loaded in HTML `<head>`)
  - Version: Latest (CDN will resolve to stable version)
  - Purpose: Line chart visualization of historical prices
  - License: MIT

### External APIs

- **Finnhub API:** https://finnhub.io/docs/api/introduction
  - Quote endpoint: Real-time stock quotes
  - Candle endpoint: Historical OHLC data
  - Free tier: 60 API calls/minute
  - Registration required for API key

- **Google Gemini API:** https://ai.google.dev/gemini-api/docs
  - Model: `gemini-2.5-flash`
  - REST API endpoint for text generation
  - Free tier: Generous quota for workshop use
  - Registration required for API key

### Browser APIs

- Fetch API (HTTP requests)
- localStorage API (state persistence)
- Canvas API (for Chart.js rendering)
- Date API (timestamp formatting)
- JSON API (serialization/parsing)

## Error Handling Strategy

### Finnhub Errors

| Status | Cause | User Message (Dutch) | Action |
|--------|-------|---------------------|---------|
| 401 | Invalid API key | "API-sleutel ongeldig. Controleer je configuratie." | Log error, show setup instructions |
| 404 | Ticker not found | "Ticker niet gevonden. Controleer de symbool en probeer opnieuw." | Clear ticker input, allow retry |
| 429 | Rate limit | "Te veel verzoeken. Wacht even en probeer opnieuw." | Implement 5-second cooldown |
| 500/503 | Server error | "Kan marktdata niet ophalen. Probeer het later opnieuw." | Log error, provide retry button |
| Network error | No connection | "Netwerkfout. Controleer je internetverbinding." | Show offline indicator |

### Gemini Errors

| Status | Cause | User Message (Dutch) | Action |
|--------|-------|---------------------|---------|
| 400 | Bad request | "AI-verzoek mislukt. Probeer opnieuw." | Log error, provide retry |
| 401 | Invalid API key | "AI-sleutel ongeldig. Controleer je configuratie." | Log error, show setup instructions |
| 429 | Quota exceeded | "AI-service tijdelijk niet beschikbaar. Probeer later opnieuw." | Disable button for 60 seconds |
| 500 | Server error | "AI-service tijdelijk niet beschikbaar." | Provide retry button |
| Timeout | Request >10s | "AI-verzoek duurt te lang. Probeer opnieuw." | Abort request, allow retry |

### localStorage Errors

- **Unavailable** (private browsing, disabled):
  - Message: "Gegevens worden niet opgeslagen in deze sessie"
  - Behavior: App functions normally, no persistence
  - Show one-time notice on app init

- **Quota exceeded** (storage full):
  - Message: "Opslag vol. Gegevens kunnen niet worden opgeslagen."
  - Behavior: Continue without saving
  - Suggest clearing history

- **Invalid JSON** (corrupted data):
  - Message: "Opgeslagen gegevens beschadigd. App wordt gereset."
  - Behavior: Reset to empty state, log warning
  - No user action required

### Invalid User Input

- **Empty ticker**: "Voer een ticker symbool in"
- **Invalid characters**: "Alleen letters en cijfers toegestaan"
- **Ticker too long**: "Ticker moet 1-5 karakters zijn"

## Manual Testing Plan

### Happy Path Validation

1. **Initial Load**
   - Open `index.html` in browser
   - Verify no console errors
   - Verify all Dutch text renders correctly
   - Verify predefined ticker buttons visible

2. **Predefined Ticker Selection**
   - Click "ASML" button
   - Verify loading indicator appears
   - Wait for data load (<3 seconds)
   - Verify current price displays with € symbol
   - Verify change shows with color (green/red) and arrow
   - Verify 30-day chart renders with ~25-30 points
   - Verify "Genereer advies" button becomes enabled

3. **AI Advice Generation**
   - Click "Genereer advies" button
   - Verify loading indicator appears
   - Wait for response (<5 seconds)
   - Verify advice text appears in Dutch
   - Verify disclaimer is visible and prominent
   - Verify advice added to history (if implemented)

4. **Manual Ticker Entry**
   - Type "TSLA" in input field
   - Click "Zoek" or press Enter
   - Verify data loads successfully
   - Verify chart updates with new data

5. **Auto-Reload on Refresh**
   - Refresh browser (F5 or Cmd+R)
   - Verify last ticker reloads automatically
   - Verify all data displays without user interaction

6. **Data Reset**
   - Click "Wis gegevens" button
   - Verify confirmation prompt (optional)
   - Verify all data clears
   - Verify UI returns to empty state
   - Verify localStorage is empty (check DevTools)

### Error States

1. **Invalid API Key (Finnhub)**
   - Temporarily set `FINNHUB_API_KEY = 'invalid'`
   - Select ticker
   - Expected: "API-sleutel ongeldig" message in Dutch
   - Verify no crash, console shows error

2. **Invalid Ticker Symbol**
   - Enter "ZZZZZ" in manual input
   - Expected: "Ticker niet gevonden" message
   - Verify input field clears or allows correction

3. **Network Offline**
   - Disconnect internet (DevTools: Network throttling → Offline)
   - Select ticker
   - Expected: "Netwerkfout" message
   - Verify graceful handling

4. **Gemini API Failure**
   - Temporarily set `GEMINI_API_KEY = 'invalid'`
   - Load ticker data successfully
   - Click "Genereer advies"
   - Expected: "AI-service tijdelijk niet beschikbaar" + retry button

5. **Empty Candle Data**
   - Try ticker with very recent IPO or no history
   - Expected: "Onvoldoende historische data beschikbaar"
   - Verify price still shows if available

### localStorage Persistence

1. **State Persistence**
   - Select ticker (e.g., "ING")
   - Generate advice
   - Close browser completely
   - Reopen `index.html`
   - Expected: ING data reloads automatically

2. **Advice History**
   - Generate advice for 3 different tickers
   - Verify history shows all 3 entries
   - Verify most recent is at top

3. **Storage Corruption**
   - Manually corrupt localStorage in DevTools: `localStorage.setItem('stockDashboardState', '{invalid')`
   - Reload page
   - Expected: "Opgeslagen gegevens beschadigd" notice + reset to empty state

4. **Private Browsing**
   - Open in private/incognito mode
   - Select ticker and generate advice
   - Expected: "Gegevens worden niet opgeslagen" notice
   - Verify app still functions
   - Close and reopen: data should not persist

### UI Text in Dutch

1. **Section Headers**: Verify "Aandelenselectie", "Marktdata", "Historische Koers", "AI-advies"
2. **Buttons**: Verify "Genereer advies", "Wis gegevens", "Zoek"
3. **Labels**: Verify "Huidige koers:", "Verandering:", "Eerdere adviezen:"
4. **Error Messages**: Trigger each error type, verify all Dutch
5. **Placeholder Text**: Verify input field has Dutch placeholder
6. **Chart Labels**: Verify axis labels and legend in Dutch

### Cross-Browser Testing

1. **Chrome/Edge (Chromium)**
   - Full functionality test
   - Verify Chart.js renders correctly
   - Check console for warnings

2. **Firefox**
   - Full functionality test
   - Verify Fetch API works
   - Check Date formatting

3. **Safari**
   - Full functionality test
   - Verify localStorage works
   - Check CSS rendering

### Performance Validation

1. **Load Time**: Ticker click → data display < 3 seconds (measure with DevTools Network tab)
2. **AI Response Time**: Advice button → response display < 5 seconds
3. **Chart Rendering**: Data received → chart visible < 500ms
4. **Memory Leaks**: Select 10 different tickers → check memory usage in DevTools (should not grow unbounded)

## Rollout Checklist

- [ ] All three files created: `index.html`, `style.css`, `script.js`
- [ ] API keys documented with placeholder values and setup instructions
- [ ] Chart.js CDN link added to HTML
- [ ] All UI text verified in Dutch (section headers, buttons, errors, disclaimers)
- [ ] AI disclaimer present and prominent
- [ ] localStorage graceful degradation tested
- [ ] Error handling for all API failure modes implemented
- [ ] Manual testing checklist completed (all scenarios pass)
- [ ] README.md updated with:
  - Setup instructions (how to get API keys)
  - How to run (open index.html in browser)
  - Workshop usage tips
  - List of predefined Dutch tickers
- [ ] Code comments added for workshop learning:
  - API call patterns
  - localStorage usage
  - Chart.js setup
  - Error handling examples
- [ ] Console.log statements for debugging (can be removed after workshop delivery if preferred)

## Phased Rollout Plan

### Phase 1: Core Functionality (MVP)
**Estimated: 8-10 hours**

- Steps 1-6: HTML structure, CSS styling, basic JS setup, Finnhub integration, market data display
- Goal: Users can select predefined tickers and see current price + chart
- Testing: Happy path only
- Deliverable: Working ticker selection and data visualization

### Phase 2: AI Integration
**Estimated: 4-5 hours**

- Steps 7-8: Chart.js rendering, Gemini API integration, advice display
- Goal: Complete AI advice generation with disclaimers
- Testing: Happy path + Gemini error handling
- Deliverable: Full AI-enhanced dashboard

### Phase 3: Polish & Resilience
**Estimated: 5-6 hours**

- Steps 9-11: Event handlers, comprehensive error handling, auto-reload
- Goal: Production-ready for workshop delivery
- Testing: All error scenarios and edge cases
- Deliverable: Fully tested, resilient application

### Phase 4: Optional Enhancements
**Estimated: 2-3 hours**

- Step 12: Advice history display
- Additional polish: animations, improved UX, accessibility
- Extended testing: cross-browser, performance
- Deliverable: Enhanced workshop experience

**Total Estimated Effort: 19-24 hours**

## Notes

### Ticker Format Research Needed
**Decision pending:** Determine if Dutch tickers need exchange suffix for Finnhub.
- Test ASML vs ASML.AS
- Test ING vs ING.AS
- Document correct format in code comments
- Update predefined ticker buttons accordingly

### Sentiment Derivation Heuristic
Since Gemini responses are free-form text, sentiment labels will be derived from price trend:
- `optimistisch`: >5% gain over 30 days
- `voorzichtig`: <-5% loss over 30 days
- `neutraal`: -5% to +5%

Alternative: Attempt keyword extraction from AI response ("positief", "risico", "kans") but heuristic is simpler and more reliable.

### Chart.js Version
Using CDN without version pinning ensures latest stable version. If workshop requires exact reproducibility, pin to specific version: `https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.js`

### Workshop Delivery Tips
- Pre-fill API keys in distributed version to reduce setup time
- Provide backup API keys in case participants exceed quota
- Demonstrate localStorage in DevTools during workshop
- Show Network tab to demystify API calls
- Live-code small sections to reinforce patterns

### Future Enhancements (Out of Scope)
- Multi-ticker comparison
- Intraday (minute-level) charts
- Technical indicators (moving averages, RSI)
- News sentiment integration
- Multi-language support
- Dark mode toggle
- Keyboard shortcuts
- Accessibility improvements (ARIA labels, screen reader support)
