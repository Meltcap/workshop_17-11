// ⚠️ WORKSHOP ONLY: Never expose API keys in production client code!
// In production, use a backend proxy to securely call external APIs.
const FINNHUB_API_KEY = 'd4bj4vhr01qoua301p80d4bj4vhr01qoua301p8g'; // Get free key at: https://finnhub.io
const LITELLM_API_KEY = 'sk-aDSpZRzGIs59TesVwhkG0A';   // Configure your LiteLLM/OpenAI-compatible API key

// Configuration Toggles
const USE_US_TICKERS = true; // Toggle between US and Dutch tickers
const USE_SANDBOX = false;   // For testing with sandbox API (if applicable)

// API Endpoints
const FINNHUB_BASE_URL = USE_SANDBOX 
    ? 'https://finnhub.io/api/v1' // Sandbox URL (if account supports it)
    : 'https://finnhub.io/api/v1';
const LITELLM_BASE_URL = 'https://llmproxy.fd.nl';
const LITELLM_MODEL = 'Azure/gpt-5-mini';
const LITELLM_PATH = '/v1/chat/completions';

// US Stock Tickers (free tier has full access)
const US_TICKERS = [
    { symbol: 'AAPL', display: 'APPLE' },
    { symbol: 'MSFT', display: 'MICROSOFT' },
    { symbol: 'GOOGL', display: 'GOOGLE' },
    { symbol: 'TSLA', display: 'TESLA' },
    { symbol: 'NVDA', display: 'NVIDIA' },
    { symbol: 'META', display: 'META' },
    { symbol: 'NFLX', display: 'NETFLIX' },
    { symbol: 'AMD', display: 'AMD' },
    { symbol: 'INTC', display: 'INTEL' },
    { symbol: 'AMZN', display: 'AMAZON' }
];

// Dutch Stock Tickers (may require paid Finnhub plan for non-US markets)
const NL_TICKERS = [
    { symbol: 'ASML.AS', display: 'ASML' },
    { symbol: 'ADYEN.AS', display: 'ADYEN' },
    { symbol: 'ING.AS', display: 'ING' },
    { symbol: 'UNA.AS', display: 'UNA' },
    { symbol: 'AD.AS', display: 'AD' },
    { symbol: 'HEIA.AS', display: 'HEIA' },
    { symbol: 'PHIA.AS', display: 'PHIA' },
    { symbol: 'RAND.AS', display: 'RAND' },
    { symbol: 'KPN.AS', display: 'KPN' },
    { symbol: 'DSM.AS', display: 'DSM' }
];

// Active ticker set based on configuration
const DUTCH_TICKERS = USE_US_TICKERS ? US_TICKERS : NL_TICKERS;

// Global state
let appState = {
    version: '1.0',
    lastTicker: null,
    adviceHistory: [],
    lastUpdated: null,
    currentQuoteData: null,
    currentCandleData: null
};

let chartInstance = null;

// ============================================================================
// INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Stock Dashboard initializing...');
    initApp();
});

async function initApp() {
    // Check API keys
    if (FINNHUB_API_KEY === 'YOUR_FINNHUB_KEY_HERE' || LITELLM_API_KEY === 'YOUR_LITELLM_KEY_HERE') {
        showNotice('⚠️ API-sleutels zijn nog niet geconfigureerd. Pas de sleutels aan in script.js.');
    } else {
        // Test API key health
        await testFinnhubKey();
        await testLiteLLMKey();
    }
    
    // Load saved state
    appState = loadStoredState();
    console.log('📦 Loaded state:', appState);
    
    // Setup event listeners
    setupEventListeners();
    
    // Auto-load last ticker if available
    if (appState.lastTicker) {
        console.log('🔄 Auto-loading last ticker:', appState.lastTicker);
        setTimeout(() => {
            selectTicker(appState.lastTicker);
        }, 500);
    }
    
    // Display advice history if available
    if (appState.adviceHistory && appState.adviceHistory.length > 0) {
        displayAdviceHistory();
    }
}

