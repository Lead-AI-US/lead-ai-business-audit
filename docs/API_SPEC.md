# API Spec

## Status

MVP / v0.2 client-side storage

This API spec is a planning document. Version 0.2 uses Firestore from the browser when Firebase web configuration is provided, plus local browser storage as a demo fallback. Backend endpoints should be treated as proposed until server code and tests are added.

## API Principles

- Validate every request with structured schemas.
- Return JSON responses with clear error messages.
- Require authentication before handling protected business data.
- Avoid logging personally identifiable information.
- Include explanation factors for AI-generated scores, recommendations, or risk outputs.

## Implemented Client Data Contract

Firestore collection:

```text
auditReports
```

Document ID:

```text
LA-YYYYMMDD-RANDOM
```

Stored report fields:

- `reportId`
- `createdAt`
- `status`
- `owner`
- `business`
- `auditInput`
- `auditResult`
- `source`

Admin status values:

- `new`
- `reviewed`
- `contacted`
- `proposal_sent`
- `converted`
- `not_ready`
- `closed`

## Proposed Backend Endpoint

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

The current React demo calculates audit results in the browser. If Firestore is configured, it writes report documents to `auditReports`. If Firestore is not configured, it saves reports to local browser storage.

## Planned PayPal Endpoints

Do not enable live checkout until these backend endpoints exist:

- `POST /api/paypal/create-order`
- `POST /api/paypal/capture-order`
