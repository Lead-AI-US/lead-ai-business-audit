# Security

## Status

MVP

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
- The current MVP runs client-side and does not persist submitted intake data.
- Version 0.2 must add clear consent, retention, and access rules before storing lead contact details.

## Responsible AI Controls

- Make limitations clear to users.
- Avoid unsupported accuracy or reliability claims.
- Provide human handoff or review for sensitive, uncertain, or high-impact workflows.
- Prefer explainable factors for scores, summaries, and recommendations.

## Security Review Checklist

- [ ] Secret scan completed.
- [ ] `.env.example` is accurate.
- [ ] Input validation documented.
- [ ] Auth and authorization expectations documented.
- [ ] Logging reviewed for private data exposure.
- [ ] Responsible AI limitations documented.