function setupEventListeners() {
    // Predefined ticker buttons
    document.querySelectorAll('.ticker-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const ticker = e.target.getAttribute('data-ticker');
            selectTicker(ticker);
        });
    });
    
    // Manual ticker input
    const searchBtn = document.getElementById('search-btn');
    const tickerInput = document.getElementById('ticker-input');
    
    searchBtn.addEventListener('click', () => {
        const ticker = tickerInput.value.trim().toUpperCase();
        if (ticker) {
            selectTicker(ticker);
        }
    });
    
    tickerInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const ticker = tickerInput.value.trim().toUpperCase();
            if (ticker) {
                selectTicker(ticker);
            }
        }
    });
    
    // Generate advice button
    document.getElementById('generate-advice-btn').addEventListener('click', generateAdvice);
    
    // Reset button
    document.getElementById('reset-btn').addEventListener('click', resetApp);
}

// ============================================================================
// STATE MANAGEMENT
// ============================================================================

function getEmptyState() {
    return {
        version: '1.0',
        lastTicker: null,
        adviceHistory: [],
        lastUpdated: new Date().toISOString()
    };
}

function loadStoredState() {
    try {
        // Check if localStorage is available
        if (typeof Storage === 'undefined') {
            showNotice('Gegevens worden niet opgeslagen in deze sessie (localStorage niet beschikbaar).');
            return getEmptyState();
        }
        
        const stored = localStorage.getItem('stockDashboardState');
        if (!stored) {
            console.log('No stored state found, using empty state');
            return getEmptyState();
        }
        
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
        if (typeof Storage === 'undefined') {
            return; // Silently fail if localStorage unavailable
        }
        
        state.lastUpdated = new Date().toISOString();
        localStorage.setItem('stockDashboardState', JSON.stringify(state));
        console.log('💾 State saved');
    } catch (error) {
        if (error.name === 'QuotaExceededError') {
            showError('Opslag vol. Gegevens kunnen niet worden opgeslagen.', 'storage-notice');
        } else {
            console.error('Failed to save state:', error);
        }
    }
}

function addToHistory(entry) {
    // Add to front of array (newest first)
    appState.adviceHistory.unshift(entry);
    
    // Keep only last 10 entries
    if (appState.adviceHistory.length > 10) {
        appState.adviceHistory = appState.adviceHistory.slice(0, 10);
    }
    
    saveState(appState);
    displayAdviceHistory();
}

function resetApp() {
    const confirmed = confirm('Weet je zeker dat je alle gegevens wilt wissen?');
    if (!confirmed) return;
    
    try {
        // Clear localStorage
        if (typeof Storage !== 'undefined') {
            localStorage.removeItem('stockDashboardState');
        }
        
        // Reset global state
        appState = getEmptyState();
        appState.currentQuoteData = null;
        appState.currentCandleData = null;
        
        // Reset UI
        document.getElementById('market-data').classList.add('hidden');
        document.getElementById('ai-advice').classList.add('hidden');
        document.getElementById('advice-history').classList.add('hidden');
        document.getElementById('ticker-input').value = '';
        document.getElementById('selection-error').classList.add('hidden');
        document.getElementById('advice-error').classList.add('hidden');
        
        // Remove selected state from buttons
        document.querySelectorAll('.ticker-btn.selected').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        // Show confirmation
        showNotice('✅ Alle gegevens gewist');
        
        // Hide notice after 3 seconds
        setTimeout(() => {
            document.getElementById('storage-notice').classList.add('hidden');
        }, 3000);
        
        console.log('🗑️ App reset complete');
    } catch (error) {
        console.error('Reset failed:', error);
        showError('Fout bij het wissen van gegevens', 'selection-error');
    }
}

// ============================================================================
// TICKER SELECTION
// ============================================================================

