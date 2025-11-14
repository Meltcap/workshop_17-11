# Quickstart Guide: AI-Enhanced Stock Dashboard

**Target Audience:** Workshop Participants & Developers  
**Time to Complete:** 5-10 minutes  
**Prerequisites:** Modern web browser, text editor

---

## Overview

This guide will get you up and running with the Stock Dashboard in under 10 minutes. By the end, you'll be able to:
- Select Dutch company stocks
- View current prices and 30-day charts
- Generate AI-powered educational insights

---

## Step 1: Get API Keys (5 minutes)

### Finnhub API Key

1. Go to **https://finnhub.io**
2. Click "Get free API key" or "Sign Up"
3. Create account with email
4. Copy your API key from the dashboard
5. Keep this tab open - you'll need it in Step 3

**Quota:** 60 calls/minute (plenty for workshop)

### Google Gemini API Key

1. Go to **https://aistudio.google.com**
2. Click "Get API key" (requires Google account)
3. Create new project (or use existing)
4. Click "Create API key"
5. Copy your API key
6. Keep this tab open - you'll need it in Step 3

**Quota:** 1,500 requests/day (sufficient for workshop)

---

## Step 2: Download Project Files

### Option A: Clone Repository (if using git)

```bash
git clone <repository-url>
cd Snake-game
git checkout 001-ai-stock-dashboard
```

### Option B: Download Files Directly

Download these three files to a folder on your computer:
- `index.html`
- `style.css`
- `script.js`

---

## Step 3: Add Your API Keys

1. Open `script.js` in your text editor
2. Find these lines at the top (lines 3-4):

```javascript
const FINNHUB_API_KEY = 'YOUR_FINNHUB_KEY_HERE';
const GEMINI_API_KEY = 'YOUR_GEMINI_KEY_HERE';
```

3. Replace `YOUR_FINNHUB_KEY_HERE` with your Finnhub API key
4. Replace `YOUR_GEMINI_KEY_HERE` with your Gemini API key
5. **Save the file**

**Example:**
```javascript
const FINNHUB_API_KEY = 'ct1a2b3c4d5e6f7g8h9i';
const GEMINI_API_KEY = 'AIzaSyABC123XYZ789...';
```

**⚠️ Important:** These keys are visible in the browser. This is acceptable for workshops but NOT for production applications.

---

## Step 4: Open in Browser

1. Locate `index.html` in your file system
2. **Double-click** to open in your default browser
   - Or right-click → Open With → Choose browser
3. The dashboard should load immediately

**Troubleshooting:**
- If page is blank, check browser console (F12) for errors
- If "API key invalid" errors appear, verify Step 3

---

## Step 5: Test the Dashboard

### Test 1: Select a Predefined Ticker

1. Click the **ASML** button
2. Wait 2-3 seconds
3. You should see:
   - Current price in EUR
   - Change amount and percentage (with color)
   - 30-day line chart
   - "Genereer advies" button appears

✅ **Success!** Price data loaded correctly.

### Test 2: Generate AI Advice

1. Click **Genereer advies** button
2. Wait 3-5 seconds
3. You should see:
   - Educational text about ASML
   - Mention of risks and opportunities
   - Disclaimer text at the bottom

✅ **Success!** AI integration working.

### Test 3: Manual Ticker Entry

1. Type **ING** in the input field
2. Click **Zoek** (or press Enter)
3. Data for ING should load

✅ **Success!** Manual ticker search working.

### Test 4: Persistence

1. Refresh the page (F5 or Cmd+R)
2. ING data should reload automatically

✅ **Success!** localStorage persistence working.

### Test 5: Reset Data

1. Click **Wis gegevens** button at bottom
2. All data should clear
3. Dashboard returns to initial state

✅ **Success!** Data reset working.

---

## Common Issues & Solutions

### Issue: "API-sleutel ongeldig" error

**Cause:** API key is incorrect or not set

**Solution:**
1. Double-check API key in `script.js`
2. Ensure no extra spaces before/after key
3. Verify key is valid by testing in API documentation

---

### Issue: "Ticker niet gevonden" for Dutch tickers

**Cause:** Ticker format may need exchange suffix

**Solution:**
- Dutch tickers need `.AS` suffix
- Try: `ASML.AS` instead of `ASML`
- Predefined buttons already include `.AS`

---

### Issue: Chart not rendering

**Cause:** Chart.js CDN failed to load

**Solution:**
1. Check internet connection
2. Open browser console (F12) for errors
3. Verify CDN link in `index.html`: `https://cdn.jsdelivr.net/npm/chart.js`

---

### Issue: Blank page on open

**Cause:** JavaScript error preventing load

**Solution:**
1. Open browser console (F12)
2. Check for syntax errors in `script.js`
3. Verify API keys are properly quoted strings

---

### Issue: "Te veel verzoeken" (Rate limit)

**Cause:** Exceeded Finnhub 60 calls/minute limit

**Solution:**
- Wait 60 seconds
- Avoid rapidly clicking multiple tickers
- Workshop instructors: provide backup API keys

