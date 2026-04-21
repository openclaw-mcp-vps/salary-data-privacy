# Salary Data Privacy

Salary Data Privacy is a Next.js 15 App Router dashboard that helps users understand and reduce salary-data exposure across employment verifiers, background screeners, and data brokers.

## Features

- Dark-mode-only privacy dashboard (`#0d1117` base theme)
- Cookie-based paywall unlock after Stripe purchase verification
- Salary exposure scan with broker-level risk scoring and action guidance
- Opt-out automation via generated templates and optional direct SMTP sending
- Monitoring feed for newly observed salary data-sharing expansions
- Stripe webhook ingestion for purchase verification
- `/api/health` endpoint for runtime checks

## Stack

- Next.js 15 App Router + TypeScript
- Tailwind CSS v4
- shadcn-style UI component architecture (`components/ui/*`)
- JSON file persistence (`data/salary-privacy-db.json`)

## Environment

Copy `.env.example` and set at minimum:

- `NEXT_PUBLIC_STRIPE_PAYMENT_LINK`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_WEBHOOK_SECRET`

Optional for auto email sending:

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_FROM`

## Local Run

```bash
npm install
npm run dev
```

Build check:

```bash
npm run build
```

## Stripe Webhook Setup

Use either endpoint (both accept Stripe signatures):

- `/api/webhooks/stripe`
- `/api/webhooks/lemon-squeezy`

Recommended events:

- `checkout.session.completed`
- `checkout.session.async_payment_succeeded`

After webhook delivery records a paid purchase, users can unlock the dashboard from `/pricing` using the checkout email.