async function selectTicker(ticker) {
    console.log('📊 Selecting ticker:', ticker);
    
    // Validate ticker
    const validation = validateTicker(ticker);
    if (!validation.valid) {
        showError(validation.error, 'selection-error');
        return;
    }
    
    const normalizedTicker = validation.value;
    
    // Update UI state
    showLoading('selection');
    hideError('selection-error');
    document.getElementById('generate-advice-btn').disabled = true;
    
    // Highlight selected button
    document.querySelectorAll('.ticker-btn').forEach(btn => {
        btn.classList.remove('selected');
        if (btn.getAttribute('data-ticker') === normalizedTicker) {
            btn.classList.add('selected');
        }
    });
    
    try {
        // Fetch only quote data (candles not available on free tier)
        const quoteData = await fetchQuote(normalizedTicker);
        
        // Store data
        appState.currentQuoteData = quoteData;
        appState.currentCandleData = null; // Not available
        appState.lastTicker = normalizedTicker;
        saveState(appState);
        
        // Display data
        displayMarketData(quoteData);
        
        // Show sections (chart hidden due to API limitations)
        document.getElementById('market-data').classList.remove('hidden');
        document.getElementById('ai-advice').classList.remove('hidden');
        
        // Enable advice button
        document.getElementById('generate-advice-btn').disabled = false;
        
        hideLoading('selection');
        console.log('✅ Data loaded successfully (quote only - chart data not available on free tier)');
    } catch (error) {
        console.error('Error fetching data:', error);
        showError(error.message, 'selection-error');
        hideLoading('selection');
    }
}

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

// ============================================================================
// FINNHUB API INTEGRATION
// ============================================================================

async function fetchQuote(symbol) {
    const url = `${FINNHUB_BASE_URL}/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`;
    
    console.log(`[Finnhub Quote] Request: ${symbol}`);
    console.log(`[Finnhub Quote] URL: ${url.replace(FINNHUB_API_KEY, 'API_KEY_HIDDEN')}`);
    console.log(`[Finnhub Quote] Using query parameter authentication`);
    
    try {
        const response = await fetch(url);
        
        console.log(`[Finnhub Quote] Status: ${response.status}`);
        console.log(`[Finnhub Quote] Status Text: ${response.statusText}`);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`[Finnhub Quote] Error Response:`, errorText);
            console.error(`[Finnhub Quote] Full URL for testing:`, url.substring(0, 50) + '...');
            throw new Error(getFinnhubErrorMessage(response.status) + ` (Status: ${response.status})`);
        }
        
        const data = await response.json();
        console.log(`[Finnhub Quote] Response Data:`, data);
        
        // Validate response
        if (!validateQuoteResponse(data)) {
            console.error(`[Finnhub Quote] Validation failed for data:`, data);
            throw new Error('Ongeldige respons van Finnhub. Mogelijk is de ticker niet beschikbaar.');
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
    } catch (error) {
        if (error.message.includes('Failed to fetch')) {
            throw new Error('Netwerkfout. Controleer je internetverbinding.');
        }
        throw error;
    }
}

async function fetchCandles(symbol) {
    const today = Math.floor(Date.now() / 1000);
    const thirtyDaysAgo = today - (30 * 24 * 60 * 60);
    
    const url = `${FINNHUB_BASE_URL}/stock/candle?symbol=${symbol}&resolution=D&from=${thirtyDaysAgo}&to=${today}&token=${FINNHUB_API_KEY}`;
    
    console.log(`[Finnhub Candle] Request: ${symbol}`);
    console.log(`[Finnhub Candle] Date range: ${new Date(thirtyDaysAgo * 1000).toISOString()} to ${new Date(today * 1000).toISOString()}`);
    console.log(`[Finnhub Candle] Using query parameter authentication`);
    
    try {
        const response = await fetch(url);
        
        console.log(`[Finnhub Candle] Status: ${response.status}`);
        console.log(`[Finnhub Candle] Status Text: ${response.statusText}`);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`[Finnhub Candle] Error Response:`, errorText);
            throw new Error(getFinnhubErrorMessage(response.status) + ` (Status: ${response.status})`);
        }
        
        const data = await response.json();
        console.log(`[Finnhub Candle] Response Data:`, data);
        console.log(`[Finnhub Candle] Data points received:`, data.c ? data.c.length : 0);
        
        // Check for no data
        if (data.s === 'no_data' || !data.c || data.c.length < 10) {
            throw new Error('Onvoldoende historische data beschikbaar voor deze ticker.');
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
    } catch (error) {
        if (error.message.includes('Failed to fetch')) {
            throw new Error('Netwerkfout. Controleer je internetverbinding.');
        }
        throw error;
    }
}

