# Specification: [FEATURE_NAME]

**Status:** [Draft | Approved | Implemented | Deprecated]  
**Created:** [YYYY-MM-DD]  
**Last Updated:** [YYYY-MM-DD]  
**Constitution Alignment:** v[X.Y.Z]

## Overview

[Brief description of what this feature does and why it exists]

## Constitution Compliance Check

- [ ] Browser-Only Architecture: No backend/tooling introduced
- [ ] Minimal Technology Stack: Uses only whitelisted technologies
- [ ] Radical Simplicity: Code remains explicit and readable
- [ ] Dutch-First UX: All UI text in Dutch
- [ ] Lightweight State Management: Uses localStorage appropriately
- [ ] Responsible AI Integration: Includes disclaimers if AI-related
- [ ] Manual Validation: Testing approach documented

## Requirements

### Functional Requirements

1. [Requirement 1]
2. [Requirement 2]
3. [Requirement 3]

### Non-Functional Requirements

- **Performance:** [Expectations]
- **Usability:** [User experience goals]
- **Error Handling:** [How errors are managed]

## User Interface

### UI Text (Dutch)

- [List all Dutch UI strings]
- [Buttons, labels, messages]
- [Error states]

### Layout

[Describe layout and visual structure]

## Technical Design

### Data Flow

[Describe how data moves through the system]

### API Integration

- **Finnhub API:**
  - Endpoints used: [list]
  - Error handling: [approach]

- **Gemini API:**
  - Model: gemini-2.5-flash
  - Prompt structure: [describe]
  - Disclaimer handling: [approach]

### State Management

**localStorage structure:**
```json
{
  "key": "description"
}
```

## Out of Scope

[What this feature explicitly does NOT do]

## Success Criteria

- [ ] [Criterion 1]
- [ ] [Criterion 2]
- [ ] [Criterion 3]

## Manual Testing Checklist

- [ ] Happy path validation
- [ ] Error state display
- [ ] localStorage persistence
- [ ] UI text in Dutch
- [ ] Disclaimers present (if AI-related)
