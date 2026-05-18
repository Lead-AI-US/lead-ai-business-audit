# User Flow

## Primary User

Small business owners

## Primary Flow

1. Business owner completes the audit intake form with owner, contact, business, budget, and workflow details.
2. The system validates email, phone, website URL, required problem statement, and automation needs.
3. The system scores automation readiness, lead response, workflow risk, and customer intelligence.
4. The app saves the report to Firestore when configured or local browser storage in demo mode.
5. The user lands on `/report/:reportId` and can print/save the report.
6. Lead.AI reviews submitted audits in `/admin/audits`.
7. Admin updates status through `new`, `reviewed`, `contacted`, `proposal_sent`, `converted`, `not_ready`, or `closed`.

## Happy Path Outcome

The user receives a clear business result from Lead.AI Business Audit without needing to understand the underlying AI or infrastructure.

## Failure And Handoff Paths

- If required data is missing, ask for the minimum additional information.
- If Firestore is not configured, use local demo storage and show a clear message.
- If report retrieval fails, show a recoverable not-found state.
- If private data is involved, avoid exposing it in logs or public examples.
- Keep PayPal disabled until backend endpoints exist.

## Demo Requirements

- Use safe sample data.
- Show the main workflow end to end.
- Include one screenshot or short video after implementation.
- Keep the scoring model described as deterministic unless an AI scoring backend is actually added.
