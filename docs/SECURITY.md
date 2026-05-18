# Security

## Status

Planned

Security controls must be reviewed again when application code is added.

## Requirements

- Do not commit secrets, API keys, access tokens, `.env` files, or customer exports.
- Document required configuration in `.env.example`.
- Validate all intake form inputs.
- Avoid collecting unnecessary sensitive business information.
- Do not log private audit submissions or generated reports.
- Review AI-generated recommendations before using them for high-impact decisions.

## Reporting

Report security concerns privately to the maintainer before public disclosure.
