# Finnhub API Contract

**API Documentation:** https://finnhub.io/docs/api/introduction  
**Base URL:** `https://finnhub.io/api/v1`  
**Authentication:** API Key (query parameter)

---

## Authentication

All requests require an API key as a query parameter:

```
?token={YOUR_API_KEY}
```

**Example:**
```
https://finnhub.io/api/v1/quote?symbol=ASML.AS&token=abc123xyz
```

---

## Endpoint 1: Stock Quote

**Purpose:** Retrieve current price and change information for a stock symbol

### Request

**Method:** `GET`

**Endpoint:** `/quote`

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| symbol | string | Yes | Stock ticker symbol with exchange suffix (e.g., "ASML.AS") |
| token | string | Yes | API key for authentication |

**Example Request:**
```
GET https://finnhub.io/api/v1/quote?symbol=ASML.AS&token={API_KEY}
```

### Response

**Success (200 OK):**

```json
{
  "c": 725.50,    // Current price
  "d": 12.30,     // Change
  "dp": 1.73,     // Percent change
  "h": 728.00,    // High price of the day
  "l": 718.50,    // Low price of the day
  "o": 720.00,    // Open price of the day
  "pc": 713.20,   // Previous close price
  "t": 1731589800 // Unix timestamp
}
```

**Field Descriptions:**

- `c` (number): Current trading price in EUR
- `d` (number): Absolute change from previous close (can be positive/negative)
- `dp` (number): Percentage change from previous close
- `h` (number): Highest price during current trading day
- `l` (number): Lowest price during current trading day
- `o` (number): Opening price of current trading day
- `pc` (number): Previous day's closing price
- `t` (number): Unix timestamp of quote (seconds since epoch)

**Error Responses:**

| Status Code | Meaning | Response Body |
|-------------|---------|---------------|
| 401 | Invalid API key | `{"error": "Invalid API key"}` |
| 404 | Symbol not found | `{"error": "Symbol not found"}` |
| 429 | Rate limit exceeded | `{"error": "API rate limit exceeded"}` |
| 500 | Server error | `{"error": "Internal server error"}` |

**Application Usage:**

```javascript
async function fetchQuote(symbol) {
  const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    // Map to Dutch error messages
    throw new Error(getErrorMessage(response.status));
  }
  
  const data = await response.json();
  
  // Validate response structure
  if (!validateQuoteResponse(data)) {
    throw new Error('Invalid response format');
  }
  
  return {
    symbol: symbol,
    displaySymbol: symbol.replace('.AS', ''),
    currentPrice: data.c,
    change: data.d,
    changePercent: data.dp,
    previousClose: data.pc,
    timestamp: data.t
  };
}
```

---

## Endpoint 2: Stock Candles (Historical Data)

**Purpose:** Retrieve historical OHLC (Open, High, Low, Close) candlestick data

### Request

**Method:** `GET`

**Endpoint:** `/stock/candle`

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| symbol | string | Yes | Stock ticker symbol with exchange suffix |
| resolution | string | Yes | Timeframe ("D" for daily) |
| from | number | Yes | Unix timestamp for start date |
| to | number | Yes | Unix timestamp for end date |
| token | string | Yes | API key for authentication |

**Example Request:**
```
GET https://finnhub.io/api/v1/stock/candle
  ?symbol=ASML.AS
  &resolution=D
  &from=1728691200
  &to=1731589800
  &token={API_KEY}
```

