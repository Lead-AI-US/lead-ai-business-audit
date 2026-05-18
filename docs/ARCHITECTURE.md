# Architecture

## Status

MVP

This document describes the current MVP architecture and the intended backend expansion path.

## System Context

Lead.AI Business Audit supports this product role: AI-powered business automation audit tool.

Business problem: Small businesses do not know what to automate first or how much AI automation they need.

## Current MVP Architecture

- **Experience layer:** `src/App.tsx` renders the intake form, live scorecards, recommendation block, strengths/gaps, and 30-day roadmap.
- **Scoring layer:** deterministic client-side scoring in `calculateAudit` turns safe intake data into readiness, lead response, workflow risk, customer intelligence, and overall scores.
- **Presentation layer:** `src/styles.css` provides the responsive dashboard/report layout and print-friendly report output.
- **Build layer:** Vite, React, and TypeScript provide the local demo and production build.

## Implemented Components

- Business intake form
- Automation readiness score
- Lead response score
- Workflow gap analysis
- Recommended automation package
- 30-day roadmap
- Print/save report output
- Lead capture CTA

## Planned Backend Components

- API endpoint for audit creation and report retrieval.
- Database table or collection for saved audits and lead capture records.
- Optional AI recommendation layer for richer report language.
- PDF/report storage and email delivery.
- Authentication for private client reports.

## Data And Integration Notes

- The current MVP does not persist data or call external APIs.
- Store only the data required for the workflow when persistence is added.
- Keep provider-specific code behind clear adapters.
- Document data retention and deletion expectations before production use.
- Avoid storing private customer data in logs or public examples.

## Architecture Principles

- Keep the MVP small and testable.
- Separate UI, backend, AI, and integration concerns.
- Validate inputs before persistence or AI processing.
- Make important AI outputs reviewable and explainable.
