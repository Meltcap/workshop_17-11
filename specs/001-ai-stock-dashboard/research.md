# Research & Technical Decisions

**Feature:** AI-Enhanced Browser-Based Stock Dashboard  
**Date:** 2025-11-14  
**Status:** Complete

## Purpose

This document consolidates research findings and technical decisions made during the planning phase to resolve uncertainties and establish implementation patterns.

---

## Research Items

### 1. Dutch Ticker Symbols in Finnhub API

**Question:** Do Dutch company tickers require exchange suffix (e.g., ".AS" for Amsterdam) when querying Finnhub API?

**Research Conducted:**
- Reviewed Finnhub API documentation: https://finnhub.io/docs/api/stock-symbols
- Finnhub requires exchange-specific ticker formats for non-US stocks
- Amsterdam Stock Exchange uses suffix `.AS`

**Decision:** Use `.AS` suffix for all Dutch tickers

**Rationale:**
- Ensures unambiguous ticker resolution
- Aligns with Finnhub's expected format for Euronext Amsterdam stocks
- Prevents confusion with US tickers (e.g., ING Bank vs ING Group)

**Implementation Impact:**
- Predefined ticker buttons will use format: `ASML.AS`, `ADYEN.AS`, `ING.AS`, etc.
- Manual input will append `.AS` automatically for known Dutch tickers
- Display will show clean ticker without suffix in UI (strip `.AS` for presentation)

**Example:**
```javascript
const DUTCH_TICKERS = [
  { symbol: 'ASML.AS', display: 'ASML' },
  { symbol: 'ADYEN.AS', display: 'ADYEN' },
  { symbol: 'ING.AS', display: 'ING' },
  // ... etc
];
```

**Alternative Considered:**
- Using ticker without suffix and relying on Finnhub's automatic resolution
- **Rejected:** Unreliable, may return wrong company or fail

---

### 2. Chart.js Best Practices for Financial Data

**Question:** What Chart.js configuration provides best readability for stock price visualization?

**Research Conducted:**
- Reviewed Chart.js documentation: https://www.chartjs.org/docs/latest/
- Analyzed common financial chart patterns
- Considered workshop time constraints

**Decision:** Use simple line chart with sensible defaults

**Configuration:**
```javascript
{
  type: 'line',
  data: {
    labels: dateLabels,  // Dutch formatted: "14 nov"
    datasets: [{
      label: 'Slotkoers',
      data: closePrices,
      borderColor: '#007bff',
      backgroundColor: 'rgba(0, 123, 255, 0.1)',
      borderWidth: 2,
      tension: 0.1,  // Slight curve for smoother appearance
      pointRadius: 3,
      pointHoverRadius: 5
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: 'top' },
      title: { 
        display: true, 
        text: 'Historische Koers (30 dagen)',
        font: { size: 16, weight: 'bold' }
      },
      tooltip: {
        callbacks: {
          label: (context) => `€${context.parsed.y.toFixed(2)}`
        }
      }
    },
    scales: {
      x: {
        display: true,
        title: { display: true, text: 'Datum' }
      },
      y: {
        display: true,
        title: { display: true, text: 'Prijs (€)' },
        beginAtZero: false,  // Important: stock prices don't start at 0
        ticks: {
          callback: (value) => '€' + value.toFixed(2)
        }
      }
    }
  }
}
```

**Rationale:**
- Line charts are universally understood
- Minimal configuration = easy for workshop participants to understand
- Dutch labels throughout for consistency

**Alternatives Considered:**
- Candlestick charts (OHLC data): More information-dense but complex
  - **Rejected:** Too advanced for 2-3 hour workshop
- Area charts with gradient: Visually appealing but harder to read exact values
  - **Rejected:** Precision more important than aesthetics for educational context

---

### 3. Gemini API Prompt Engineering for Educational Financial Content

**Question:** How to structure prompts to consistently generate balanced, educational financial insights without crossing into advice territory?

**Research Conducted:**
- Reviewed Gemini API best practices: https://ai.google.dev/gemini-api/docs/prompting-strategies
- Analyzed examples of educational vs advisory language
- Considered regulatory implications of financial content

**Decision:** Use structured prompt with explicit constraints

**Prompt Template:**
```
Je bent een educatieve financiële assistent die helpt bij het begrijpen van aandelenmarkt bewegingen. Je geeft GEEN aankoop- of verkoopadvies.

Analyseer de volgende informatie:
• Ticker: {SYMBOL}
• Trend: {TREND_DESCRIPTION} (bijv. "stijgend", "dalend", "volatiel")
• Prijsverandering (30 dagen): {PERCENTAGE_CHANGE}%

Geef een educatief inzicht in maximaal 150 woorden dat:
1. Uitlegt wat het recente prijsgedrag betekent (feitelijk, neutraal)
2. Mogelijke risicofactoren benoemt die beleggers moeten overwegen
3. Mogelijke kansen beschrijft zonder specifieke aanbevelingen

Gebruik eenvoudige taal geschikt voor beginners. Vermijd jargon waar mogelijk.
Gebruik GEEN imperatieve zinnen zoals "koop", "verkoop", "investeer nu".

Begin je antwoord direct met de analyse, geen inleiding nodig.
```

