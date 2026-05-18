# Roadmap

## Status

MVP / v0.2 implemented

## Phase 1: Product Foundation

- Confirm target user and first use case.
- Define data model, environment variables, and security boundaries.
- Create the first UI or API skeleton.
- Add test strategy and deployment assumptions.

## Phase 2: MVP Demo

- Implement the core workflow: Build the intake form, scoring rubric, and report-ready audit output first. Completed.
- Add realistic sample data and public-safe examples. Completed.
- Add screenshots or a short demo video. Screenshots completed.
- Validate the workflow with at least one business scenario.

## Version 0.2: Report Storage + Lead Capture

- Save audit reports to Firebase Firestore. Implemented with local demo fallback.
- Collect business owner name, email, phone, website, business type, major problem, automation needs, and monthly budget. Completed.
- Generate unique report IDs. Completed.
- Add report view at `/report/:reportId`. Completed.
- Add admin view at `/admin/audits`. Completed.
- Add status pipeline: `new`, `reviewed`, `contacted`, `proposal_sent`, `converted`, `not_ready`, `closed`. Completed.
- Add export to PDF through print/save flow. Completed.
- Add "Request proposal" and consultation CTA. Completed.
- Connect the main `www.lead-ai.us` website CTA to the audit workflow. Completed.
- Keep PayPal Checkout planned until backend endpoints exist. Completed.
- Prepare `audit.lead-ai.us` as the branded production URL after DNS access is available. Pending.

## Phase 3: Trust And Integrations

- Add authentication or protected access for `/admin/audits`.
- Add restrictive Firestore rules before collecting real customer data.
- Add email notification placeholder and delivery provider.
- Add PayPal create-order and capture-order backend endpoints before live checkout.
- Add monitoring, logging, error handling, and abuse controls.
- Improve responsible AI notes, human review paths, and explainability.

## Phase 4: Product Readiness

- Add automated tests and setup verification.
- Finalize deployment documentation.
- Review security and privacy posture.
- Decide whether status should move to Demo Ready, In Development, or Production Ready.
