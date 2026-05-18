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

Current production deployment:

```text
https://lead-ai-business-audit.vercel.app
```

Deployment status:

- Vercel production deployment is live.
- GitHub repository About URL is updated.
- Vercel project name is `lead-ai-business-audit`.
- Vercel project is linked locally through `.vercel/project.json`, which is intentionally ignored by git.
- Automatic GitHub-to-Vercel deploys are pending GitHub App access for the `Lead-AI-US` organization.

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

Preferred branded URL after DNS setup:

```text
https://audit.lead-ai.us
```

## Custom Subdomain Setup

The branded audit subdomain should be configured after the Vercel account has access to the `lead-ai.us` domain.

Manual setup:

1. Open the Vercel dashboard project for `lead-ai-business-audit`.
2. Go to Project Settings -> Domains.
3. Add:
   ```text
   audit.lead-ai.us
   ```
4. In the DNS provider for `lead-ai.us`, create a CNAME record:
   ```text
   Host: audit
   Target: cname.vercel-dns.com
   ```
5. Wait for DNS propagation and confirm the Vercel domain status is valid.
6. Update the main website CTA from the temporary Vercel URL to:
   ```text
   https://audit.lead-ai.us
   ```

The current CLI account does not have domain access for `lead-ai.us`, so this step must be completed from the Vercel account or DNS provider that controls the domain.

## GitHub Auto-Deploy Connection

The CLI command was attempted:

```bash
vercel git connect https://github.com/Lead-AI-US/lead-ai-business-audit.git --yes
```

Vercel returned an access error while connecting the GitHub repository, even though the GitHub account has admin access to the public repository. This indicates the Vercel GitHub App/OAuth installation likely does not yet have access to the `Lead-AI-US` organization.

Manual fix:

1. Open the Vercel dashboard project for `lead-ai-business-audit`.
2. Go to project Git settings.
3. Connect Git repository.
4. Select GitHub and grant/install access for the `Lead-AI-US` organization.
5. Choose `Lead-AI-US/lead-ai-business-audit`.
6. Set production branch to `main`.
7. Confirm build settings:
   - Framework preset: Vite
   - Install command: `npm install`
   - Build command: `npm run build`
   - Output directory: `dist`
8. Trigger one deployment from Git to confirm automatic deploys work.

After deployment, update:

- README live demo link. Completed.
- GitHub repository About website URL. Completed.
- Demo screenshot/video issue. Completed with committed desktop and mobile screenshots.

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
- Backend endpoints for PayPal create-order and capture-order flows before accepting public checkout payments.
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
- [ ] Vercel GitHub auto-deploy connection completed in dashboard.
