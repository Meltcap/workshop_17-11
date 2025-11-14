# Specify Documentation System

This directory contains the **Speckit** documentation structure for the Finnhub Stock Dashboard Workshop project.

## Structure

```
.specify/
├── memory/
│   └── constitution.md      # Project principles and governance
├── templates/
│   ├── spec-template.md     # Feature specification template
│   ├── plan-template.md     # Implementation plan template
│   └── tasks-template.md    # Task breakdown template
├── specs/                   # Feature specifications (created as needed)
├── plans/                   # Implementation plans (created as needed)
└── README.md               # This file
```

## Constitution

The **constitution** (`memory/constitution.md`) is the foundational document defining non-negotiable principles:

1. **Browser-Only Architecture** - No backend, build tools, or frameworks
2. **Minimal Technology Stack** - Plain HTML/CSS/JS + whitelisted CDN libraries only
3. **Radical Simplicity** - Explicit, readable code over clever abstractions
4. **Dutch-First UX** - All user-facing text in Dutch
5. **Lightweight State Management** - Simple localStorage with graceful degradation
6. **Responsible AI Integration** - Educational, balanced, with explicit disclaimers
7. **Manual Validation** - Practical testing over automated test suites

All project decisions must align with these principles.

## Using the Templates

### Creating a Specification

```bash
cp .specify/templates/spec-template.md .specify/specs/[feature-name].md
```

Fill in all bracketed placeholders and complete the constitution compliance checklist.

### Creating a Plan

```bash
cp .specify/templates/plan-template.md .specify/plans/[feature-name].md
```

Break down the specification into concrete implementation steps.

### Creating Tasks

```bash
cp .specify/templates/tasks-template.md .specify/plans/[feature-name]-tasks.md
```

Organize tasks by constitution principle for easy tracking.

## Governance

- **Version:** All documents reference the constitution version they align with
- **Amendments:** Constitution changes require updating all dependent templates
- **Compliance:** Major features must complete the constitution alignment checklist

## Quick Start

1. Read the constitution: `.specify/memory/constitution.md`
2. For new features:
   - Start with a spec using `spec-template.md`
   - Create a plan using `plan-template.md`
   - Break into tasks using `tasks-template.md`
3. Validate constitution alignment at each stage

## Workshop Context

This is a **workshop-level educational project**. The constitution reflects intentional trade-offs for learning goals:

- ✅ Zero-friction setup (open HTML file and go)
- ✅ Focus on web APIs and external service integration
- ✅ Accessible to varied experience levels
- ❌ Not production-grade (API keys in client code)
- ❌ Not scalable architecture (localStorage, no backend)
- ❌ Not automated testing (manual validation only)

These constraints are *features*, not bugs, for the educational context.

