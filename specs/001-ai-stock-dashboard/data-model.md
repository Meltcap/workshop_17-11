# Data Model

**Feature:** AI-Enhanced Browser-Based Stock Dashboard  
**Date:** 2025-11-14  
**Status:** Final

## Purpose

This document defines the data structures, entities, and state management patterns for the stock dashboard application. All data is client-side only (no backend persistence beyond localStorage).

---

## Core Entities

### 1. StockQuote

**Description:** Real-time price information for a stock symbol

**Source:** Finnhub API `/quote` endpoint

**Structure:**
```javascript
{
  symbol: string,           // Ticker with exchange suffix (e.g., "ASML.AS")
  displaySymbol: string,    // Clean ticker for UI (e.g., "ASML")
  currentPrice: number,     // Current trading price in EUR
  change: number,           // Absolute change from previous close in EUR
  changePercent: number,    // Percentage change from previous close
  previousClose: number,    // Previous day's closing price
  timestamp: number         // Unix timestamp of quote
}
```

**Validation Rules:**
- `symbol` must not be empty
- `currentPrice` must be > 0
- `change` can be positive, negative, or zero
- `changePercent` must be finite number
- `timestamp` must be valid Unix timestamp

**Example:**
```json
{
  "symbol": "ASML.AS",
  "displaySymbol": "ASML",
  "currentPrice": 725.50,
  "change": 12.30,
  "changePercent": 1.73,
  "previousClose": 713.20,
  "timestamp": 1731589800
}
```

---

### 2. CandleData

**Description:** Historical OHLC (Open, High, Low, Close) data for charting

**Source:** Finnhub API `/stock/candle` endpoint

**Structure:**
```javascript
{
  symbol: string,              // Ticker with exchange suffix
  resolution: string,          // "D" for daily
  timestamps: number[],        // Array of Unix timestamps
  open: number[],              // Opening prices
  high: number[],              // Highest prices
  low: number[],               // Lowest prices
  close: number[],             // Closing prices (used for line chart)
  volume: number[],            // Trading volumes (optional, not displayed)
  status: string               // "ok" or "no_data"
}
```

**Validation Rules:**
- All arrays must have equal length (25-30 data points expected)
- `timestamps` must be in ascending order
- All price values must be > 0
- `status` must be "ok" for valid data

**Derived Properties:**
```javascript
{
  firstClose: number,          // close[0]
  lastClose: number,           // close[close.length - 1]
  priceChangeOverPeriod: number, // lastClose - firstClose
  percentChangeOverPeriod: number // ((lastClose - firstClose) / firstClose) * 100
}
```

**Example:**
```json
{
  "symbol": "ASML.AS",
  "resolution": "D",
  "timestamps": [1728691200, 1728777600, 1728864000, ...],
  "open": [710.00, 715.50, 720.00, ...],
  "high": [718.00, 722.00, 728.50, ...],
  "low": [708.50, 713.00, 718.00, ...],
  "close": [715.20, 720.50, 725.50, ...],
  "volume": [1234567, 1345678, 1456789, ...],
  "status": "ok"
}
```

---

### 3. AIAdvice

**Description:** AI-generated educational insight about a stock

**Source:** Google Gemini API response

**Structure:**
```javascript
{
  id: string,                  // Unique ID: `${timestamp}-${symbol}`
  symbol: string,              // Ticker with exchange suffix
  displaySymbol: string,       // Clean ticker for UI
  timestamp: string,           // ISO 8601 format (e.g., "2025-11-14T10:30:00Z")
  advice: string,              // Full AI-generated text (max ~500 chars)
  adviceSnippet: string,       // First 100 chars for preview
  summaryLabel: string,        // "optimistisch" | "voorzichtig" | "neutraal"
  priceChange: number,         // Percentage change used in analysis
  trendDescription: string     // "stijgend" | "dalend" | "stabiel" | "volatiel"
}
```

**Validation Rules:**
- `advice` must not be empty
- `timestamp` must be valid ISO 8601 string
- `summaryLabel` must be one of three allowed values
- `priceChange` must be finite number

**Example:**
```json
{
  "id": "1731589800000-ASML.AS",
  "symbol": "ASML.AS",
  "displaySymbol": "ASML",
  "timestamp": "2025-11-14T10:30:00Z",
  "advice": "ASML heeft de afgelopen 30 dagen een stijgende trend laten zien met een waardestijging van 12.3%. Dit kan duiden op positief marktsentiment rondom de halfgeleidersector...",
  "adviceSnippet": "ASML heeft de afgelopen 30 dagen een stijgende trend laten zien met een waardestijging van 12.3%...",
  "summaryLabel": "optimistisch",
  "priceChange": 12.3,
  "trendDescription": "stijgend"
}
```

