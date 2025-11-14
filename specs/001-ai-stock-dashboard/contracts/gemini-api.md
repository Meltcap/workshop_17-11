# Google Gemini API Contract

**API Documentation:** https://ai.google.dev/gemini-api/docs  
**Base URL:** `https://generativelanguage.googleapis.com/v1beta`  
**Authentication:** API Key (query parameter)  
**Model:** `gemini-2.5-flash`

---

## Authentication

All requests require an API key as a query parameter:

```
?key={YOUR_API_KEY}
```

**Example:**
```
https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=abc123xyz
```

---

## Endpoint: Generate Content

**Purpose:** Generate educational text analysis of stock market data

### Request

**Method:** `POST`

**Endpoint:** `/models/gemini-2.5-flash:generateContent`

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| key | string | Yes | API key for authentication |

**Headers:**

```
Content-Type: application/json
```

**Request Body:**

```json
{
  "contents": [
    {
      "parts": [
        {
          "text": "Your prompt text here"
        }
      ]
    }
  ],
  "generationConfig": {
    "temperature": 0.7,
    "maxOutputTokens": 500,
    "topP": 0.9,
    "topK": 40
  }
}
```

**Field Descriptions:**

- `contents` (array): Array of content objects (typically one)
  - `parts` (array): Array of part objects (typically one with text)
    - `text` (string): The prompt/instruction for the model
- `generationConfig` (object, optional): Generation parameters
  - `temperature` (number, 0-1): Randomness (0.7 = balanced)
  - `maxOutputTokens` (number): Max length of response (~500 words = ~600 tokens)
  - `topP` (number, 0-1): Nucleus sampling parameter
  - `topK` (number): Top-k sampling parameter

**Example Request for Stock Advice:**

```javascript
const prompt = `Je bent een educatieve financiële assistent die helpt bij het begrijpen van aandelenmarkt bewegingen. Je geeft GEEN aankoop- of verkoopadvies.

Analyseer de volgende informatie:
• Ticker: ASML
• Trend: stijgend (koers steeg van €650 naar €725)
• Prijsverandering (30 dagen): +11.5%

Geef een educatief inzicht in maximaal 150 woorden dat:
1. Uitlegt wat het recente prijsgedrag betekent (feitelijk, neutraal)
2. Mogelijke risicofactoren benoemt die beleggers moeten overwegen
3. Mogelijke kansen beschrijft zonder specifieke aanbevelingen

Gebruik eenvoudige taal geschikt voor beginners. Vermijd jargon waar mogelijk.
Gebruik GEEN imperatieve zinnen zoals "koop", "verkoop", "investeer nu".

Begin je antwoord direct met de analyse, geen inleiding nodig.`;

const requestBody = {
  contents: [{
    parts: [{ text: prompt }]
  }],
  generationConfig: {
    temperature: 0.7,
    maxOutputTokens: 500,
    topP: 0.9,
    topK: 40
  }
};
```

### Response

**Success (200 OK):**

```json
{
  "candidates": [
    {
      "content": {
        "parts": [
          {
            "text": "ASML heeft de afgelopen 30 dagen een stijgende trend laten zien met een waardestijging van 11.5%. Dit kan duiden op positief marktsentiment rondom de halfgeleidersector en de toenemende vraag naar geavanceerde chipproductietechnologie. Risico's om rekening mee te houden zijn de cyclische aard van de halfgeleiderindustrie, geopolitieke spanningen die toeleveringsketens kunnen verstoren, en de afhankelijkheid van enkele grote klanten. Kansen liggen in de groeiende vraag naar chips voor AI-toepassingen, datacenteruitbreiding, en de beperkte concurrentie in het EUV-lithografiesegment waar ASML marktleider is. Dit is geen financieel advies - raadpleeg altijd een adviseur voor persoonlijke investeringsbeslissingen."
          }
        ],
        "role": "model"
      },
      "finishReason": "STOP",
      "index": 0,
      "safetyRatings": [
        {
          "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          "probability": "NEGLIGIBLE"
        },
        {
          "category": "HARM_CATEGORY_HATE_SPEECH",
          "probability": "NEGLIGIBLE"
        },
        {
          "category": "HARM_CATEGORY_HARASSMENT",
          "probability": "NEGLIGIBLE"
        },
        {
          "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
          "probability": "NEGLIGIBLE"
        }
      ]
    }
  ],
  "usageMetadata": {
    "promptTokenCount": 245,
    "candidatesTokenCount": 187,
    "totalTokenCount": 432
  }
}
```

