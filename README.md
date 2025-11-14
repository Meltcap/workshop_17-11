# Workshop: Browser-Based Web Applications

Workshop repository met voorbeeldprojecten voor het bouwen van browser-only web applicaties met vanilla JavaScript.

## 📚 Workshop Voorbeelden

Deze repository bevat twee praktijkvoorbeelden die tijdens de workshop worden behandeld:

### 1. Snake Game

Een klassiek Snake spel met score tracking (referentie-implementatie).

**Features:**

- Browser-based Snake gameplay
- High score tracking met localStorage
- Multiple players support
- FD BUSINESS styling

**Tech stack:**

- Vanilla JavaScript (ES6+)
- HTML5 Canvas API
- localStorage voor scores

### 2. Finnhub Stock Dashboard

Een educatieve applicatie voor het analyseren van aandelenkoersen met AI-ondersteuning.

**Features:**

- Real-time aandelenkoersen via Finnhub API
- AI-gegenereerde educatieve adviezen via LiteLLM proxy
- localStorage voor persistentie
- Volledig Nederlandse UI

**Tech stack:**

- Vanilla JavaScript, HTML5, CSS3
- Finnhub REST API (quote endpoint)
- LiteLLM Proxy (OpenAI-compatible)
- Browser Fetch API
- localStorage

## 🎯 Workshop Doelen

Deze workshop leert je:

- Browser-only applicaties bouwen zonder backend
- Werken met externe REST APIs (Finnhub, LiteLLM)
- AI-integratie in web applicaties
- localStorage voor state management
- Vanilla JavaScript best practices
- Error handling en API rate limiting

## 🚀 Aan de Slag

### Vereisten

- Moderne webbrowser (Chrome, Firefox, Safari, Edge)
- Cursor
- Finnhub API key (verstrekt tijdens workshop)
- LiteLLM API key (verstrekt tijdens workshop)

### Snake Game

**Specificaties bekijken:** `examples Snake/`

1. Lees `01-constitution.md` (projectprincipes)
2. Bekijk `02-specify.md` (feature specificatie)
3. Bestudeer `03-plans.md` (implementatieplan)

**Implementatie uitproberen:**

1. Open `index.html` in je browser
2. Speel het spel om vertrouwd te raken met browser-based development

### Finnhub Dashboard

**Specificaties bekijken:** `examples Finnhub/`

1. Lees `01-constitution.md` (projectprincipes)
2. Bekijk `02-specify.md` (feature specificatie)
3. Bestudeer `03-plans.md` (implementatieplan)

**Implementatie bouwen:**

1. Configureer API keys in `script.js`
2. Open de applicatie in je browser

## 🛠️ Technische Principes

**Browser-Only Architectuur:**

- Geen backend servers
- Geen build tools of frameworks
- Geen npm dependencies
- Direct te openen in browser

**API Integratie:**

- REST API calls via Fetch API
- Query parameter en Bearer token authenticatie
- Error handling voor alle status codes
- CORS-aware development

**State Management:**

- localStorage voor persistentie
- JSON serialization
- Graceful fallbacks

## 🎓 Leermateriaal

Tijdens de workshop behandelen we:

- Specificeren van features met Speckit
- API configuratie en authenticatie
- OpenAI-compatible LLM integratie
- Debugging met browser DevTools
- Werken binnen API constraints (free tiers)

## ⚠️ Workshop Context

**Belangrijk:**

- API keys in client code zijn ALLEEN acceptabel voor workshop/demo doeleinden
- Productie-applicaties vereisen backend proxy voor API calls
- Free tier API's hebben rate limits en feature beperkingen
- Code is geoptimaliseerd voor leesbaarheid, niet voor productie

## 📝 Licentie

Dit is een educatief workshop project voor leerdoeleinden.