---

### 4. AppState

**Description:** Complete application state stored in localStorage

**Source:** Client-side state management

**Structure:**
```javascript
{
  version: string,             // Schema version (e.g., "1.0")
  lastTicker: string | null,   // Last selected ticker symbol or null
  adviceHistory: AIAdvice[],   // Array of advice entries (max 10)
  lastUpdated: string          // ISO 8601 timestamp of last state change
}
```

**Validation Rules:**
- `version` must match current schema version
- `lastTicker` must be valid ticker format if not null
- `adviceHistory` length must not exceed 10
- Array must be ordered newest-first (adviceHistory[0] is most recent)

**Default State:**
```json
{
  "version": "1.0",
  "lastTicker": null,
  "adviceHistory": [],
  "lastUpdated": "2025-11-14T09:00:00Z"
}
```

**Example with Data:**
```json
{
  "version": "1.0",
  "lastTicker": "ASML.AS",
  "adviceHistory": [
    {
      "id": "1731589800000-ASML.AS",
      "symbol": "ASML.AS",
      "displaySymbol": "ASML",
      "timestamp": "2025-11-14T10:30:00Z",
      "advice": "ASML heeft de afgelopen 30 dagen...",
      "adviceSnippet": "ASML heeft de afgelopen 30 dagen...",
      "summaryLabel": "optimistisch",
      "priceChange": 12.3,
      "trendDescription": "stijgend"
    },
    {
      "id": "1731586200000-ING.AS",
      "symbol": "ING.AS",
      "displaySymbol": "ING",
      "timestamp": "2025-11-14T09:30:00Z",
      "advice": "ING toont een relatief stabiele koers...",
      "adviceSnippet": "ING toont een relatief stabiele koers...",
      "summaryLabel": "neutraal",
      "priceChange": 2.1,
      "trendDescription": "stabiel"
    }
  ],
  "lastUpdated": "2025-11-14T10:30:15Z"
}
```

---

## State Transitions

### Initial Load

```
[Browser Opens] 
    ↓
[Check localStorage]
    ↓
[localStorage exists & valid?]
    ├─ Yes → Load AppState → Auto-fetch lastTicker
    └─ No  → Initialize empty AppState
```

### Ticker Selection

```
[User selects ticker]
    ↓
[Show loading indicator]
    ↓
[Parallel API calls]
    ├─ fetchQuote(ticker)
    └─ fetchCandles(ticker)
    ↓
[Both succeed?]
    ├─ Yes → Update UI + Save lastTicker to AppState
    └─ No  → Show error + Clear loading
```

### Advice Generation

```
[User clicks "Genereer advies"]
    ↓
[Disable button + Show loading]
    ↓
[Calculate trend from CandleData]
    ↓
[Send Gemini API request]
    ↓
[Success?]
    ├─ Yes → Display advice + Add to history + Save AppState
    └─ No  → Show error + Re-enable button
```

### Data Reset

```
[User clicks "Wis gegevens"]
    ↓
[Confirm dialog (optional)]
    ↓
[Clear localStorage]
    ↓
[Reset AppState to empty]
    ↓
[Reset UI to initial state]
    ↓
[Show confirmation message]
```

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      Browser (Client)                        │
│                                                              │
│  ┌──────────────┐         ┌────────────────┐               │
│  │ localStorage │◄────────┤   AppState     │               │
│  └──────────────┘         └────────────────┘               │
│         ▲                         ▲                          │
│         │                         │                          │
│         │                         │                          │
│  ┌──────┴──────┐          ┌──────┴────────┐                │
│  │   Load/Save │          │   UI Actions  │                │
│  │   Functions │          │   (Events)    │                │
│  └─────────────┘          └───────┬───────┘                │
│                                    │                         │
│                           ┌────────┴────────┐               │
│                           │ API Integration │               │
│                           └────────┬────────┘               │
└────────────────────────────────────┼─────────────────────────┘
                                     │
                    ┌────────────────┴────────────────┐
                    │                                  │
          ┌─────────▼─────────┐           ┌──────────▼─────────┐
          │   Finnhub API     │           │   Gemini API       │
          │                   │           │                    │
          │  - /quote         │           │  - generateContent │
          │  - /stock/candle  │           │                    │
          └───────────────────┘           └────────────────────┘
