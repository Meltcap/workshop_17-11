# Finnhub Stock Dashboard Workshop

Een educatief browser-only project voor workshops over beursinformatie met AI-ondersteuning.

## 🎯 Projectdoel

Deze single-page web applicatie demonstreert:
- Integratie met externe APIs (Finnhub voor real-time quotes, LiteLLM voor AI-tekstgeneratie)
- Gebruik van moderne browser APIs (Fetch, localStorage)
- Verantwoord gebruik van AI voor educatieve doeleinden

**⚠️ Beperking:** Het gratis Finnhub API plan ondersteunt geen historische data. Alleen real-time quote data is beschikbaar.

## ✅ Implementatie Status

**GEÏMPLEMENTEERD** - Kernfunctionaliteit beschikbaar (beperkt tot gratis API tier)

- ✅ **HTML Structuur** - Complete interface met alle secties
- ✅ **CSS Styling** - Moderne, responsive styling met Dutch UI
- ✅ **JavaScript Logica** - Alle features geïmplementeerd
- ✅ **Finnhub Integratie** - Quote endpoint (real-time data)
- ❌ **Candle Endpoint** - Niet beschikbaar op gratis tier
- ❌ **Chart.js Visualisatie** - Niet mogelijk zonder historische data
- ✅ **LiteLLM AI Integratie** - Educatieve adviezen met disclaimers (gebaseerd op dagelijkse verandering)
- ✅ **localStorage Persistentie** - State management
- ✅ **Error Handling** - Nederlandse foutmeldingen

## 📋 Vereisten