function validateQuoteResponse(data) {
    if (!data || typeof data !== 'object') return false;
    if (typeof data.c !== 'number' || data.c <= 0) return false;
    if (typeof data.d !== 'number' || !isFinite(data.d)) return false;
    if (typeof data.dp !== 'number' || !isFinite(data.dp)) return false;
    return true;
}

function getFinnhubErrorMessage(status) {
    switch (status) {
        case 401:
            return 'Finnhub API-sleutel is ongeldig. Controleer je configuratie.';
        case 403:
            return 'Geen toegang tot Finnhub API. Verifieer je email adres op finnhub.io en wacht 5 minuten. Gratis plan heeft mogelijk geen toegang tot internationale markten - test met AAPL/MSFT.';
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

// Test Finnhub API key health
async function testFinnhubKey() {
    console.log('🔍 Testing Finnhub API key...');
    
    const testUrl = `${FINNHUB_BASE_URL}/quote?symbol=AAPL&token=${FINNHUB_API_KEY}`;
    
    try {
        const response = await fetch(testUrl);
        
        console.log(`[API Key Test] Status: ${response.status}`);
        
        if (response.status === 200) {
            const data = await response.json();
            console.log('✅ Finnhub API key is working!');
            console.log('[API Key Test] Sample response:', data);
            return true;
        } else if (response.status === 403) {
            console.error('❌ 403 Forbidden: API key has no access');
            console.error('[API Key Test] Mogelijke oorzaken:');
            console.error('  1. Email adres niet geverifieerd op finnhub.io');
            console.error('  2. Account is pas aangemaakt (wacht 5-10 minuten)');
            console.error('  3. Gratis plan heeft geen toegang tot bepaalde markten');
            console.error('  4. API key is verlopen of gedeactiveerd');
            showNotice('⚠️ Finnhub API key werkt niet (403). Verifieer je email op finnhub.io en wacht 5 minuten. Test met US aandelen (AAPL, MSFT).');
            return false;
        } else if (response.status === 401) {
            console.error('❌ 401 Unauthorized: API key is invalid');
            showNotice('⚠️ Finnhub API key is ongeldig. Check de key in script.js.');
            return false;
        } else {
            console.warn(`⚠️ Unexpected status: ${response.status}`);
            const errorText = await response.text();
            console.error('[API Key Test] Response:', errorText);
            return false;
        }
    } catch (error) {
        console.error('❌ API key test failed:', error);
        console.error('[API Key Test] Mogelijk een netwerkprobleem');
        return false;
    }
}

// Test LiteLLM API key health
async function testLiteLLMKey() {
    console.log('🔍 Testing LiteLLM API key...');
    
    const testUrl = `${LITELLM_BASE_URL}${LITELLM_PATH}`;
    const testBody = {
        model: LITELLM_MODEL,
        messages: [{ role: 'user', content: 'ok' }],
        max_tokens: 5
    };
    
    try {
        const response = await fetch(testUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${LITELLM_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(testBody)
        });
        
        console.log(`[LiteLLM Key Test] Status: ${response.status}`);
        
        if (response.status === 200) {
            const data = await response.json();
            console.log('✅ LiteLLM API key is working!');
            console.log('[LiteLLM Key Test] Sample response:', data);
            return true;
        } else if (response.status === 401) {
            console.error('❌ 401 Unauthorized: LiteLLM API key is invalid');
            console.error('[LiteLLM Key Test] Check LITELLM_API_KEY in script.js');
            showNotice('⚠️ LiteLLM API key is ongeldig. Check de key in script.js.');
            return false;
        } else if (response.status === 403) {
            console.error('❌ 403 Forbidden: No access to LiteLLM endpoint');
            console.error('[LiteLLM Key Test] Mogelijke oorzaken:');
            console.error('  1. CORS niet correct geconfigureerd op endpoint');
            console.error('  2. API key heeft geen toegang tot model');
            console.error('  3. IP-adres geblokkeerd');
            showNotice('⚠️ Geen toegang tot LiteLLM endpoint. Controleer CORS en permissies.');
            return false;
        } else {
            console.warn(`⚠️ Unexpected status: ${response.status}`);
            const errorText = await response.text();
            console.error('[LiteLLM Key Test] Response:', errorText);
            return false;
        }
    } catch (error) {
        console.error('❌ LiteLLM key test failed:', error);
        console.error('[LiteLLM Key Test] Mogelijk een netwerkprobleem of CORS issue');
        if (error.message.includes('Failed to fetch')) {
            showNotice('⚠️ Kan LiteLLM endpoint niet bereiken. Controleer URL en CORS-configuratie.');
        }
        return false;
    }
}

// ============================================================================
// MARKET DATA DISPLAY
// ============================================================================

function displayMarketData(quoteData) {
    // Update ticker
    document.getElementById('current-ticker').textContent = quoteData.displaySymbol;
    
    // Update current price
    document.getElementById('current-price').textContent = formatPrice(quoteData.currentPrice);
    
    // Update change
    const changeElement = document.getElementById('price-change');
    const changeText = formatChange(quoteData.change, quoteData.changePercent);
    changeElement.textContent = changeText;
    
    // Apply color coding
    changeElement.classList.remove('positive', 'negative');
    if (quoteData.change > 0) {
        changeElement.classList.add('positive');
    } else if (quoteData.change < 0) {
        changeElement.classList.add('negative');
    }
}

function formatPrice(value) {
    return `€${value.toFixed(2)}`;
}

function formatChange(change, percent) {
    const sign = change >= 0 ? '+' : '';
    const arrow = change >= 0 ? '↑' : '↓';
    return `${sign}€${change.toFixed(2)} (${sign}${percent.toFixed(2)}%) ${arrow}`;
}

// ============================================================================
// CHART RENDERING
// ============================================================================

function renderChart(candleData) {
    const canvas = document.getElementById('price-chart');
    const ctx = canvas.getContext('2d');
    
    // Destroy previous chart instance
    if (chartInstance) {
        chartInstance.destroy();
    }
    
    // Prepare data
    const labels = candleData.timestamps.map(t => formatChartDate(t));
    const prices = candleData.close;
    
    // Create chart
    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Slotkoers',
                data: prices,
                borderColor: '#007bff',
                backgroundColor: 'rgba(0, 123, 255, 0.1)',
                borderWidth: 2,
                tension: 0.1,
                pointRadius: 3,
                pointHoverRadius: 5,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                title: {
                    display: false
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
                    title: {
                        display: true,
                        text: 'Datum'
                    }
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Prijs (€)'
                    },
                    beginAtZero: false,
                    ticks: {
                        callback: (value) => '€' + value.toFixed(2)
                    }
                }
            }
        }
    });
    
    console.log('📈 Chart rendered');
}

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

