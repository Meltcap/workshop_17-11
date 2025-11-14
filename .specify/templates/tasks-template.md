# Task Breakdown: [FEATURE_NAME]

**Plan Reference:** [Link to plan file]  
**Status:** [Not Started | In Progress | Completed]  
**Constitution Version:** v[X.Y.Z]

## Task Categories

Tasks are organized by constitution principle to ensure alignment.

---

### Browser-Only Architecture Tasks

- [ ] **[TASK-001]** Verify no backend dependencies introduced
- [ ] **[TASK-002]** Confirm all code runs client-side only
- [ ] **[TASK-003]** Test static file hosting (no build step required)

---

### Minimal Technology Stack Tasks

- [ ] **[TASK-010]** Add Chart.js CDN link to `index.html`
- [ ] **[TASK-011]** Configure Finnhub API integration in `script.js`
- [ ] **[TASK-012]** Configure Gemini API integration in `script.js`
- [ ] **[TASK-013]** Document API key placement in README

---

### Radical Simplicity Tasks

- [ ] **[TASK-020]** Write small, single-purpose functions
- [ ] **[TASK-021]** Remove any complex abstractions
- [ ] **[TASK-022]** Add clarifying comments where intent is not obvious
- [ ] **[TASK-023]** Code review for readability

---

### Dutch-First UX Tasks

- [ ] **[TASK-030]** Translate all UI labels to Dutch
- [ ] **[TASK-031]** Translate all button text to Dutch
- [ ] **[TASK-032]** Translate all error messages to Dutch
- [ ] **[TASK-033]** Translate all section headings to Dutch
- [ ] **[TASK-034]** Add educational disclaimer text in Dutch

---

### Lightweight State Management Tasks

- [ ] **[TASK-040]** Define localStorage JSON structure
- [ ] **[TASK-041]** Implement load state with fallback
- [ ] **[TASK-042]** Implement save state function
- [ ] **[TASK-043]** Add reset/clear storage button
- [ ] **[TASK-044]** Test with corrupt/missing localStorage

---

### Responsible AI Integration Tasks

- [ ] **[TASK-050]** Design balanced AI prompt template
- [ ] **[TASK-051]** Add explicit disclaimer to AI output section
- [ ] **[TASK-052]** Validate no financial advice language in prompts
- [ ] **[TASK-053]** Test AI response error handling

---

### Manual Validation Tasks

- [ ] **[TASK-060]** Document happy path test steps
- [ ] **[TASK-061]** Manually test ticker selection
- [ ] **[TASK-062]** Manually test chart rendering
- [ ] **[TASK-063]** Manually test AI advice generation
- [ ] **[TASK-064]** Manually test localStorage persistence
- [ ] **[TASK-065]** Manually test error states

---

## Task Details

### [TASK-ID]: [Task Name]

**Principle:** [Which constitution principle this supports]  
**Estimated Effort:** [Small | Medium | Large]  
**Dependencies:** [List any blocking tasks]

**Description:**
[Detailed description of what needs to be done]

**Acceptance Criteria:**
- [ ] [Criterion 1]
- [ ] [Criterion 2]

**Files Affected:**
- `[filename]`

---

## Progress Tracking

**Completed:** [X / Total]  
**In Progress:** [List task IDs]  
**Blocked:** [List task IDs with reason]

## Notes

[Any implementation notes, decisions, or gotchas discovered during task execution]
