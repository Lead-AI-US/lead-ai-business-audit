# Architecture

## Status

MVP

This document describes the intended architecture. It must be updated when implementation files are added.

## System Context

Lead.AI Business Audit supports this product role: AI-powered business automation audit tool.

Business problem: Small businesses do not know what to automate first or how much AI automation they need.

## Core Layers

- **Experience layer:** user-facing screens, widgets, reports, dashboards, or documentation flows.
- **API/workflow layer:** input validation, business rules, routing, integrations, and orchestration.
- **AI layer:** prompts, scoring, summaries, explanations, recommendations, or decision support.
- **Data layer:** product records, configuration, outputs, audit records, and analytics events.
- **Security layer:** authentication, authorization, secret management, privacy, logging, and abuse controls.

## Planned Components

- Business intake form
- Automation readiness score
- Lead response score
- Workflow gap analysis
- Recommended automation package
- 30-day roadmap
- PDF/report-ready output
- Lead capture CTA

## Data And Integration Notes

- Store only the data required for the workflow.
- Keep provider-specific code behind clear adapters.
- Document data retention and deletion expectations before production use.
- Avoid storing private customer data in logs or public examples.

## Architecture Principles

- Keep the MVP small and testable.
- Separate UI, backend, AI, and integration concerns.
- Validate inputs before persistence or AI processing.
- Make important AI outputs reviewable and explainable.
