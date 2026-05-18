# Architecture

## Status

MVP / v0.2 intake system

This document describes the current MVP architecture and the intended backend expansion path.

## System Context

Lead.AI Business Audit supports this product role: AI-powered business automation audit tool.

Business problem: Small businesses do not know what to automate first or how much AI automation they need.

## Current MVP Architecture

- **Experience layer:** `src/App.tsx` renders the lead capture form, report route, admin audit dashboard, scorecards, recommendation block, strengths/gaps, and 30-day roadmap.
- **Scoring layer:** deterministic client-side scoring in `src/auditModel.ts` turns safe intake data into readiness, lead response, workflow risk, customer intelligence, and overall scores.
- **Storage layer:** `src/auditStorage.ts` saves audit reports to Firestore when `VITE_FIREBASE_*` values are configured. Local browser storage is used as a demo fallback.
- **Presentation layer:** `src/styles.css` provides the responsive dashboard/report layout and print-friendly report output.
- **Build layer:** Vite, React, and TypeScript provide the local demo and production build.

## Implemented Components

- Full lead capture form
- Automation readiness score
- Lead response score
- Workflow gap analysis
- Recommended automation package
- 30-day roadmap
- Firestore-ready `auditReports` storage
- Unique report IDs
- Customer report route: `/report/:reportId`
- Admin dashboard route: `/admin/audits`
- Admin status pipeline
- Print/save report output
- Lead capture CTA

## Planned Backend Components

- Authentication for admin-only access.
- Firestore security rules for customer report and admin dashboard access.
- Optional AI recommendation layer for richer report language.
- PDF/report storage and email delivery.
- PayPal create-order and capture-order backend endpoints.

## Data And Integration Notes

- The current MVP persists to Firestore only when Firebase web configuration is provided.
- If Firestore is not configured, reports are saved to local browser storage for demo purposes.
- Store only the data required for the workflow when persistence is added.
- Keep provider-specific code behind clear adapters.
- Document data retention and deletion expectations before production use.
- Avoid storing private customer data in logs or public examples.

## Architecture Principles

- Keep the MVP small and testable.
- Separate UI, backend, AI, and integration concerns.
- Validate inputs before persistence or AI processing.
- Make important AI outputs reviewable and explainable.