**Date Range Calculation:**
```javascript
const today = Math.floor(Date.now() / 1000);
const thirtyDaysAgo = today - (30 * 24 * 60 * 60);

const url = `https://finnhub.io/api/v1/stock/candle?symbol=${symbol}&resolution=D&from=${thirtyDaysAgo}&to=${today}&token=${FINNHUB_API_KEY}`;
```

### Response

**Success (200 OK) with Data:**

```json
{
  "c": [715.20, 720.50, 725.50, ...],   // Close prices
  "h": [718.00, 722.00, 728.50, ...],   // High prices
  "l": [708.50, 713.00, 718.00, ...],   // Low prices
  "o": [710.00, 715.50, 720.00, ...],   // Open prices
  "t": [1728691200, 1728777600, 1728864000, ...], // Unix timestamps
  "v": [1234567, 1345678, 1456789, ...], // Volumes
  "s": "ok"                              // Status
}
```

**Success (200 OK) with No Data:**

```json
{
  "s": "no_data"
}
```

**Field Descriptions:**

- `c` (number[]): Array of closing prices for each period
- `h` (number[]): Array of highest prices
- `l` (number[]): Array of lowest prices
- `o` (number[]): Array of opening prices
- `t` (number[]): Array of Unix timestamps (one per period)
- `v` (number[]): Array of trading volumes
- `s` (string): Status indicator ("ok" = data available, "no_data" = no data for range)

**Important Notes:**

- All arrays are parallel (same length, same order)
- Weekend dates and holidays are excluded (no trading data)
- Typical 30-day request returns 20-22 data points (excluding weekends)
- Timestamps are midnight UTC for daily resolution

**Error Responses:**

| Status Code | Meaning | Response Body |
|-------------|---------|---------------|
| 401 | Invalid API key | `{"error": "Invalid API key"}` |
| 404 | Symbol not found | `{"s": "no_data"}` or error |
| 429 | Rate limit exceeded | `{"error": "API rate limit exceeded"}` |
| 500 | Server error | `{"error": "Internal server error"}` |

**Application Usage:**

```javascript
async function fetchCandles(symbol) {
  const today = Math.floor(Date.now() / 1000);
  const thirtyDaysAgo = today - (30 * 24 * 60 * 60);
  
  const url = `https://finnhub.io/api/v1/stock/candle?symbol=${symbol}&resolution=D&from=${thirtyDaysAgo}&to=${today}&token=${FINNHUB_API_KEY}`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(getErrorMessage(response.status));
  }
  
  const data = await response.json();
  
  // Check for no data
  if (data.s === 'no_data' || !data.c || data.c.length < 10) {
    throw new Error('Onvoldoende historische data beschikbaar');
  }
  
  return {
    symbol: symbol,
    resolution: 'D',
    timestamps: data.t,
    open: data.o,
    high: data.h,
    low: data.l,
    close: data.c,
    volume: data.v,
    status: data.s
  };
}
```

---

## Rate Limits

**Free Tier:**
- 60 API calls per minute
- 30 API calls per second (burst)

**Recommendation for Workshop:**
- Implement 1-second cooldown between requests
- Show loading indicators to prevent double-clicks
- Consider pre-loading common tickers if workshop has many participants

---

## Error Handling Strategy

### Client-Side Implementation

```javascript
function getFinnhubErrorMessage(status) {
  switch (status) {
    case 401:
      return 'Finnhub API-sleutel is ongeldig. Controleer je configuratie.';
    case 404:
      return 'Ticker niet gevonden. Controleer de symbool en probeer opnieuw.';
    case 429:
      return 'Te veel verzoeken. Wacht 10 seconden en probeer opnieuw.';
    case 500:
    case 503:
      return 'Finnhub service tijdelijk niet beschikbaar. Probeer het later opnieuw.';
    default:
      return 'Kan marktdata niet ophalen. Probeer het later opnieuw.';
  }
}
```

### Logging for Workshop Debugging

```javascript
async function fetchWithLogging(url, context) {
  console.log(`[Finnhub ${context}] Request:`, url.replace(/token=[^&]+/, 'token=***'));
  
  try {
    const response = await fetch(url);
    
    console.log(`[Finnhub ${context}] Status:`, response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[Finnhub ${context}] Error:`, errorText);
      throw new Error(getFinnhubErrorMessage(response.status));
    }
    
    const data = await response.json();
    console.log(`[Finnhub ${context}] Response:`, data);
    
    return data;
  } catch (error) {
    console.error(`[Finnhub ${context}] Exception:`, error);
    throw error;
  }
}
```

---

## Testing Endpoints

### Manual Testing with curl

**Quote Endpoint:**
```bash
curl "https://finnhub.io/api/v1/quote?symbol=ASML.AS&token=YOUR_API_KEY"
```

**Candle Endpoint:**
```bash
FROM=$(date -v-30d +%s)  # macOS
TO=$(date +%s)

curl "https://finnhub.io/api/v1/stock/candle?symbol=ASML.AS&resolution=D&from=$FROM&to=$TO&token=YOUR_API_KEY"
```

### Browser DevTools Testing

1. Open browser DevTools (F12)
2. Go to Console tab
3. Test quote endpoint:
```javascript
fetch('https://finnhub.io/api/v1/quote?symbol=ASML.AS&token=YOUR_API_KEY')
  .then(r => r.json())
  .then(console.log);
```

---

**End of Finnhub API Contract**