---

### Issue: localStorage not persisting

**Cause:** Private browsing mode or storage disabled

**Solution:**
- App will show notice: "Gegevens worden niet opgeslagen"
- This is expected behavior, app still works
- Use normal browsing mode for persistence

---

## Next Steps

### For Workshop Participants

- Experiment with different tickers
- Compare AI insights for different stocks
- Note how trend affects sentiment
- Try invalid tickers to see error handling

### For Developers

- Read through `script.js` to understand API integration
- Explore browser DevTools:
  - Network tab: See API requests/responses
  - Console tab: Debug logs
  - Application tab: Inspect localStorage
- Modify prompt in `generateAdvice()` function
- Adjust chart colors/styles in `renderChart()`

---

## File Structure

```
project/
├── index.html          # Main HTML structure
├── style.css           # All styling
└── script.js           # All JavaScript logic
    ├── API keys (top of file)
    ├── Initialization functions
    ├── State management
    ├── Finnhub integration
    ├── Gemini integration
    ├── Chart rendering
    └── Event handlers
```

---

## Workshop Tips

### For Instructors

1. **Pre-Workshop:**
   - Test all API keys the day before
   - Prepare backup keys for large groups
   - Verify Chart.js CDN is accessible

2. **During Workshop:**
   - Demonstrate localStorage in DevTools
   - Show Network tab API calls
   - Live-code error handling examples
   - Explain why API keys in client code is workshop-only

3. **Common Questions:**
   - Q: "Why Dutch UI text?"
     - A: Target audience is Dutch speakers, reduces cognitive load
   - Q: "Can I use this in production?"
     - A: No, API keys must be hidden in backend
   - Q: "How do I deploy this?"
     - A: Any static file hosting (GitHub Pages, Netlify, etc.)

### For Participants

1. **Take Notes On:**
   - How Fetch API works
   - localStorage JSON structure
   - Chart.js configuration
   - Error handling patterns

2. **Experiment Ideas:**
   - Add new Dutch tickers to predefined list
   - Change chart colors/styling
   - Modify AI prompt for different tone
   - Add currency conversion feature

3. **Learning Resources:**
   - Finnhub API docs: https://finnhub.io/docs/api
   - Gemini API docs: https://ai.google.dev/gemini-api/docs
   - Chart.js docs: https://www.chartjs.org/docs
   - MDN Web APIs: https://developer.mozilla.org/en-US/docs/Web/API

---

## Advanced Configuration (Optional)

### Changing Predefined Tickers

Edit `script.js`, find the `DUTCH_TICKERS` array:

```javascript
const DUTCH_TICKERS = [
  { symbol: 'ASML.AS', display: 'ASML' },
  { symbol: 'ADYEN.AS', display: 'ADYEN' },
  // Add more here
];
```

### Adjusting Chart Time Range

Find `fetchCandles()` function, change this line:

```javascript
const thirtyDaysAgo = today - (30 * 24 * 60 * 60);
// Change 30 to different number of days
const ninetyDaysAgo = today - (90 * 24 * 60 * 60);
```

### Modifying AI Prompt

Find `buildPrompt()` function and edit the template string:

```javascript
function buildPrompt(symbol, trendDescription, percentageChange) {
  return `Your custom prompt here...`;
}
```

### Changing History Limit

Find `addToHistory()` function:

```javascript
if (state.adviceHistory.length > 10) {
  // Change 10 to different limit
  state.adviceHistory.pop();
}
```

---

## Security Reminders

⚠️ **This setup is for educational purposes only!**

**What's NOT production-safe:**
- API keys visible in client code
- No rate limiting enforcement
- No input sanitization beyond basic validation
- No authentication or user accounts

**For production applications, you MUST:**
- Use backend server to proxy API calls
- Store API keys in environment variables
- Implement rate limiting
- Add user authentication
- Sanitize all user inputs
- Use HTTPS for all requests

---

## Getting Help

**During Workshop:**
- Raise hand for instructor assistance
- Check console (F12) for error messages
- Ask neighbors if stuck

**After Workshop:**
- Review spec.md for detailed requirements
- Read API contract docs in contracts/
- Check research.md for technical decisions

**External Resources:**
- Finnhub support: support@finnhub.io
- Gemini API forum: https://discuss.ai.google.dev
- Browser console docs: https://developer.chrome.com/docs/devtools

---

## Success Checklist

Before moving on, verify:

- [ ] API keys obtained and added to script.js
- [ ] index.html opens in browser without errors
- [ ] Can select ASML and see price + chart
- [ ] "Genereer advies" button appears and works
- [ ] AI response displays with disclaimer
- [ ] Can enter custom ticker (e.g., "TSLA")
- [ ] Page refresh reloads last ticker
- [ ] "Wis gegevens" button clears all data
- [ ] All UI text is in Dutch
- [ ] Console shows debug logs (optional)

**If all checked:** ✅ You're ready for the workshop!

---

**Happy Coding! 🚀**

