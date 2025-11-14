# Implementation Tasks: AI-Enhanced Browser-Based Stock Dashboard

**Feature:** AI-Enhanced Browser-Based Stock Dashboard  
**Specification:** [spec.md](./spec.md)  
**Plan:** [plan.md](./plan.md)  
**Status:** Ready for Implementation  
**Created:** 2025-11-14

---

## Overview

This document breaks down the implementation into actionable tasks organized by user story. Each user story phase represents a complete, independently testable increment of functionality.

**Task Format:**
- `- [ ] T### [P] [US#] Description in file.ext`
- `[P]` = Parallelizable (can work simultaneously with other [P] tasks)
- `[US#]` = User Story number (omitted for Setup/Foundational/Polish phases)

**Total Tasks:** 47  
**Parallelizable Tasks:** 23

---

## Implementation Strategy

### MVP Scope (Minimum Viable Product)
**User Stories 1 + 2** = Core functionality (ticker selection + market data display)
- Estimated effort: 10-12 hours
- Delivers: Working stock dashboard with live price data and charts
- Workshop-ready: Demonstrates API integration and Chart.js

### Full Feature Scope
**All 5 User Stories** = Complete educational workshop application
- Estimated effort: 19-24 hours
- Delivers: AI-enhanced dashboard with persistence and educational insights

---

## User Story Mapping

| Priority | User Story | Requirements | Independent Test Criteria |
|----------|------------|--------------|---------------------------|
| P1 | Stock Selection | Req 1-3 | Can select tickers via buttons or input, see loading states |
| P2 | Market Data Display | Req 4-7 | Can view current price, change, and 30-day chart for any ticker |
| P3 | AI Advice Generation | Req 8-12 | Can generate and view AI insights with disclaimer after data loads |
| P4 | Data Persistence | Req 13-15 | Last ticker and advice history persist across page refreshes |
| P5 | Data Reset | Req 16 | Can clear all data and return to empty state |

---

## Dependency Graph

```
Phase 1 (Setup)
    ↓
Phase 2 (Foundational)
    ↓
    ├─→ Phase 3: US1 (Stock Selection) ←─┐
    │           ↓                         │
    ├─→ Phase 4: US2 (Market Data) ←─────┤── Can develop in parallel
    │           ↓                         │
    ├─→ Phase 5: US3 (AI Advice) ←───────┤
    │           ↓                         │
    ├─→ Phase 6: US4 (Persistence) ←─────┘
    │           ↓
    └─→ Phase 7: US5 (Data Reset)
                ↓
Phase 8 (Polish & Cross-Cutting)
```

**Key Dependencies:**
- US2 depends on US1 (needs ticker to be selected before displaying data)
- US3 depends on US2 (needs market data loaded before generating advice)
- US4 can be developed partially in parallel (state structure defined early)
- US5 can be developed independently (just clears state)

---

## Phase 1: Setup & Project Initialization

**Goal:** Create project structure and configure dependencies

### Tasks

- [ ] T001 Create index.html with HTML5 boilerplate and Dutch lang attribute
- [ ] T002 Add Chart.js CDN link to index.html head section
- [ ] T003 Create style.css with CSS reset and basic typography
- [ ] T004 Create script.js with API key constants and workshop warning comment
- [ ] T005 Add link references to style.css and script.js in index.html
- [ ] T006 Verify files load in browser without console errors

**Completion Criteria:**
- [ ] Opening index.html shows blank page with no console errors
- [ ] DevTools Network tab shows Chart.js loaded successfully
- [ ] API key constants visible at top of script.js with ⚠️ warning

---

## Phase 2: Foundational Infrastructure

**Goal:** Implement shared utilities and state management foundation

### Tasks

- [ ] T007 [P] Define Dutch ticker constants array in script.js with .AS suffixes
- [ ] T008 [P] Implement getEmptyState() function returning initial AppState structure in script.js
- [ ] T009 [P] Implement loadStoredState() function with localStorage parsing in script.js
- [ ] T010 [P] Implement saveState() function with JSON stringification in script.js
- [ ] T011 [P] Implement showError() function for Dutch error message display in script.js
- [ ] T012 [P] Implement showLoading() and hideLoading() functions in script.js
- [ ] T013 [P] Create error message mapping object (Dutch translations for API status codes) in script.js
- [ ] T014 Implement initApp() function as DOMContentLoaded entry point in script.js
- [ ] T015 Add global state variable declaration in script.js

