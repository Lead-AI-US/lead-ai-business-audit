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

## Vercel Deployment

Recommended project name:

```text
lead-ai-business-audit
```

Deploy:

```bash
npm install -g vercel
vercel login
vercel
vercel --prod
```

Recommended production URL:

```text
https://lead-ai-business-audit.vercel.app
```

Current production deployment:

```text
https://lead-ai-business-audit.vercel.app
```

After deployment, update:

- README live demo link. Completed.
- GitHub repository About website URL. Completed after deployment when GitHub CLI auth is available.
- Demo screenshot/video issue.

## Firebase Hosting Deployment

Optional static hosting path:

```bash
npm install
npm run build
firebase init hosting
firebase deploy
```

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

- [x] No secrets or `.env` files committed.
- [x] Setup commands verified from a clean checkout.
- [ ] Authentication and authorization reviewed before backend/customer data is added.
- [x] Current MVP does not log or transmit private data.
- [x] Responsible AI limitations visible where relevant.
- [x] README and docs updated with the current deployment flow.
