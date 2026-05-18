# Lead.AI Business Funnel

## Status

Planned business funnel with live MVP audit demo.

The audit product is live as a public demo and should be connected to the main Lead.AI website as a lead-generation workflow. Payment, report storage, and automated email delivery are planned next milestones.

## Funnel Flow

```text
www.lead-ai.us
Main business website and sales page

-> Start Free AI Business Audit
https://lead-ai-business-audit.vercel.app

-> Customer receives audit score and roadmap

-> Paid offer
PayPal Checkout, consultation, or automation package

-> Customer books a call or pays a deposit
```

## Recommended Branded URLs

Current live audit URL:

```text
https://lead-ai-business-audit.vercel.app
```

Preferred branded URL:

```text
https://audit.lead-ai.us
```

The `audit.lead-ai.us` subdomain requires Vercel project domain access and DNS control for `lead-ai.us`.

## Main Website Section

Add a section on `www.lead-ai.us` titled:

```text
Free AI Business Automation Audit
```

Primary call to action:

```text
Start Free Audit
```

Temporary CTA target:

```text
https://lead-ai-business-audit.vercel.app
```

Final CTA target after DNS setup:

```text
https://audit.lead-ai.us
```

## Package Ladder

| Package | Price | Best For |
| --- | ---: | --- |
| Free AI Business Audit | $0 | New customers |
| Paid Strategy Call | $99 | Customers who want expert review before implementation |
| AI Automation Starter Setup | $299-$499 | Website chatbot, lead form, or basic automation |
| Growth Automation System | $799-$1,500 | CRM, WhatsApp, booking, follow-up, and analytics |
| Monthly AI Support Plan | $199-$499/month | Ongoing updates, monitoring, and prompt improvement |

Recommended first offer:

```text
Free Audit -> $99 Strategy Call -> $499 Starter Setup -> $199/month Support
```

## PayPal Checkout Plan

Use PayPal Checkout before accepting public package payments.

Planned Vercel environment variables:

```env
PAYPAL_CLIENT_ID=your_live_client_id
PAYPAL_CLIENT_SECRET=your_live_secret
PAYPAL_ENV=production
VITE_PAYPAL_CLIENT_ID=your_live_client_id
```

Security requirements:

- Keep `PAYPAL_CLIENT_SECRET` server-side only.
- Do not commit `.env` files.
- Test with PayPal Sandbox before switching to live credentials.
- Add backend create-order and capture-order endpoints before rendering live checkout.

## Required Business Pages

Before taking serious payments, the main website should include:

- `/privacy-policy`
- `/terms`
- `/refund-policy`
- `/contact`
- `/packages`
- `/free-ai-audit`

## Custom Domain Checklist

1. Add `audit.lead-ai.us` to the Vercel project domains.
2. Add a DNS CNAME record:
   - Host: `audit`
   - Target: `cname.vercel-dns.com`
3. Wait for DNS propagation.
4. Confirm the Vercel domain status is valid.
5. Replace the temporary Vercel URL in the main website with `https://audit.lead-ai.us`.

## Next Technical Milestone

Version 0.2 should turn the audit into a customer acquisition tool:

- Save audit report to Firebase Firestore.
- Collect business owner name, email, phone, and website.
- Generate a unique report ID.
- Add admin view for submitted audits.
- Add email notification placeholder.
- Add export to PDF.
- Add `Request Lead.AI Implementation` button.