**Completion Criteria:**
- [ ] All utility functions defined and callable
- [ ] localStorage can be accessed without errors
- [ ] Error display mechanism works (manual test with showError())
- [ ] State structure matches data-model.md specification

---

## Phase 3: User Story 1 - Stock Selection (P1)

**Goal:** Users can select stock tickers via predefined buttons or manual input

**Requirements:** Req 1-3 (Predefined ticker selection, Manual input, Ticker validation)

**Independent Test Criteria:**
- [ ] Can click any predefined ticker button
- [ ] Can type ticker in input field and submit
- [ ] Loading indicator appears during selection
- [ ] Invalid ticker shows Dutch error message
- [ ] Selection triggers data fetch (placeholder alert for now)

### HTML Structure (Parallel)

- [ ] T016 [P] [US1] Add ticker-selection section with "Aandelenselectie" header to index.html
- [ ] T017 [P] [US1] Add 10 predefined ticker buttons (ASML, ADYEN, ING, etc.) to index.html
- [ ] T018 [P] [US1] Add manual ticker input field with Dutch placeholder to index.html
- [ ] T019 [P] [US1] Add "Zoek" button for manual ticker submission to index.html
- [ ] T020 [P] [US1] Add loading spinner element (hidden by default) to ticker-selection section in index.html

### Styling (Parallel)

- [ ] T021 [P] [US1] Style ticker-selection section with clear visual boundaries in style.css
- [ ] T022 [P] [US1] Style predefined ticker buttons in 2-row grid layout in style.css
- [ ] T023 [P] [US1] Style manual input field and search button in style.css
- [ ] T024 [P] [US1] Create loading spinner animation in style.css

### JavaScript Implementation

- [ ] T025 [US1] Implement validateTicker() function with Dutch error messages in script.js
- [ ] T026 [US1] Implement selectTicker() function (placeholder that shows alert) in script.js
- [ ] T027 [US1] Add click event listeners to all predefined ticker buttons in script.js
- [ ] T028 [US1] Add click event listener to search button in script.js
- [ ] T029 [US1] Add Enter key listener to ticker input field in script.js
- [ ] T030 [US1] Wire up loading state toggles in selectTicker() function in script.js

**Phase 3 Completion Test:**
1. Open index.html in browser
2. Click ASML button → see loading spinner → see alert with "ASML.AS"
3. Type "ING" in input → press Enter → see loading spinner → see alert with "ING.AS"
4. Type "123!@#" in input → see error "Alleen letters, cijfers en punten toegestaan"
5. All UI text appears in Dutch

---

## Phase 4: User Story 2 - Market Data Display (P2)

**Goal:** Users can view current price, change percentage, and 30-day historical chart

**Requirements:** Req 4-7 (Current price, Price change, Historical chart, Data freshness)

**Independent Test Criteria:**
- [ ] Current price displays with € symbol
- [ ] Change shows absolute and percentage with color (green/red)
- [ ] 30-day chart renders with ~25-30 data points
- [ ] Chart has Dutch labels and axis titles
- [ ] Data loads within 3 seconds of ticker selection

### HTML Structure (Parallel)

- [ ] T031 [P] [US2] Add market-data section with "Marktdata" header to index.html
- [ ] T032 [P] [US2] Add price display divs (ticker, current price, change) to index.html
- [ ] T033 [P] [US2] Add chart-container section with "Historische Koers (30 dagen)" header to index.html
- [ ] T034 [P] [US2] Add canvas element with id="price-chart" to chart-container in index.html
- [ ] T035 [P] [US2] Add loading spinner to market-data section in index.html

### Styling (Parallel)

- [ ] T036 [P] [US2] Style market-data section with prominent display in style.css
- [ ] T037 [P] [US2] Style price display with large font for current price in style.css
- [ ] T038 [P] [US2] Add color classes for positive (green) and negative (red) changes in style.css
- [ ] T039 [P] [US2] Style chart-container with fixed height (400px) in style.css

### JavaScript Implementation - API Integration

- [ ] T040 [US2] Implement fetchQuote() async function for Finnhub Quote endpoint in script.js
- [ ] T041 [US2] Implement fetchCandles() async function for Finnhub Candle endpoint in script.js
- [ ] T042 [US2] Add date calculation for 30 days ago in Unix timestamp in script.js
- [ ] T043 [US2] Implement validateQuoteResponse() function in script.js
- [ ] T044 [US2] Implement validateCandleResponse() function in script.js
- [ ] T045 [US2] Add Finnhub error handling with Dutch error messages in script.js

