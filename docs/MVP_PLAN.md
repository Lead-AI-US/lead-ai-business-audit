# MVP Plan

## Objective

Ship the smallest credible demo for Lead.AI Business Audit.

## Current MVP Status

Implemented:

- React/Vite client-side demo.
- Full lead capture form with safe sample data.
- Deterministic scoring rubric.
- Recommended automation package.
- Strengths and workflow gap analysis.
- 30-day roadmap output.
- Print/save report action.
- Transparent score bands and scoring explanation.
- Firestore-ready report storage.
- Local demo storage fallback.
- Unique report IDs.
- Report route: `/report/:reportId`.
- Admin dashboard route: `/admin/audits`.
- Admin status updates.
- Desktop and mobile screenshots.

## MVP Features

- Business intake form
- Lead capture fields
- Automation readiness score
- Lead response score
- Workflow gap analysis
- Recommended automation package
- Report storage and retrieval
- Admin follow-up workflow

## Implementation Steps

1. Define the data model and environment variables.
2. Build the primary user flow.
3. Add validation, safe defaults, and error states.
4. Add realistic sample data.
5. Document setup, security, responsible AI notes, and deployment assumptions.
6. Add screenshots or a demo video.

## Acceptance Criteria

- The README explains the product, status, setup, and usage flow.
- The demo does not require real customer data.
- No secrets are committed.
- Security and responsible AI checklists are complete.
- The next development milestone is clear.

## Next MVP Milestones

1. Add a persistent backend for saved audit reports.
2. Add a shareable report URL.
3. Add screenshot and demo video assets.
4. Add form validation tests and scoring logic tests.
5. Add an optional PDF generation path.

## Version 0.2 Scope

Report Storage + Lead Capture:

- Firebase Firestore report persistence. Implemented.
- Local browser storage fallback. Implemented.
- Lead contact fields: owner name, email, phone, website, business type, major problem, automation needs, monthly budget. Implemented.
- Unique report ID. Implemented.
- Admin submitted-audits view. Implemented.
- Status pipeline. Implemented.
- PDF export path through print/save. Implemented.
- Request proposal CTA. Implemented.
- Email notification placeholder. Planned for v0.4.
- PayPal Checkout. Deferred to v0.3.
