# Product Spec

## Product

Lead.AI Business Audit

## Role

AI-powered business automation audit tool.

## Value Proposition

A lead magnet and advisory tool that turns business pain points into an automation readiness score and 30-day roadmap.

## Problem

Small businesses do not know what to automate first or how much AI automation they need.

## Target Users

- Small business owners
- Local service businesses
- Consultants
- Agencies
- Startup founders

## Core Features

- Full business and owner intake form
- Automation readiness score
- Lead response score
- Workflow gap analysis
- Recommended automation package
- 30-day roadmap
- Saved report route
- Admin audit dashboard
- Lead status pipeline
- PDF/report-ready output
- Lead capture CTA

## MVP Scope

The MVP should prove one practical workflow before expanding into a full product.

First valuable demo: Build the intake form, scoring rubric, and report-ready audit output first.

Current MVP additions:

- Transparent score bands.
- Report generation date.
- Recommended package.
- Top 3 automation priorities.
- Implementation notes.
- Firestore-ready `auditReports` collection.
- Local browser storage fallback.
- Report view at `/report/:reportId`.
- Admin view at `/admin/audits`.
- Status pipeline for lead follow-up.
- Desktop and mobile screenshots.

## Out Of Scope For MVP

- Production claims.
- Real customer data.
- Complex multi-tenant enterprise controls.
- Unsupported accuracy claims.
- Paid billing flows until PayPal backend endpoints are implemented.
- Public admin access for production customer data.

## Success Metrics

- A visitor understands the product in under 10 seconds.
- The primary workflow can be demonstrated with safe sample data.
- Setup and security expectations are documented.
- AI outputs include limitations, explanations, or review guidance where relevant.

## Client Lead Magnet Goal

The product should help Lead.AI start a client conversation by showing a practical automation opportunity and a clear next step toward implementation help.