### JavaScript Implementation - Display

- [ ] T046 [US2] Implement formatPrice() helper function (€ formatting) in script.js
- [ ] T047 [US2] Implement formatChange() helper function (± display) in script.js
- [ ] T048 [US2] Implement displayMarketData() function to render price info in script.js
- [ ] T049 [US2] Add color coding logic (add positive/negative classes) in displayMarketData() in script.js
- [ ] T050 [US2] Implement formatChartDate() function for Dutch date labels in script.js
- [ ] T051 [US2] Implement renderChart() function with Chart.js configuration in script.js
- [ ] T052 [US2] Add chart instance cleanup (destroy previous chart) in renderChart() in script.js
- [ ] T053 [US2] Update selectTicker() to call fetchQuote and fetchCandles with Promise.all in script.js
- [ ] T054 [US2] Wire displayMarketData() and renderChart() calls in selectTicker() in script.js

**Phase 4 Completion Test:**
1. Click ASML button
2. Wait 2-3 seconds
3. Verify current price appears: "€725.50" (or actual price)
4. Verify change appears: "+€12.30 (+1.73%)" in green with ↑
5. Verify chart renders with ~25-30 blue line showing price trend
6. Verify chart x-axis shows Dutch dates: "14 nov", "15 nov", etc.
7. Verify chart y-axis shows € prices
8. Test with different ticker (ING) → data updates correctly

---

## Phase 5: User Story 3 - AI Advice Generation (P3)

**Goal:** Users can generate AI-powered educational insights with mandatory disclaimer

**Requirements:** Req 8-12 (Conditional button, Structured prompt, Response display, Balanced content, Disclaimer)

**Independent Test Criteria:**
- [ ] "Genereer advies" button appears only after market data loads
- [ ] Button click triggers AI request (loading state visible)
- [ ] AI response displays in Dutch below chart
- [ ] Disclaimer is visible and prominent
- [ ] Response includes risks and opportunities discussion
- [ ] Response appears within 5 seconds

### HTML Structure (Parallel)

- [ ] T055 [P] [US3] Add ai-advice section with "AI-advies" header to index.html
- [ ] T056 [P] [US3] Add "Genereer advies" button (disabled by default) to ai-advice section in index.html
- [ ] T057 [P] [US3] Add advice-response div for AI text display to index.html
- [ ] T058 [P] [US3] Add disclaimer div with Dutch warning text to index.html
- [ ] T059 [P] [US3] Add loading spinner to ai-advice section in index.html

### Styling (Parallel)

- [ ] T060 [P] [US3] Style ai-advice section with clear separation from chart in style.css
- [ ] T061 [P] [US3] Style "Genereer advies" button prominently with disabled state in style.css
- [ ] T062 [P] [US3] Style advice-response div with readable typography in style.css
- [ ] T063 [P] [US3] Style disclaimer with border, icon, and prominent styling in style.css

### JavaScript Implementation

- [ ] T064 [US3] Implement buildPrompt() function with Dutch educational template in script.js
- [ ] T065 [US3] Implement calculateTrendDescription() function from candle data in script.js
- [ ] T066 [US3] Implement deriveSentiment() function (optimistisch/voorzichtig/neutraal) in script.js
- [ ] T067 [US3] Implement generateAdvice() async function for Gemini API call in script.js
- [ ] T068 [US3] Add 10-second timeout with AbortController in generateAdvice() in script.js
- [ ] T069 [US3] Add Gemini error handling with Dutch error messages in script.js
- [ ] T070 [US3] Implement displayAdvice() function to render AI text in script.js
- [ ] T071 [US3] Add advice button enable/disable logic in selectTicker() success path in script.js
- [ ] T072 [US3] Add click event listener to "Genereer advies" button in script.js
- [ ] T073 [US3] Wire up loading state and button disable during AI request in script.js

**Phase 5 Completion Test:**
1. Click ASML button → wait for data load
2. Verify "Genereer advies" button appears and is enabled
3. Click "Genereer advies" button
4. Verify button becomes disabled and loading spinner appears
5. Wait 3-5 seconds
6. Verify AI response appears in Dutch (150-200 words)
7. Verify disclaimer is visible below response: "⚠️ Dit is geen financieel advies..."
8. Verify response discusses: recent price behavior, risks, opportunities
9. Click button again → new response generates
10. Test error case (invalid Gemini key) → "AI-service tijdelijk niet beschikbaar"

