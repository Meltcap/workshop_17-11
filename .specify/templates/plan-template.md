# Implementation Plan: [FEATURE_NAME]

**Specification:** [Link to spec file]  
**Target Date:** [YYYY-MM-DD]  
**Status:** [Planning | In Progress | Completed]  
**Constitution Version:** v[X.Y.Z]

## Constitution Check

Before proceeding, verify alignment with project principles:

- [ ] **Browser-Only Architecture:** No backend/build tools required
- [ ] **Minimal Tech Stack:** Uses only HTML/CSS/JS + whitelisted CDN libraries
- [ ] **Radical Simplicity:** Implementation approach is straightforward
- [ ] **Dutch-First UX:** All user-facing text planned in Dutch
- [ ] **Lightweight State:** localStorage usage is minimal and graceful
- [ ] **Responsible AI:** Disclaimers and educational framing included
- [ ] **Manual Validation:** Testing approach is practical for workshop context

## Implementation Steps

### 1. [Step Name]

**Files to modify:**
- `[filename]`

**Changes:**
- [Description of changes]

**Constitution alignment:**
- [Which principle(s) this addresses]

### 2. [Step Name]

**Files to modify:**
- `[filename]`

**Changes:**
- [Description of changes]

**Constitution alignment:**
- [Which principle(s) this addresses]

### 3. [Step Name]

**Files to modify:**
- `[filename]`

**Changes:**
- [Description of changes]

**Constitution alignment:**
- [Which principle(s) this addresses]

## API Keys Configuration

**Location:** Top of `script.js`

```javascript
const FINNHUB_API_KEY = 'YOUR_KEY_HERE'; // https://finnhub.io
const GEMINI_API_KEY = 'YOUR_KEY_HERE';  // https://aistudio.google.com
```

**⚠️ Workshop Warning:** API keys in client code are acceptable ONLY for educational demos. Production apps require backend proxies.

## Dependencies

### External Libraries (CDN)

- Chart.js: `https://cdn.jsdelivr.net/npm/chart.js`

### External APIs

- **Finnhub API:** https://finnhub.io/docs/api/introduction
  - Quote endpoint
  - Candle endpoint
- **Google Gemini API:** https://ai.google.dev/gemini-api/docs
  - Model: `gemini-2.5-flash`
  - REST API calls

## Error Handling Strategy

- **Finnhub errors:** [Approach]
- **Gemini errors:** [Approach]
- **localStorage unavailable:** [Approach]
- **Invalid user input:** [Approach]

## Manual Testing Plan

### Happy Path Validation

1. [Test step 1]
2. [Test step 2]
3. [Test step 3]

### Error States

1. [Error scenario 1] → [Expected behavior]
2. [Error scenario 2] → [Expected behavior]

### localStorage Persistence

1. [Persistence test 1]
2. [Persistence test 2]

## Rollout Checklist

- [ ] All files created/modified
- [ ] API keys documented (placeholders in code)
- [ ] Dutch UI text verified
- [ ] AI disclaimers present
- [ ] localStorage reset mechanism works
- [ ] Manual testing completed
- [ ] README updated with setup instructions

## Notes

[Any additional implementation notes, gotchas, or considerations]
