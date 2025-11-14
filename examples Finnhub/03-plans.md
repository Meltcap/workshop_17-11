# 03-plans.md

speckit plans

Make a plan with the following tech requirements:

## Tech stack and runtime environment

This is a pure client-side web app:
- Plain HTML, CSS, vanilla JavaScript
- No backend, no frameworks, no build tooling, no Docker
- Use the browser Fetch API for all HTTP calls
- Use window.localStorage for simple JSON persistence

## API Configuration

**Finnhub REST API** (free tier - quote endpoint only):
- Endpoint: `https://finnhub.io/api/v1/quote`
- Example: https://finnhub.io/api/v1/quote?symbol=AAPL&token=YOUR_KEY
- Authentication: Query parameter (`?token=YOUR_KEY`)
- Response: Current price, daily change, previous close
- Documentation: https://finnhub.io/docs/api/introduction
- **Note:** Candle endpoint NOT available on free tier

**LiteLLM Proxy** (OpenAI-compatible):
- Base URL: `https://llmproxy.fd.nl`
- Endpoint: `/v1/chat/completions`
- Model: `Azure/gpt-5-mini`
- Authentication: Bearer token in Authorization header
- Request format: OpenAI Chat Completions API

Example LiteLLM call (Python reference):
```python
from openai import OpenAI

API_KEY = "sk-..."
API_BASE = "https://llmproxy.fd.nl"
MODEL = "Azure/gpt-5-mini"

client = OpenAI(api_key=API_KEY, base_url=API_BASE)
response = client.chat.completions.create(
    model=MODEL, 
    messages=[{"role": "user", "content": "Wie is Donald Trump?"}]
)
print(response.choices[0].message.content)
```

JavaScript equivalent:
```javascript
const response = await fetch('https://llmproxy.fd.nl/v1/chat/completions', {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${LITELLM_API_KEY}`,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        model: 'Azure/gpt-5-mini',
        messages: [
            { role: 'system', content: 'Je bent een educatieve assistent.' },
            { role: 'user', content: prompt }
        ],
        stream: false
    })
});
const data = await response.json();
const text = data.choices[0].message.content;
```

## API Keys

Place at top of script.js as constants:
```javascript
const FINNHUB_API_KEY = 'YOUR_FINNHUB_KEY_HERE';
const LITELLM_API_KEY = 'YOUR_LITELLM_KEY_HERE';
```

**⚠️ Mention clearly:** This is only acceptable for workshop/demo purposes. Production requires backend proxy.

## Error handling and edge cases (technical)

Handle:
- Non-200 responses from Finnhub (401/403/429/5xx)
- Invalid ticker symbols
- LiteLLM failures (401/403/429/5xx), timeouts, invalid JSON
- CORS issues (ensure LiteLLM proxy allows browser access)
- localStorage unavailable or containing invalid JSON
- Network timeouts (10s limit recommended)