// ============================================================================
// LITELLM AI INTEGRATION (OpenAI-compatible)
// ============================================================================

async function generateAdvice() {
    if (!appState.currentQuoteData) {
        showError('Geen marktdata beschikbaar. Selecteer eerst een ticker.', 'advice-error');
        return;
    }
    
    console.log('🤖 Generating AI advice...');
    
    // Update UI
    showLoading('advice');
    hideError('advice-error');
    document.getElementById('generate-advice-btn').disabled = true;
    document.getElementById('advice-response').classList.add('hidden');
    document.getElementById('advice-disclaimer').classList.add('hidden');
    
    try {
        // Use current quote data only (no historical data available)
        const quoteData = appState.currentQuoteData;
        const percentageChange = quoteData.changePercent;
        
        // Determine trend description from daily change
        let trendDescription;
        if (percentageChange > 2) {
            trendDescription = `stijgend (huidige prijs: €${quoteData.currentPrice.toFixed(2)}, +${percentageChange.toFixed(2)}% vandaag)`;
        } else if (percentageChange < -2) {
            trendDescription = `dalend (huidige prijs: €${quoteData.currentPrice.toFixed(2)}, ${percentageChange.toFixed(2)}% vandaag)`;
        } else {
            trendDescription = `stabiel (huidige prijs: €${quoteData.currentPrice.toFixed(2)}, ${percentageChange >= 0 ? '+' : ''}${percentageChange.toFixed(2)}% vandaag)`;
        }
        
        // Build prompt
        const prompt = buildPrompt(
            appState.currentQuoteData.displaySymbol,
            trendDescription,
            percentageChange
        );
        
        // Call LiteLLM API (OpenAI-compatible)
        const url = `${LITELLM_BASE_URL}${LITELLM_PATH}`;
        
        const requestBody = {
            model: LITELLM_MODEL,
            messages: [
                {
                    role: 'system',
                    content: 'Je bent een educatieve financiële assistent. Je geeft GEEN aankoop- of verkoopadvies. Alle informatie is uitsluitend voor educatieve doeleinden.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            //temperature: 0.7,
            //max_tokens: 500,
            //top_p: 0.9,
            stream: false
        };
        
        console.log('[LiteLLM] Request:', { prompt: prompt.substring(0, 100) + '...' });
        
        // Add timeout (10 seconds)
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${LITELLM_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody),
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        console.log(`[LiteLLM] Status: ${response.status}`);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('[LiteLLM] Error:', errorText);
            throw new Error(getLiteLLMErrorMessage(response.status));
        }
        
        const data = await response.json();
        console.log('[LiteLLM] Response:', data);
        
        // Validate response structure (OpenAI format)
        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
            throw new Error('Ongeldige respons van AI-service');
        }
        
        const adviceText = data.choices[0].message.content?.trim();
        
        // Derive sentiment
        const sentiment = deriveSentiment(percentageChange, adviceText);
        
        // Display advice
        displayAdvice(adviceText);
        
        // Add to history
        const entry = {
            id: `${Date.now()}-${appState.currentQuoteData.symbol}`,
            symbol: appState.currentQuoteData.symbol,
            displaySymbol: appState.currentQuoteData.displaySymbol,
            timestamp: new Date().toISOString(),
            advice: adviceText,
            adviceSnippet: adviceText.substring(0, 100) + '...',
            summaryLabel: sentiment,
            priceChange: percentageChange,
            trendDescription: trendDescription
        };
        
        addToHistory(entry);
        
        hideLoading('advice');
        document.getElementById('generate-advice-btn').disabled = false;
        
        console.log('✅ AI advice generated');
    } catch (error) {
        console.error('Error generating advice:', error);
        
        if (error.name === 'AbortError') {
            showError('AI-verzoek duurt te lang. Probeer opnieuw.', 'advice-error');
        } else if (error.message.includes('Failed to fetch')) {
            showError('Netwerkfout. Controleer je internetverbinding.', 'advice-error');
        } else {
            showError(error.message, 'advice-error');
        }
        
        hideLoading('advice');
        document.getElementById('generate-advice-btn').disabled = false;
    }
}