```

---

## Data Persistence Strategy

### localStorage Key

**Key:** `stockDashboardState`

**Value:** JSON-stringified `AppState` object

### Write Operations

1. **On Ticker Selection:** Update `lastTicker`
2. **On Advice Generation:** Add entry to `adviceHistory` (unshift to front)
3. **On History Overflow:** Remove oldest entry (pop from end) if count > 10
4. **On Reset:** Delete entire key from localStorage

### Read Operations

1. **On App Init:** Attempt to parse `localStorage.getItem('stockDashboardState')`
2. **On Parse Error:** Log warning, reset to empty state
3. **On Version Mismatch:** Attempt migration or reset (future-proofing)

### Graceful Degradation

```javascript
function initializeState() {
  try {
    const stored = localStorage.getItem('stockDashboardState');
    if (!stored) return getEmptyState();
    
    const state = JSON.parse(stored);
    
    // Validate schema version
    if (state.version !== '1.0') {
      console.warn('State version mismatch, resetting');
      return getEmptyState();
    }
    
    // Validate structure
    if (!Array.isArray(state.adviceHistory)) {
      console.warn('Invalid state structure, resetting');
      return getEmptyState();
    }
    
    return state;
  } catch (error) {
    console.error('Failed to load state:', error);
    showNotice('Opgeslagen gegevens beschadigd. App wordt gereset.');
    return getEmptyState();
  }
}

function saveState(state) {
  try {
    state.lastUpdated = new Date().toISOString();
    localStorage.setItem('stockDashboardState', JSON.stringify(state));
  } catch (error) {
    if (error.name === 'QuotaExceededError') {
      showNotice('Opslag vol. Gegevens kunnen niet worden opgeslagen.');
    } else {
      console.error('Failed to save state:', error);
    }
  }
}
```

---

## Data Validation

### Input Validation

**Ticker Symbols:**
```javascript
function validateTicker(input) {
  const cleaned = input.trim().toUpperCase();
  
  // Must be 1-10 characters (allows exchange suffixes)
  if (cleaned.length < 1 || cleaned.length > 10) {
    return { valid: false, error: 'Ticker moet 1-10 karakters zijn' };
  }
  
  // Alphanumeric and dots only (for .AS suffix)
  if (!/^[A-Z0-9.]+$/.test(cleaned)) {
    return { valid: false, error: 'Alleen letters, cijfers en punten toegestaan' };
  }
  
  return { valid: true, value: cleaned };
}
```

**API Response Validation:**
```javascript
function validateQuoteResponse(data) {
  if (!data || typeof data !== 'object') return false;
  if (typeof data.c !== 'number' || data.c <= 0) return false;
  if (typeof data.d !== 'number' || !isFinite(data.d)) return false;
  if (typeof data.dp !== 'number' || !isFinite(data.dp)) return false;
  return true;
}

function validateCandleResponse(data) {
  if (!data || data.s !== 'ok') return false;
  if (!Array.isArray(data.c) || data.c.length < 10) return false;
  if (!Array.isArray(data.t) || data.t.length !== data.c.length) return false;
  return true;
}
```

---

## Performance Considerations

### Memory Management

- **Chart Instance:** Destroy previous Chart.js instance before creating new one
- **History Limit:** Cap at 10 entries prevents unbounded growth
- **Event Listeners:** Remove listeners when no longer needed (if dynamically added)

### Storage Optimization

- **String Compression:** Not implemented (violates simplicity principle)
- **Lazy Loading:** Not applicable (all data fetched on-demand)
- **Caching:** Not implemented (always fetch fresh data)

**Estimated Storage Usage:**
- AppState: ~500 bytes base
- Each AIAdvice: ~1KB (500 chars text + metadata)
- Total with 10 entries: ~10.5 KB (well under 5MB localStorage limit)

---

## Future Schema Migrations

If `AppState` structure needs to change in future versions:

```javascript
function migrateState(state) {
  const currentVersion = '1.0';
  
  if (state.version === currentVersion) return state;
  
  // Example migration from 1.0 → 2.0
  if (state.version === '1.0') {
    // Add new fields, transform existing ones
    return {
      ...state,
      version: '2.0',
      newField: defaultValue
    };
  }
  
  // If migration not supported, reset
  console.warn(`Cannot migrate from version ${state.version}`);
  return getEmptyState();
}
```

---

**End of Data Model Document**

