# API Spec

## Status

MVP

This API spec is a planning document. The current MVP runs client-side without a backend API. Endpoints should be treated as proposed until server code and tests are added.

## API Principles

- Validate every request with structured schemas.
- Return JSON responses with clear error messages.
- Require authentication before handling protected business data.
- Avoid logging personally identifiable information.
- Include explanation factors for AI-generated scores, recommendations, or risk outputs.

## Proposed Endpoint

`POST /v1/audits`

### Example Request

```json
{"business_type":"local service","team_size":3,"main_problem":"slow lead follow-up"}
```

### Example Response

```json
{"readiness_score":74,"recommended_package":"Lead response automation","roadmap_days":30}
```

## Error Format

```json
{"error":"validation_error","message":"Describe the missing or invalid field","request_id":"demo-request-id"}
```

## Security Requirements

- Add authentication before customer use.
- Keep API keys and provider credentials server-side.
- Rate limit public or webhook-facing endpoints.
- Document data retention and logging behavior before production use.

## Current Local Demo

The current React demo calculates audit results in the browser and does not send data to any server.