**Rationale:**
- Explicit role definition ("educatieve assistent") sets tone
- Negative constraints ("GEEN advies") are legally important
- Structured format ensures all requirements are addressed
- Word limit (150) keeps responses concise for UI display
- Dutch language throughout for workshop audience

**Example Expected Response:**
> "ASML heeft de afgelopen 30 dagen een stijgende trend laten zien met een waardestijging van 12.3%. Dit kan duiden op positief marktsentiment rondom de halfgeleidersector. Risico's om rekening mee te houden zijn de cyclische aard van de chipindustrie en geopolitieke spanningen die toeleveringsketens kunnen verstoren. Kansen liggen in de groeiende vraag naar geavanceerde chipproductie voor AI en datacentermarkt. Dit is geen financieel advies - raadpleeg een adviseur voor persoonlijke investeringsbeslissingen."

**Alternatives Considered:**
- Few-shot prompting with examples: More consistent but longer prompt
  - **Rejected:** Token cost, complexity for workshop modification
- Chain-of-thought reasoning: Better analysis quality
  - **Rejected:** Too slow for workshop demo (latency)
- Temperature tuning (lower = more deterministic): More predictable output
  - **Accepted as supplement:** Use temperature=0.7 for balance

---

### 4. localStorage Schema and History Management

**Question:** What JSON structure best balances functionality with simplicity for workshop context?

**Research Conducted:**
- Analyzed localStorage capacity limits (5-10MB typical)
- Considered data needed for spec requirements
- Evaluated query patterns (most recent, by ticker, etc.)

**Decision:** Simple flat structure with bounded array

**Schema:**
```json
{
  "lastTicker": "ASML.AS",
  "adviceHistory": [
    {
      "id": "1731589800000-ASML",  // timestamp-ticker for uniqueness
      "symbol": "ASML.AS",
      "displaySymbol": "ASML",
      "timestamp": "2025-11-14T10:30:00Z",
      "summaryLabel": "optimistisch",
      "adviceSnippet": "ASML heeft de afgelopen 30 dagen een stijgende trend...",
      "fullAdvice": "...",  // Complete AI response
      "priceChange": 12.3
    }
  ],
  "version": "1.0"  // For future schema migrations
}
```

**History Management Rules:**
- Maximum 10 entries (FIFO when adding 11th)
- Newest first in array (unshift, not push)
- Duplicate detection: Don't add if same ticker within last hour
- Size estimation: ~2KB per entry, ~20KB total (well under 5MB limit)

**Rationale:**
- Simple array is easy to understand in workshop setting
- Bounded size prevents storage bloat
- Timestamp in ID ensures uniqueness
- Version field enables future improvements without breaking changes
- All strings for JSON compatibility (no Date objects)

**Alternatives Considered:**
- Indexed structure with ticker as key: Faster lookup but more complex
  - **Rejected:** Unnecessary for 10 items, linear search is fine
- Compressed storage: Smaller size but requires library
  - **Rejected:** Violates "no dependencies" principle
- IndexedDB instead of localStorage: More powerful
  - **Rejected:** Too complex for workshop (localStorage is simpler API)

---

### 5. Error Handling Patterns for API Failures

**Question:** How to provide helpful error messages without exposing technical details?

**Research Conducted:**
- Reviewed UX best practices for error messaging
- Considered workshop debugging needs
- Analyzed common API failure modes

**Decision:** Two-tier error handling (user-facing + console logging)

**Pattern:**
```javascript
async function fetchWithErrorHandling(url, context) {
  try {
    const response = await fetch(url);
    
    // Map HTTP status to user-friendly Dutch message
    if (!response.ok) {
      const userMessage = getErrorMessage(response.status, context);
      const technicalDetails = await response.text();
      
      // User sees friendly message
      showError(userMessage);
      
      // Workshop participants/developers see details in console
      console.error(`[${context}] HTTP ${response.status}:`, {
        url,
        status: response.status,
        statusText: response.statusText,
        response: technicalDetails
      });
      
      return null;
    }
    
    return await response.json();
  } catch (error) {
    // Network errors, JSON parse errors, etc.
    showError('Er is een fout opgetreden. Probeer het opnieuw.');
    console.error(`[${context}] Error:`, error);
    return null;
  }
}

function getErrorMessage(status, context) {
  const messages = {
    finnhub: {
      401: 'Finnhub API-sleutel is ongeldig. Controleer je configuratie.',
      404: 'Ticker niet gevonden. Controleer de symbool.',
      429: 'Te veel verzoeken. Wacht 10 seconden en probeer opnieuw.',
      500: 'Finnhub service tijdelijk niet beschikbaar.',
      default: 'Kan marktdata niet ophalen. Probeer het later opnieuw.'
    },
    gemini: {
      401: 'Gemini API-sleutel is ongeldig. Controleer je configuratie.',
      429: 'AI-quota bereikt. Probeer over een minuut opnieuw.',
      500: 'AI-service tijdelijk niet beschikbaar.',
      default: 'AI-advies kan niet worden gegenereerd. Probeer opnieuw.'
    }
  };
  
  return messages[context][status] || messages[context].default;
}
```

