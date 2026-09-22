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
- `/admin/audits` now requires a signed-in Firebase Auth admin session whenever Firestore is configured (`isFirestoreConfigured`); in local-demo mode (no Firebase env vars) it is unchanged, since each browser's `localStorage` is already isolated and holds no cross-customer data. See `src/auditAuth.ts` and the admin-gating logic in `src/App.tsx`.
- Firestore rules (`firestore.rules`) now exist in this repo and restrict `list`/`update`/`delete` on `auditReports` to an admin-email allowlist, and cap the size of free-text fields on `create`. **They are not enforced until deployed** — see below.

## Firestore Rules Guidance — status

`firestore.rules` + `firebase.json` are committed. Before turning on Firestore for real customer data (setting `VITE_FIREBASE_*` in the Vercel project), this is still required and **has not been done from this environment** (no Firebase project console access here):

1. Deploy the rules: `firebase deploy --only firestore:rules` (requires the Firebase CLI authenticated against the real project).
2. Edit the `ADMIN_EMAILS`-equivalent list inside `firestore.rules` (`isAdmin()`) to the real Lead.AI operator email(s) before deploying — it currently contains a placeholder (`admin@lead-ai.us`).
3. In Firebase Console → Authentication, enable the Email/Password provider and create the matching admin user account(s). The app's sign-in form (`src/auditAuth.ts`) calls `signInWithEmailAndPassword`; there is no self-serve admin signup path by design.
4. Confirm in the Firebase Console that the deployed rules match this file (console edits can silently drift from the repo).

The app-level sign-in gate in `src/App.tsx` is defense in depth, not the security boundary — it stops the UI from rendering data to an unauthenticated visitor, but only the deployed Firestore rules actually stop a direct API/SDK read. Do not treat step 1-2 as optional once real customer data is in play.

Also done: `generateReportId()` in `src/auditStorage.ts` now uses `crypto.getRandomValues` with 16 chars of entropy instead of `Math.random()` with 5, since `/report/:reportId` is intentionally publicly readable (`allow get: if true` — report links are shared directly with the business owner) and previously relied on a weak, guessable identifier.

Remaining, not done: retention/deletion workflow for lead data (no TTL or deletion tooling exists yet — Firestore TTL policies or a scheduled export/delete job would need to be configured directly in the Firebase project once real data volume justifies it).

## Responsible AI Controls

- Make limitations clear to users.
- Avoid unsupported accuracy or reliability claims.
- Provide human handoff or review for sensitive, uncertain, or high-impact workflows.
- Prefer explainable factors for scores, summaries, and recommendations.

## Security Review Checklist

- [x] Secret scan completed. No `.env`/`.env.local` ever committed (checked full git history, not just working tree); no hardcoded API keys or credentials in `src/`.
- [x] `.env.example` is accurate. All uncommented vars (`VITE_FIREBASE_*`) are read in `src/auditStorage.ts`; commented-out vars (`AUTH_SECRET`, `DATABASE_URL`, `OPENAI_API_KEY`, `PAYPAL_*`, etc.) are explicitly marked as planned/unimplemented and match that they aren't referenced anywhere in `src/`.
- [x] Input validation documented. Client-side in `validateIntake()` (`src/App.tsx`); independently re-enforced server-side by `firestore.rules`' `isValidNewReport()` (field presence, type, and length caps) since client validation alone is bypassable via direct SDK calls.
- [x] Auth and authorization expectations documented, and now implemented in code (see Firestore Rules Guidance above) — deployment of the rules and creation of the real admin account are the two steps still outstanding.
- [x] Logging reviewed for private data exposure. Only one `console.*` call in `src/` (`App.tsx`, `submitAudit` catch block) — logs the caught `Error` object, not report/PII fields directly.
- [x] Responsible AI limitations documented — see "Responsible AI Controls" above and the on-page "Scoring model transparency" panel (`ReportSummary` in `src/App.tsx`), which states the score is deterministic, not AI-generated.
