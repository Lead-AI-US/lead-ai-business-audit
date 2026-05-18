# Deployment

## Status

MVP

The current MVP is a static Vite React application. It can be deployed to static hosting after running a production build, but no production backend is included yet.

## Local Build

```bash
npm install
npm run lint
npm run build
```

The build output is generated in `dist/`.

## Future Deployment Requirements

- Static hosting configuration for the Vite build.
- Backend hosting for saved reports, lead capture, and AI workflows.
- Required environment variables from `.env.example` when integrations are added.
- Database migration or rules deployment process, if applicable.
- Monitoring, rollback, and incident response notes.

## Environment Strategy

- `development` for local work.
- `preview` for pull requests and demos.
- `production` only after security, testing, and operational readiness reviews.

## Pre-Deployment Checklist

- [ ] No secrets or `.env` files committed.
- [ ] Setup commands verified from a clean checkout.
- [ ] Authentication and authorization reviewed.
- [ ] Logs checked for private data exposure.
- [ ] Responsible AI limitations visible where relevant.
- [ ] README and docs updated with the actual deployment flow.