**Field Descriptions:**

- `candidates` (array): Array of generated responses (typically one)
  - `content.parts[0].text` (string): The generated text response
  - `finishReason` (string): Why generation stopped ("STOP" = natural completion)
  - `safetyRatings` (array): Content safety classifications
- `usageMetadata` (object): Token usage statistics

**Extracting the Response:**

```javascript
const adviceText = response.candidates[0].content.parts[0].text;
```

**Error Responses:**

| Status Code | Meaning | Response Body |
|-------------|---------|---------------|
| 400 | Bad request (invalid JSON or parameters) | `{"error": {"code": 400, "message": "..."}}` |
| 401 | Invalid API key | `{"error": {"code": 401, "message": "API key not valid"}}` |
| 429 | Quota exceeded or rate limit | `{"error": {"code": 429, "message": "Resource exhausted"}}` |
| 500 | Server error | `{"error": {"code": 500, "message": "Internal error"}}` |

**Special Response Cases:**

**Safety Block:**
```json
{
  "candidates": [
    {
      "finishReason": "SAFETY",
      "safetyRatings": [...]
    }
  ]
}
```
→ No text generated due to safety filters

**Empty Response:**
```json
{
  "candidates": [
    {
      "content": {
        "parts": []
      },
      "finishReason": "OTHER"
    }
  ]
}
```
→ Generation failed for unspecified reason

---

## Application Implementation

### Prompt Template

```javascript
function buildPrompt(symbol, trendDescription, percentageChange) {
  return `Je bent een educatieve financiële assistent die helpt bij het begrijpen van aandelenmarkt bewegingen. Je geeft GEEN aankoop- of verkoopadvies.

Analyseer de volgende informatie:
• Ticker: ${symbol}
• Trend: ${trendDescription}
• Prijsverandering (30 dagen): ${percentageChange.toFixed(1)}%

Geef een educatief inzicht in maximaal 150 woorden dat:
1. Uitlegt wat het recente prijsgedrag betekent (feitelijk, neutraal)
2. Mogelijke risicofactoren benoemt die beleggers moeten overwegen
3. Mogelijke kansen beschrijft zonder specifieke aanbevelingen

Gebruik eenvoudige taal geschikt voor beginners. Vermijd jargon waar mogelijk.
Gebruik GEEN imperatieve zinnen zoals "koop", "verkoop", "investeer nu".

Begin je antwoord direct met de analyse, geen inleiding nodig.`;
}
```

### Fetch Implementation

```javascript
async function generateAdvice(symbol, candleData) {
  // Calculate trend metrics from candle data
  const firstClose = candleData.close[0];
  const lastClose = candleData.close[candleData.close.length - 1];
  const percentageChange = ((lastClose - firstClose) / firstClose) * 100;
  
  // Determine trend description
  let trendDescription;
  if (percentageChange > 5) {
    trendDescription = `stijgend (koers steeg van €${firstClose.toFixed(2)} naar €${lastClose.toFixed(2)})`;
  } else if (percentageChange < -5) {
    trendDescription = `dalend (koers daalde van €${firstClose.toFixed(2)} naar €${lastClose.toFixed(2)})`;
  } else {
    trendDescription = `stabiel (koers schommelde rond €${lastClose.toFixed(2)})`;
  }
  
  // Build prompt
  const prompt = buildPrompt(
    symbol.replace('.AS', ''),
    trendDescription,
    percentageChange
  );
  
  // Prepare request
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
  
  const requestBody = {
    contents: [{
      parts: [{ text: prompt }]
    }],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 500
    }
  };
  
  // Add timeout (10 seconds)
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(getGeminiErrorMessage(response.status));
    }
    
    const data = await response.json();
    
    // Validate response structure
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Invalid response format');
    }
    
    // Check for safety block or empty response
    if (data.candidates[0].finishReason === 'SAFETY') {
      throw new Error('Response blocked by safety filters');
    }
    
    if (!data.candidates[0].content.parts || !data.candidates[0].content.parts[0]) {
      throw new Error('Empty response from AI');
    }
    
    const adviceText = data.candidates[0].content.parts[0].text;
    
    return {
      advice: adviceText,
      adviceSnippet: adviceText.substring(0, 100) + '...',
      priceChange: percentageChange,
      trendDescription: trendDescription
    };
    
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('AI-verzoek duurt te lang. Probeer opnieuw.');
    }
    throw error;
  }
}
```

