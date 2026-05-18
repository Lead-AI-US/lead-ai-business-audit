# Security

## Status

MVP / v0.2 intake system

Security controls must be reviewed again when implementation code, integrations, or deployment configuration are added.

## Baseline Rules

- Never commit secrets, API keys, tokens, private credentials, `.env` files, customer exports, or private datasets.
- Use `.env.example` for placeholder configuration names only.
- Validate all user input before storage, scoring, AI processing, or external API calls.
- Do not log personally identifiable information or private customer data.
- Add authentication and authorization before handling protected business data.
- Review dependencies and provider integrations before public demos.

## Product-Specific Risks

- Avoid collecting unnecessary sensitive business data.
- Review generated reports before using them for high-impact decisions.
- Document data retention expectations.
- Version 0.2 can store submitted lead contact details in Firestore when Firebase configuration is provided.
- Local browser storage is used only as a demo fallback and should not be treated as production storage.
- `/admin/audits` is a demo admin workflow. Add authentication and authorization before using it with real customer data.
- Firestore rules must restrict read/write access before production use.

## Firestore Rules Guidance

Before collecting real customer data, configure Firestore rules so public users can create reports but cannot list all reports. Admin list and status updates should require authenticated admin access.

Minimum production requirements:

- Restrict `auditReports` list access to admins only.
- Restrict status updates to admins only.
- Consider using unguessable report access tokens for customer report links.
- Define retention and deletion expectations for lead data.

## Responsible AI Controls

- Make limitations clear to users.
- Avoid unsupported accuracy or reliability claims.
- Provide human handoff or review for sensitive, uncertain, or high-impact workflows.
- Prefer explainable factors for scores, summaries, and recommendations.

## Security Review Checklist

- [ ] Secret scan completed.
- [ ] `.env.example` is accurate.
- [ ] Input validation documented.
- [x] Auth and authorization expectations documented.
- [ ] Logging reviewed for private data exposure.
- [ ] Responsible AI limitations documented.