- Moderne webbrowser (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- Finnhub API-sleutel: [https://finnhub.io](https://finnhub.io) (gratis)
- LiteLLM API-sleutel: Toegang tot OpenAI-compatible LiteLLM proxy (`https://llmproxy.fd.nl`)

## 🚀 Snelstart (5 minuten)

### Stap 1: API-sleutels Verkrijgen

**Finnhub:**
1. Ga naar https://finnhub.io
2. Klik "Get free API key"
3. Maak een account aan
4. Kopieer je API-sleutel

**LiteLLM:**
1. Vraag toegang aan tot de FD LiteLLM proxy
2. Verkrijg je API-sleutel van je beheerder
3. Controleer dat CORS is ingeschakeld voor browser-toegang

### Stap 2: API-sleutels Configureren

1. Open `script.js` in een teksteditor
2. Vind regels 3-4:
```javascript
const FINNHUB_API_KEY = 'YOUR_FINNHUB_KEY_HERE';
const LITELLM_API_KEY = 'YOUR_LITELLM_KEY_HERE';
```
3. Vervang `YOUR_FINNHUB_KEY_HERE` met je Finnhub API-sleutel
4. Vervang `YOUR_LITELLM_KEY_HERE` met je LiteLLM API-sleutel
5. **Bewaar het bestand**

**Configuratie details:**
- **LiteLLM Base URL:** `https://llmproxy.fd.nl/v1`
- **Model:** `Azure/gpt-5-mini`
- **Authenticatie:** Bearer token via Authorization header
- **Formaat:** OpenAI-compatible (chat completions)

### Stap 3: Applicatie Openen

1. Zoek `index.html` in je bestandssysteem
2. **Dubbelklik** om te openen in je browser
3. De applicatie start direct!

### Stap 4: Testen

1. **Klik op APPLE** → wacht 2-3 seconden
2. Je ziet: huidige koers en dagelijkse verandering
3. **Klik op "Genereer advies"** → wacht 3-5 seconden
4. Je ziet: AI-advies met disclaimer (gebaseerd op dagelijkse prijsverandering)
5. **Ververs de pagina** → laatste ticker laadt automatisch
6. **Klik "Wis gegevens"** → alles wordt gereset

✅ **Klaar voor gebruik!**

**💡 Tip:** Gebruik US stock tickers (AAPL, MSFT, GOOGL, etc.) voor beste resultaten met het gratis API plan.

**⚠️ Belangrijk:** API-sleutels in client-side code zijn ALLEEN acceptabel voor workshop/demo doeleinden. Gebruik in productie een backend proxy.

## 🏗️ Architectuur

### Bestanden

- `index.html` - Hoofdpagina
- `style.css` - Styling
- `script.js` - Alle JavaScript logica

### Externe Afhankelijkheden

- **Finnhub REST API** - Real-time aandelenkoersen (gratis tier: alleen quote endpoint)
- **LiteLLM Proxy** - OpenAI-compatible AI-tekstgeneratie (via `https://llmproxy.fd.nl`)

**Opmerking:** Chart.js CDN is nog geladen maar niet actief gebruikt vanwege API-beperkingen.

### Geen Backend

Dit project draait volledig in de browser. Geen Node.js, geen build tools, geen frameworks.

## 📚 Documentatie

Het project volgt de **Speckit** documentatiestandaard. Alle architectuurbeslissingen zijn gedocumenteerd in de projectconstitutie:

**→ [Projectconstitutie](.specify/memory/constitution.md)**

De constitutie definieert 7 niet-onderhandelbare principes:

1. **Browser-Only Architectuur** - Geen backend of build tools
2. **Minimale Tech Stack** - Alleen HTML/CSS/JS + goedgekeurde CDN libraries
3. **Radicale Eenvoud** - Expliciete, leesbare code
4. **Nederlands-First UX** - All UI-tekst in het Nederlands
5. **Lichtgewicht State Management** - Eenvoudig localStorage gebruik
6. **Verantwoorde AI-Integratie** - Educatief, met disclaimers
7. **Handmatige Validatie** - Praktische tests voor workshop context

### Aanvullende Documentatie

- [Specify Systeem Uitleg](.specify/README.md)
- Templates voor specificaties, plannen en taken in `.specify/templates/`

## 🔧 Ontwikkeling

### Nieuwe Features Toevoegen

1. Maak een specificatie met `.specify/templates/spec-template.md`
2. Valideer afstemming met de constitutie
3. Maak een implementatieplan met `.specify/templates/plan-template.md`
4. Breek af in taken met `.specify/templates/tasks-template.md`

### Testen

Handmatige validatie van:
- ✅ Aandeel selecteren → quote data ophalen → prijsinfo weergeven
- ✅ AI-advies genereren (op basis van dagelijkse verandering) → weergeven met disclaimer
- ✅ localStorage persistentie → reset functionaliteit
- ✅ Foutstatussen en Nederlandse UI-tekst

**Beperkingen in gratis tier:**
- ❌ Geen historische candle data (30-dagen grafiek niet beschikbaar)
- ✅ Wel real-time quote data (huidige prijs, dagelijkse verandering)

## 📝 Licentie

Dit project is bedoeld voor educatieve workshop doeleinden.

## ⚠️ Disclaimers

- **Geen Financieel Advies:** Alle AI-gegenereerde inzichten zijn uitsluitend voor educatieve doeleinden
- **Geen Productie-Gereed:** API-sleutels in client code, geen authenticatie, geen schaalbare architectuur
- **Workshop Context:** Intentionele afwegingen voor leerdoelen boven productiekwaliteit

## 🤝 Workshop Gebruik

Dit project is ontworpen voor 2-3 uur durende workshops over:
- Werken met REST APIs in vanilla JavaScript
- Verantwoorde AI-integratie
- Moderne browser APIs (Fetch, localStorage)
- Omgaan met API-beperkingen en error handling

Deelnemers kunnen direct beginnen zonder setup complexiteit.

**Workshop Focus:** Door de beperking tot real-time data (gratis API tier) is dit een perfecte case study voor:
- Werken binnen API constraints
- Aanpassen van features aan beschikbare resources
- Educatief gebruik van AI met beperkte input data
