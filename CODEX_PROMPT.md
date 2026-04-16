# Build Task: salary-data-privacy

Build a complete, production-ready Next.js 15 App Router application.

PROJECT: salary-data-privacy
HEADLINE: Check and control who sees your salary data
WHAT: None
WHY: None
WHO PAYS: None
NICHE: privacy-tools
PRICE: $$12/mo

ARCHITECTURE SPEC:
A Next.js web app that scans job sites, salary databases, and data brokers to find where your salary information appears publicly. Users can track exposure, request removals, and monitor ongoing privacy with automated alerts.

PLANNED FILES:
- app/page.tsx
- app/dashboard/page.tsx
- app/scan/page.tsx
- app/api/scan/route.ts
- app/api/webhooks/lemonsqueezy/route.ts
- components/ScanResults.tsx
- components/RemovalRequest.tsx
- components/PricingCard.tsx
- lib/scanners/glassdoor.ts
- lib/scanners/payscale.ts
- lib/scanners/levels.ts
- lib/database.ts
- lib/lemonsqueezy.ts

DEPENDENCIES: next, tailwindcss, @lemonsqueezy/lemonsqueezy.js, prisma, @prisma/client, puppeteer, cheerio, nodemailer, stripe, next-auth, bcryptjs, zod

REQUIREMENTS:
- Next.js 15 with App Router (app/ directory)
- TypeScript
- Tailwind CSS v4
- shadcn/ui components (npx shadcn@latest init, then add needed components)
- Dark theme ONLY — background #0d1117, no light mode
- Lemon Squeezy checkout overlay for payments
- Landing page that converts: hero, problem, solution, pricing, FAQ
- The actual tool/feature behind a paywall (cookie-based access after purchase)
- Mobile responsive
- SEO meta tags, Open Graph tags
- /api/health endpoint that returns {"status":"ok"}

ENVIRONMENT VARIABLES (create .env.example):
- NEXT_PUBLIC_LEMON_SQUEEZY_STORE_ID
- NEXT_PUBLIC_LEMON_SQUEEZY_PRODUCT_ID
- LEMON_SQUEEZY_WEBHOOK_SECRET

After creating all files:
1. Run: npm install
2. Run: npm run build
3. Fix any build errors
4. Verify the build succeeds with exit code 0

Do NOT use placeholder text. Write real, helpful content for the landing page
and the tool itself. The tool should actually work and provide value.


PREVIOUS ATTEMPT FAILED WITH:
Codex exited 1: Reading additional input from stdin...
OpenAI Codex v0.121.0 (research preview)
--------
workdir: /tmp/openclaw-builds/salary-data-privacy
model: gpt-5.3-codex
provider: openai
approval: never
sandbox: danger-full-access
reasoning effort: none
reasoning summaries: none
session id: 019d9501-39d1-75d2-b3ad-4165a7454513
--------
user
# Build Task: salary-data-privacy

Build a complete, production-ready Next.js 15 App Router application.

PROJECT: salary-data-privacy
HEADLINE: Check and control who 
Please fix the above errors and regenerate.