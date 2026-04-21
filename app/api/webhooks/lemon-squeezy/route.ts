import { NextResponse } from "next/server";

import { recordPurchase } from "@/lib/database";
import { extractCheckoutEmail, parseStripeWebhookEvent, verifyStripeWebhookSignature } from "@/lib/lemon-squeezy";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Missing STRIPE_WEBHOOK_SECRET." }, { status: 500 });
  }

  const payload = await request.text();
  const signature = request.headers.get("stripe-signature");

  const isValid = verifyStripeWebhookSignature(payload, signature, secret);
  if (!isValid) {
    return NextResponse.json({ error: "Invalid Stripe signature." }, { status: 400 });
  }

  const event = parseStripeWebhookEvent(payload);
  if (!event) {
    return NextResponse.json({ error: "Invalid webhook payload." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
    const email = extractCheckoutEmail(event);

    if (email) {
      const object = event.data.object;
      const amountTotal = typeof object.amount_total === "number" ? object.amount_total : undefined;
      const currency = typeof object.currency === "string" ? object.currency : undefined;
      const customerDetails = object.customer_details as { name?: string } | undefined;
      const stripeSessionId = typeof object.id === "string" ? object.id : undefined;

      await recordPurchase({
        email,
        paymentStatus: "paid",
        amountTotal,
        currency,
        customerName: customerDetails?.name,
        stripeSessionId
      });
    }
  }

  return NextResponse.json({ received: true });
}
