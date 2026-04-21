import Link from "next/link";
import { ShieldCheck, CircleDollarSign, SearchCheck, FileWarning, ArrowRight } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const faqItems = [
  {
    question: "How does the scan actually work?",
    answer:
      "You provide your employment and lending context once. The platform maps that to known salary-data buyers, verification exchanges, and broker distribution patterns, then prioritizes where your salary history is most likely circulating."
  },
  {
    question: "Can this really improve loan or insurance outcomes?",
    answer:
      "Reducing salary-data sharing narrows the number of systems that can profile your compensation trajectory. That helps prevent hidden risk scores from influencing rates and underwriting assumptions."
  },
  {
    question: "What happens after I pay?",
    answer:
      "After checkout, you unlock your dashboard by confirming the purchase email. Access is stored in a secure cookie and you can immediately run scans and generate opt-out requests."
  },
  {
    question: "Do you sell my data?",
    answer:
      "No. The app stores only what is needed to run scans and track opt-out status, and never sells user data to third parties."
  }
];

const paymentLink = process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK;

export default function HomePage() {
  return (
    <div className="space-y-24 pb-20 pt-14">
      <section className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          <p className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-200">
            <ShieldCheck className="h-3.5 w-3.5" />
            Salary history privacy monitoring
          </p>
          <h1 className="font-[var(--font-space-grotesk)] text-4xl font-bold leading-tight text-white sm:text-5xl">
            Check and control who sees your salary data
          </h1>
          <p className="max-w-xl text-lg text-slate-300">
            Most professionals never see where salary history travels after payroll verification requests. Salary Data Privacy reveals the exposure, automates
            opt-outs, and tracks new sharing agreements before they impact your financial leverage.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href={paymentLink} className={buttonVariants({ size: "lg" })}>
              Start Protecting My Data
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
            <Link href="/dashboard" className={buttonVariants({ size: "lg", variant: "secondary" })}>
              View Dashboard
            </Link>
          </div>
          <p className="text-sm text-slate-400">$12/month. Cancel anytime. Hosted Stripe checkout.</p>
        </div>

        <Card className="border-cyan-900/40 bg-gradient-to-b from-slate-950 to-slate-900">
          <CardHeader>
            <CardTitle className="font-[var(--font-space-grotesk)] text-2xl">What is at risk</CardTitle>
            <CardDescription>
              Compensation data can be used in credit, insurance, and employment pipelines without a direct notification to you.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5 text-sm text-slate-300">
            <div className="flex gap-3">
              <CircleDollarSign className="mt-0.5 h-4 w-4 text-cyan-300" />
              <p>Lenders can use salary confidence signals to adjust rate assumptions and debt-to-income risk thresholds.</p>
            </div>
            <div className="flex gap-3">
              <SearchCheck className="mt-0.5 h-4 w-4 text-cyan-300" />
              <p>Background check providers can combine role and salary history into candidate profiling workflows.</p>
            </div>
            <div className="flex gap-3">
              <FileWarning className="mt-0.5 h-4 w-4 text-cyan-300" />
              <p>Data brokers resell employment-linked identity records downstream to buyers you never consented to directly.</p>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-8">
        <h2 className="font-[var(--font-space-grotesk)] text-3xl font-semibold text-white">The problem most people miss</h2>
        <div className="grid gap-5 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Invisible salary replication</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-300">
              Every loan, tenant, or employment check can trigger new copies of your compensation history in downstream systems.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>No single removal workflow</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-300">
              Each verifier and broker has different requirements, making manual opt-outs slow and easy to postpone.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>High earners are targeted</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-300">
              Higher compensation records are commercially valuable and often prioritized by underwriting and recruitment tools.
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="space-y-8">
        <h2 className="font-[var(--font-space-grotesk)] text-3xl font-semibold text-white">How Salary Data Privacy helps</h2>
        <div className="grid gap-5 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Exposure scan</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-300">
              Calculates broker-specific salary exposure risk using your employer history, HR platforms, and recent loan or hiring activity.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Automated opt-outs</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-300">
              Generates and sends privacy requests via broker-specific email templates, with guided webform submission details.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Agreement monitoring</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-300">
              Flags newly observed data-sharing expansions so you can re-scan and respond before your next financial or career move.
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-950/70 p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="font-[var(--font-space-grotesk)] text-3xl font-semibold text-white">Simple pricing</h2>
            <p className="mt-2 text-slate-300">One plan for ongoing salary-data monitoring and opt-out workflows.</p>
          </div>
          <div className="text-right">
            <p className="font-[var(--font-space-grotesk)] text-4xl font-bold text-cyan-200">
              $12<span className="text-lg text-slate-400">/mo</span>
            </p>
            <p className="text-sm text-slate-400">Privacy-conscious professionals and recent job changers</p>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href={paymentLink} className={buttonVariants({ size: "lg" })}>
            Buy With Stripe
          </a>
          <Link href="/pricing" className={buttonVariants({ size: "lg", variant: "outline" })}>
            Compare details
          </Link>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="font-[var(--font-space-grotesk)] text-3xl font-semibold text-white">FAQ</h2>
        <div className="grid gap-4">
          {faqItems.map((item) => (
            <Card key={item.question}>
              <CardHeader>
                <CardTitle className="text-lg">{item.question}</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300">{item.answer}</CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