### Error Handling

```javascript
function getGeminiErrorMessage(status) {
  switch (status) {
    case 400:
      return 'AI-verzoek mislukt. Probeer opnieuw.';
    case 401:
      return 'Gemini API-sleutel is ongeldig. Controleer je configuratie.';
    case 429:
      return 'AI-quota bereikt. Probeer over een minuut opnieuw.';
    case 500:
    case 503:
      return 'AI-service tijdelijk niet beschikbaar. Probeer het later opnieuw.';
    default:
      return 'AI-advies kan niet worden gegenereerd. Probeer opnieuw.';
  }
}
```

---

## Rate Limits

**Free Tier (No API Key Cost):**
- 15 requests per minute (RPM)
- 1 million tokens per minute (TPM)
- 1,500 requests per day (RPD)

**Typical Token Usage:**
- Prompt: ~200-250 tokens
- Response: ~150-200 tokens
- Total per request: ~400-450 tokens

**Workshop Considerations:**
- 1,500 daily requests ÷ 20 participants = 75 requests per participant
- Sufficient for workshop demonstrations
- Consider providing backup API keys for large workshops

---

## Content Safety

Gemini has built-in safety filters that may block responses for:
- Financial advice that could be construed as regulated advice
- Content deemed harmful or misleading

**Mitigation Strategies:**
1. Use clear "educational" framing in prompts
2. Explicitly request balanced, factual analysis
3. Avoid asking for predictions or recommendations
4. Include disclaimer language in prompt

**If Response is Blocked:**
```javascript
if (response.candidates[0].finishReason === 'SAFETY') {
  showError('AI-antwoord geblokkeerd om veiligheidsredenen. Probeer een andere ticker.');
  console.warn('Safety block triggered for prompt:', prompt);
}
```

---

## Testing

### Manual Testing with curl

```bash
curl -X POST \
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "contents": [{
      "parts": [{
        "text": "Geef een korte educatieve uitleg over ASML in 50 woorden."
      }]
    }]
  }'
```

### Browser DevTools Testing

```javascript
const testPrompt = {
  contents: [{
    parts: [{
      text: "Wat is een aandeel? Leg het uit in eenvoudige taal."
    }]
  }]
};

fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=YOUR_API_KEY', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(testPrompt)
})
.then(r => r.json())
.then(data => console.log(data.candidates[0].content.parts[0].text));
```

---

## Best Practices

### Prompt Engineering Tips

1. **Be Explicit:** Clearly state role and constraints
2. **Use Structure:** Bullet points and numbered lists in prompts
3. **Set Boundaries:** Explicitly prohibit unwanted behaviors
4. **Specify Length:** Request word/token limits
5. **Request Format:** Ask for specific structure in response
6. **Use Examples:** Few-shot prompting for consistency (optional)

### Performance Optimization

1. **Cache Prompts:** Template strings reduce construction time
2. **Abort Long Requests:** 10-second timeout prevents hanging
3. **Retry with Backoff:** Implement exponential backoff for 429 errors
4. **Log Tokens:** Monitor usage via `usageMetadata` field

### Security Considerations

1. **Never Expose Key:** API key should be in constants, not hardcoded in multiple places
2. **Rate Limit Client-Side:** Disable button during request to prevent abuse
3. **Validate Input:** Sanitize ticker symbols before including in prompt
4. **Log Safely:** Mask API keys in console logs

---

**End of Gemini API Contract**