function buildPrompt(symbol, trendDescription, percentageChange) {
    return `Je bent een educatieve financiële assistent die helpt bij het begrijpen van aandelenmarkt bewegingen. Je geeft GEEN aankoop- of verkoopadvies.

Analyseer de volgende informatie:
• Ticker: ${symbol}
• Trend: ${trendDescription}
• Prijsverandering (vandaag): ${percentageChange.toFixed(1)}%

Geef een educatief inzicht in maximaal 150 woorden dat:
1. Uitlegt wat het huidige prijsgedrag betekent (feitelijk, neutraal)
2. Mogelijke risicofactoren benoemt die beleggers moeten overwegen
3. Mogelijke kansen beschrijft zonder specifieke aanbevelingen

Gebruik eenvoudige taal geschikt voor beginners. Vermijd jargon waar mogelijk.
Gebruik GEEN imperatieve zinnen zoals "koop", "verkoop", "investeer nu".

Begin je antwoord direct met de analyse, geen inleiding nodig.`;
}

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
    return percentageChange > 0 ? 'neutraal' : 'neutraal';
}

function displayAdvice(text) {
    const responseElement = document.getElementById('advice-response');
    responseElement.textContent = text;
    responseElement.classList.remove('hidden');
    
    document.getElementById('advice-disclaimer').classList.remove('hidden');
}