---

## Phase 6: User Story 4 - Data Persistence (P4)

**Goal:** Last ticker and advice history persist across browser sessions

**Requirements:** Req 13-15 (Last ticker persistence, Advice history, History size limit)

**Independent Test Criteria:**
- [ ] Last selected ticker reloads automatically on page refresh
- [ ] Advice history stores up to 10 entries
- [ ] History displays in advice section (optional UI)
- [ ] Corrupt localStorage resets gracefully
- [ ] Private browsing shows notice but app still functions

### JavaScript Implementation

- [ ] T074 [US4] Implement addToHistory() function with FIFO logic (max 10 entries) in script.js
- [ ] T075 [US4] Add saveState() call in selectTicker() to persist lastTicker in script.js
- [ ] T076 [US4] Add saveState() call in generateAdvice() to persist advice entry in script.js
- [ ] T077 [US4] Update initApp() to call loadStoredState() on startup in script.js
- [ ] T078 [US4] Add auto-load logic: if state.lastTicker exists, call selectTicker() in initApp() in script.js
- [ ] T079 [US4] Implement localStorage unavailable detection and Dutch notice in script.js
- [ ] T080 [US4] Add corrupt JSON handling with reset to empty state in loadStoredState() in script.js

### Optional: Advice History UI

- [ ] T081 [P] [US4] Add advice-history section to index.html (optional enhancement)
- [ ] T082 [P] [US4] Implement displayAdviceHistory() function in script.js (optional enhancement)
- [ ] T083 [P] [US4] Style advice-history as collapsible list in style.css (optional enhancement)

**Phase 6 Completion Test:**
1. Click ING button → generate advice
2. Close browser completely
3. Reopen index.html
4. Verify ING data loads automatically without user action
5. Verify advice history contains previous entry
6. Generate advice for 3 different tickers
7. Open DevTools → Application → localStorage
8. Verify `stockDashboardState` key exists with valid JSON
9. Verify adviceHistory array contains 3 entries
10. Manually corrupt JSON in DevTools → reload → verify graceful reset with warning

---

## Phase 7: User Story 5 - Data Reset (P5)

**Goal:** Users can clear all persisted data and return to initial state

**Requirements:** Req 16 (Reset functionality)

**Independent Test Criteria:**
- [ ] "Wis gegevens" button is visible at bottom of page
- [ ] Click clears localStorage completely
- [ ] UI resets to initial empty state
- [ ] Confirmation message shows: "Alle gegevens gewist"

### HTML Structure

- [ ] T084 [US5] Add "Wis gegevens" button at bottom of page in index.html

### Styling

- [ ] T085 [US5] Style reset button with secondary/danger styling in style.css

### JavaScript Implementation

- [ ] T086 [US5] Implement resetApp() function to clear localStorage in script.js
- [ ] T087 [US5] Add UI reset logic to resetApp() (clear all display sections) in script.js
- [ ] T088 [US5] Add confirmation message: "Alle gegevens gewist" in resetApp() in script.js
- [ ] T089 [US5] Add click event listener to "Wis gegevens" button in script.js
- [ ] T090 [US5] Optional: Add confirmation dialog before reset in script.js

