<!--
Sync Impact Report:
Version change: none → v1.0.0
Modified principles: Initial creation
Added sections: All (initial constitution - 7 core principles)
Removed sections: None
Templates requiring updates:
  - .specify/templates/plan-template.md: ✅ created
  - .specify/templates/spec-template.md: ✅ created
  - .specify/templates/tasks-template.md: ✅ created
  - .specify/README.md: ✅ created
Follow-up TODOs: None - all supporting artifacts complete
-->

# Project Constitution

**Project:** Finnhub Stock Dashboard Workshop  
**Version:** v1.0.0  
**Ratification Date:** 2025-11-14  
**Last Amended:** 2025-11-14

## Purpose

This constitution defines the non-negotiable principles and constraints that govern the Finnhub Stock Dashboard Workshop project. It serves as the foundational document for all technical and design decisions, ensuring consistency, maintainability, and alignment with educational goals.

---

## Principles

### 1. Browser-Only Architecture

**Statement:**  
The entire application MUST run exclusively in the browser with no backend infrastructure, build tooling, or frameworks.

**Details:**
- Single HTML file (`index.html`) with accompanying `style.css` and `script.js`
- No server-side code, no Node.js build steps, no bundlers, no transpilers
- No Docker, no deployment pipelines beyond hosting static files
- All functionality delivered through vanilla browser APIs

**Rationale:**  
Workshop participants need a zero-friction setup that works by simply opening an HTML file. This removes barriers to entry and focuses learning on core web APIs and external service integration rather than tooling complexity.

---

### 2. Minimal Technology Stack

**Statement:**  
The tech stack MUST consist solely of plain HTML, CSS, vanilla JavaScript, and explicitly whitelisted CDN libraries.

**Details:**
- HTML5, CSS3, and ES6+ JavaScript only
- Fetch API for all HTTP requests
- Chart.js via CDN (`https://cdn.jsdelivr.net/npm/chart.js`) for visualizations
- Finnhub REST API for stock market data
- Google Gemini REST API (`gemini-2.5-flash` model) for AI-generated educational text
- API keys MAY be hardcoded in `script.js` for workshop/demo purposes only, with explicit warnings about production practices

**Rationale:**  
Limiting dependencies to CDN-delivered libraries and REST APIs ensures the project remains understandable in a 2-3 hour workshop while teaching real-world API integration patterns.

---

### 3. Radical Simplicity

**Statement:**  
Code MUST prioritize explicit readability and straightforward logic over abstraction, patterns, or optimization.

**Details:**
- Small, clearly named functions that do one thing
- No clever abstractions, design patterns, or premature optimization
- Minimal defensive programming—focus on happy path with basic error handling
- Direct, imperative code over functional or declarative styles when clarity benefits
- Comments explaining "why" where intent is not self-evident

**Rationale:**  
Workshop attendees have varying experience levels. Code that can be read top-to-bottom without mental gymnastics accelerates understanding and encourages experimentation.

---

### 4. Dutch-First User Experience

**Statement:**  
All user-facing text MUST be in Dutch, with a beginner-friendly, single-screen layout.

**Details:**
- UI labels, buttons, error messages, instructions, section titles: all in Dutch
- Clear visual hierarchy with one primary workflow visible on load
- Helpful error states with actionable messages (e.g., "API-sleutel ontbreekt")
- AI-generated content MUST display an educational disclaimer (e.g., "Dit is geen financieel advies, alleen voor educatieve doeleinden")

**Rationale:**  
The target audience is Dutch-speaking workshop participants. A native-language interface reduces cognitive load and makes the learning experience more accessible and inclusive.

---

### 5. Lightweight State Management

**Statement:**  
Application state MUST be persisted using `localStorage` with a simple JSON structure and graceful degradation.

**Details:**
- Store a single JSON object containing:
  - Last selected ticker symbol
  - Brief history of AI-generated advice (symbol, timestamp, summary label)
- Handle missing, corrupt, or unavailable `localStorage` with minimal fallback (e.g., default to empty state)
- Provide a clear UI action to reset stored data

**Rationale:**  
Workshop projects benefit from state persistence across page refreshes to demonstrate storage APIs, but complexity must remain minimal to avoid debugging distractions.

---

### 6. Responsible AI Integration

**Statement:**  
AI-generated content MUST be short, balanced, educational, and accompanied by explicit disclaimers.

**Details:**
- Gemini API prompts MUST request:
  - Short explanations of recent price behavior
  - Balanced discussion of risks and opportunities
  - Educational framing (no actionable trading advice)
- Every AI output MUST include a disclaimer that this is not financial advice
- No risky, speculative, or misleading language in prompts or displayed results

**Rationale:**  
Educational integrity requires clear boundaries around AI-generated financial content to avoid misinterpretation and ensure workshop participants understand the limitations and ethical considerations of AI advice systems.

---

### 7. Manual Validation Over Automation

**Statement:**  
Testing MUST rely on manual validation of the happy path; no automated test suites are required.

**Details:**
- No unit tests, integration tests, or end-to-end test frameworks
- Manual verification of core workflows:
  - Ticker selection → data fetch → chart rendering
  - AI advice generation → display with disclaimer
  - localStorage persistence → reset functionality
- Document expected behavior in README or inline comments

**Rationale:**  
For a time-constrained workshop project, automated testing adds complexity without proportional educational value. Manual testing keeps the focus on core web development skills and API integration.

---

## Governance

### Amendment Process

1. Proposed amendments must be documented with rationale and impact analysis
2. Version number must be incremented according to semantic versioning:
   - **MAJOR**: Breaking changes to core principles or removal of constraints
   - **MINOR**: New principles added or significant expansions to existing ones
   - **PATCH**: Clarifications, wording improvements, or non-semantic refinements
3. All dependent templates and documentation must be updated before finalizing amendments

### Compliance Review

Constitution adherence MUST be validated at key project milestones:
- Before workshop delivery
- When adding new features or dependencies
- During any significant refactoring

Deviations from principles require explicit justification and documentation in project plans or specification documents.

### Related Artifacts

- Specifications: `.specify/specs/`
- Plans: `.specify/plans/`
- Templates: `.specify/templates/`

All derivative documents must align with this constitution or explicitly document approved exceptions.

---

**End of Constitution**