function getLiteLLMErrorMessage(status) {
    switch (status) {
        case 400:
            return 'AI-verzoek mislukt. Controleer de configuratie.';
        case 401:
            return 'LiteLLM API-sleutel is ongeldig. Controleer je configuratie.';
        case 403:
            return 'Geen toegang tot LiteLLM endpoint. Controleer permissies.';
        case 429:
            return 'Te veel verzoeken. Wacht even en probeer opnieuw.';
        case 500:
        case 502:
        case 503:
        case 504:
            return 'AI-service tijdelijk niet beschikbaar. Probeer het later opnieuw.';
        default:
            return 'AI-advies kan niet worden gegenereerd. Probeer opnieuw.';
    }
}

// ============================================================================
// ADVICE HISTORY DISPLAY
// ============================================================================

function displayAdviceHistory() {
    if (!appState.adviceHistory || appState.adviceHistory.length === 0) {
        document.getElementById('advice-history').classList.add('hidden');
        return;
    }
    
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = '';
    
    appState.adviceHistory.forEach(entry => {
        const item = document.createElement('div');
        item.className = `history-item ${entry.summaryLabel}`;
        
        const timestamp = new Date(entry.timestamp);
        const formattedDate = `${timestamp.getDate()}-${timestamp.getMonth() + 1}-${timestamp.getFullYear()} ${timestamp.getHours()}:${String(timestamp.getMinutes()).padStart(2, '0')}`;
        
        item.innerHTML = `
            <div class="history-header">
                <span class="history-ticker">${entry.displaySymbol}</span>
                <span class="history-timestamp">${formattedDate}</span>
            </div>
            <span class="history-label ${entry.summaryLabel}">${entry.summaryLabel}</span>
            <div class="history-snippet">${entry.adviceSnippet}</div>
        `;
        
        historyList.appendChild(item);
    });
    
    document.getElementById('advice-history').classList.remove('hidden');
}

// ============================================================================
// UI HELPERS
// ============================================================================

function showLoading(section) {
    if (section === 'selection') {
        document.getElementById('selection-loading').classList.remove('hidden');
    } else if (section === 'advice') {
        document.getElementById('advice-loading').classList.remove('hidden');
    }
}

function hideLoading(section) {
    if (section === 'selection') {
        document.getElementById('selection-loading').classList.add('hidden');
    } else if (section === 'advice') {
        document.getElementById('advice-loading').classList.add('hidden');
    }
}

function showError(message, elementId) {
    const errorElement = document.getElementById(elementId);
    errorElement.textContent = message;
    errorElement.classList.remove('hidden');
    console.error('Error:', message);
}

function hideError(elementId) {
    document.getElementById(elementId).classList.add('hidden');
}

function showNotice(message) {
    const noticeElement = document.getElementById('storage-notice');
    noticeElement.textContent = message;
    noticeElement.classList.remove('hidden');
}

// ============================================================================
// INITIALIZATION COMPLETE
// ============================================================================

console.log('✅ Stock Dashboard initialized');