**Phase 7 Completion Test:**
1. Load ticker, generate advice (so there's data to clear)
2. Click "Wis gegevens" button
3. Verify confirmation message appears: "Alle gegevens gewist"
4. Verify all market data cleared from UI
5. Verify advice section cleared
6. Verify chart cleared
7. Open DevTools → Application → localStorage
8. Verify `stockDashboardState` key is deleted
9. Refresh page → verify empty state (no auto-load)

---

## Phase 8: Polish & Cross-Cutting Concerns

**Goal:** Final refinements, comprehensive error handling, and workshop readiness

### Error Handling

- [ ] T091 Add network error detection ("Netwerkfout. Controleer je internetverbinding.") in script.js
- [ ] T092 Add API key validation check on app init (warn if still placeholder values) in script.js
- [ ] T093 Implement retry button for failed AI requests in script.js
- [ ] T094 Add rate limit handling (429 errors) with cooldown timer in script.js

### UX Enhancements

- [ ] T095 [P] Add fade-in animations for sections as they populate in style.css
- [ ] T096 [P] Add hover effects to all buttons in style.css
- [ ] T097 [P] Add visual highlight to last selected ticker button in script.js
- [ ] T098 [P] Improve responsive layout for smaller screens in style.css

### Performance

- [ ] T099 Add check to prevent multiple simultaneous API requests in script.js
- [ ] T100 Verify Chart.js instance is destroyed before creating new chart in script.js
- [ ] T101 Test and optimize for 3-second target load time

### Documentation

- [ ] T102 [P] Add inline code comments explaining key functions in script.js
- [ ] T103 [P] Update README.md with setup instructions and API key guidance
- [ ] T104 [P] Document Dutch ticker format (.AS suffix) in README.md

### Workshop Preparation

- [ ] T105 Create example with pre-filled API keys for workshop distribution
- [ ] T106 Test with actual Finnhub and Gemini API keys
- [ ] T107 Verify all Dutch translations are grammatically correct
- [ ] T108 Test in Chrome, Firefox, Safari, and Edge browsers

**Phase 8 Completion Test:**
Run complete manual testing checklist from spec.md including:
- Happy path: Select ticker → view data → generate advice → reset
- Error states: Invalid API keys, network offline, bad ticker, corrupt storage
- Persistence: Refresh page, close/reopen browser
- Cross-browser: Test in all 4 major browsers
- UI validation: All text in Dutch, disclaimers visible, colors correct

---

## Parallel Execution Opportunities

Tasks marked with `[P]` can be executed in parallel. Here are efficient parallelization strategies:

### During Phase 3 (User Story 1)
**Parallel Track A:** HTML structure (T016-T020)  
**Parallel Track B:** CSS styling (T021-T024)  
**Sequential:** JavaScript implementation (T025-T030) - depends on A & B

### During Phase 4 (User Story 2)
**Parallel Track A:** HTML structure (T031-T035)  
**Parallel Track B:** CSS styling (T036-T039)  
**Parallel Track C:** API integration functions (T040-T045)  
**Sequential:** Display functions and wiring (T046-T054) - depends on A, B, C

### During Phase 5 (User Story 3)
**Parallel Track A:** HTML structure (T055-T059)  
**Parallel Track B:** CSS styling (T060-T063)  
**Sequential:** JavaScript implementation (T064-T073) - depends on A & B

### During Phase 8 (Polish)
**All [P] tasks** can run simultaneously:
- UX enhancements (T095-T098)
- Documentation (T102-T104)

**Estimated Speedup:** With 2 developers, reduce implementation time by ~30%

---

## Success Metrics

### Code Quality
- [ ] All functions have single, clear responsibility
- [ ] No code duplication (DRY principle)
- [ ] All UI text in Dutch
- [ ] API keys have ⚠️ workshop warnings

### Functional Completeness
- [ ] All 16 functional requirements from spec.md implemented
- [ ] All 5 user stories independently testable
- [ ] All error states handle gracefully with Dutch messages
- [ ] All success criteria from spec.md met

### Performance
- [ ] Ticker selection → data display: < 3 seconds
- [ ] Chart rendering: < 2 seconds after data received
- [ ] AI advice generation: < 5 seconds

### Workshop Readiness
- [ ] Setup time for participant: < 10 minutes (with quickstart.md)
- [ ] Complete demo flow: < 2 minutes
- [ ] Works in all major browsers without errors
- [ ] Console logs aid debugging without being excessive

---

## Risk Mitigation

| Risk | Mitigation Tasks | Priority |
|------|------------------|----------|
| Chart.js CDN unavailable | T002: Use specific version pin instead of @latest | Medium |
| API rate limits during workshop | T094: Implement cooldown, prepare backup keys | High |
| Corrupt localStorage breaks app | T080: Graceful reset with user notice | High |
| Dutch translations incorrect | T107: Native speaker review | Medium |
| Browser compatibility issues | T108: Cross-browser testing | High |
| Slow API responses | T101: Add timeout, show loading states | Medium |

---

## Next Steps

1. **Review this task list** with team/instructor
2. **Set up development environment** (Phase 1)
3. **Implement MVP** (Phase 1-4: 10-12 hours)
4. **Workshop dry-run** with MVP
5. **Complete full feature** (Phase 5-8: additional 9-12 hours)
6. **Final workshop preparation** (T105-T108)

**Ready to start implementation!** Begin with T001 and proceed sequentially through each phase.

