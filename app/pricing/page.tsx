import type { Metadata } from "next";
import Link from "next/link";
import { LockKeyhole, ReceiptText, RefreshCcw } from "lucide-react";

import { PurchaseUnlockForm } from "@/components/PurchaseUnlockForm";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Start Salary Data Privacy for $12/month and unlock scans, opt-out automation, and agreement monitoring after Stripe checkout."
};

const paymentLink = process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK;

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-10 py-14">
      <section className="space-y-4 text-center">
        <h1 className="font-[var(--font-space-grotesk)] text-4xl font-semibold text-white">Protect your salary data in one workflow</h1>
        <p className="mx-auto max-w-2xl text-slate-300">
          Run targeted exposure scans, automate opt-out requests, and monitor new sharing agreements for the compensation data trail you cannot see today.
        </p>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <Card className="border-cyan-800/40">
          <CardHeader>
            <CardTitle className="font-[var(--font-space-grotesk)] text-3xl text-cyan-100">$12/month</CardTitle>
            <CardDescription>For privacy-conscious professionals and recent loan or job applicants.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-slate-300">
            <p className="flex items-start gap-2">
              <ReceiptText className="mt-0.5 h-4 w-4 text-cyan-300" />
              Unlimited salary exposure scans and risk scoring by broker category
            </p>
            <p className="flex items-start gap-2">
              <LockKeyhole className="mt-0.5 h-4 w-4 text-cyan-300" />
              One-click opt-out request generation with optional direct email sending
            </p>
            <p className="flex items-start gap-2">
              <RefreshCcw className="mt-0.5 h-4 w-4 text-cyan-300" />
              Ongoing monitoring for newly observed data-sharing expansions
            </p>
            <a href={paymentLink} className={buttonVariants({ size: "lg" }) + " w-full"}>
              Buy With Stripe
            </a>
            <p className="text-xs text-slate-500">
              Payment opens Stripe hosted checkout directly. After purchase, return here and unlock with your purchase email.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Unlock your dashboard</CardTitle>
            <CardDescription>
              Enter the email used at checkout to set your secure access cookie and open the paywalled dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <PurchaseUnlockForm />
            <Link href="/dashboard" className={buttonVariants({ variant: "ghost" }) + " w-full"}>
              Go to dashboard
            </Link>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