**Rationale:**
- User sees actionable, non-technical Dutch messages
- Console provides debugging information for workshop instructors
- Structured logging aids troubleshooting during workshop
- Error codes mapped to specific scenarios

**Alternatives Considered:**
- Single generic error message: Simpler but less helpful
  - **Rejected:** Workshop goal is learning, specific feedback aids understanding
- Modal dialogs for errors: More prominent
  - **Rejected:** Disruptive to flow, inline messages preferable
- Error codes in UI: Precise but technical
  - **Rejected:** Breaks "beginner-friendly" principle

---

### 6. Date Formatting for Dutch Locale

**Question:** What date format is most familiar to Dutch users?

**Research Conducted:**
- Dutch date convention: DD-MM-YYYY
- Common financial chart formats
- Readability on small chart labels

**Decision:** Use `DD MMM` format for chart labels (e.g., "14 nov")

**Implementation:**
```javascript
function formatChartDate(unixTimestamp) {
  const date = new Date(unixTimestamp * 1000);
  const day = date.getDate();
  const monthNames = [
    'jan', 'feb', 'mrt', 'apr', 'mei', 'jun',
    'jul', 'aug', 'sep', 'okt', 'nov', 'dec'
  ];
  const month = monthNames[date.getMonth()];
  return `${day} ${month}`;
}

function formatFullDate(isoString) {
  const date = new Date(isoString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}
```

**Rationale:**
- `DD MMM` is compact enough for chart x-axis
- Abbreviated month names prevent crowding
- Dutch month names for locale consistency
- `DD-MM-YYYY` for full dates in history/timestamps

**Alternatives Considered:**
- `DD/MM` numeric only: More compact but less readable
  - **Rejected:** Month names improve clarity
- Full month names: Unambiguous
  - **Rejected:** Too long for chart labels
- Intl.DateTimeFormat API: Native locale support
  - **Accepted as enhancement:** Can use `new Intl.DateTimeFormat('nl-NL', options)` for production version

---

### 7. Sentiment Label Derivation Heuristic

**Question:** How to reliably extract sentiment from free-form AI responses?

**Research Conducted:**
- Tested Gemini responses for keyword patterns
- Evaluated NLP libraries (rejected due to complexity)
- Analyzed price correlation with sentiment

**Decision:** Price-based heuristic with fallback to keyword extraction

**Algorithm:**
```javascript
function deriveSentiment(percentageChange, aiResponseText) {
  // Primary: Rule-based on price change
  if (percentageChange > 5) return 'optimistisch';
  if (percentageChange < -5) return 'voorzichtig';
  if (Math.abs(percentageChange) < 2) return 'neutraal';
  
  // Secondary: Keyword extraction from AI response
  const positiveKeywords = ['kansen', 'groei', 'positief', 'stijgend', 'verbetering'];
  const negativeKeywords = ['risico', 'daling', 'volatiel', 'onzekerheid', 'druk'];
  
  const text = aiResponseText.toLowerCase();
  const positiveCount = positiveKeywords.filter(kw => text.includes(kw)).length;
  const negativeCount = negativeKeywords.filter(kw => text.includes(kw)).length;
  
  if (positiveCount > negativeCount + 1) return 'optimistisch';
  if (negativeCount > positiveCount + 1) return 'voorzichtig';
  
  // Default: Based on trend direction
  return percentageChange > 0 ? 'neutraal-positief' : 'neutraal-negatief';
}
```

**Rationale:**
- Price change is objective and reliable
- Keyword extraction handles edge cases
- Simple logic, no external dependencies
- Transparent to workshop participants

**Alternatives Considered:**
- ML-based sentiment analysis: Most accurate
  - **Rejected:** Requires TensorFlow.js, too complex for workshop
- Regex pattern matching: More flexible
  - **Rejected:** Over-engineering for simple categorization
- Ask Gemini for explicit sentiment label: Consistent
  - **Rejected:** Extra API call, higher latency and cost

---

## Implementation Recommendations

### Priority Order

1. **Ticker format decision (Item 1):** Implement first - affects all API calls
2. **Error handling pattern (Item 5):** Implement early - needed throughout
3. **Chart.js config (Item 2):** Straightforward implementation
4. **localStorage schema (Item 4):** Define before any persistence code
5. **Gemini prompting (Item 3):** Refine during AI integration phase
6. **Date formatting (Item 6):** Utility functions, low risk
7. **Sentiment derivation (Item 7):** Last - depends on AI integration

### Open Questions (None)

All research items have been resolved with clear decisions. No blockers remain for implementation.

### Workshop Considerations

- Pre-configure ticker suffixes in demo code to save explanation time
- Live-demonstrate console logging during error scenarios
- Show DevTools localStorage inspection to reinforce concepts
- Keep code comments referencing research decisions for learning

---

**End of Research Document**

