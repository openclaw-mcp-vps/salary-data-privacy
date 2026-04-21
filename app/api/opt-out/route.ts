import nodemailer from "nodemailer";
import { NextResponse } from "next/server";
import { z } from "zod";

import { ACCESS_COOKIE_NAME, verifyAccessToken } from "@/lib/access";
import { recordOptOutRequest } from "@/lib/database";
import { DATA_BROKERS, generateOptOutEmailTemplate } from "@/lib/data-brokers";

export const runtime = "nodejs";

const optOutSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  currentEmployer: z.string().min(2),
  brokers: z.array(z.string().min(2)).min(1),
  sendEmails: z.boolean().default(false),
  autoSubmitWebforms: z.boolean().default(false)
});

function getMailerTransport() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || "587");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass || Number.isNaN(port)) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass
    }
  });
}

export async function POST(request: Request) {
  const accessToken = request.headers.get("cookie")
    ?.split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${ACCESS_COOKIE_NAME}=`))
    ?.replace(`${ACCESS_COOKIE_NAME}=`, "");

  const access = verifyAccessToken(accessToken);

  if (!access) {
    return NextResponse.json({ error: "Access denied." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = optOutSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid opt-out request.", details: parsed.error.flatten() }, { status: 400 });
  }

  if (parsed.data.email.trim().toLowerCase() !== access.email) {
    return NextResponse.json({ error: "Email does not match unlocked account." }, { status: 403 });
  }

  const transporter = parsed.data.sendEmails ? getMailerTransport() : null;
  const fromAddress = process.env.SMTP_FROM || process.env.SMTP_USER || "no-reply@salary-data-privacy.local";

  const results: Array<{
    brokerSlug: string;
    status: "sent" | "drafted" | "submitted" | "manual_review";
    detail: string;
    emailTemplate: string;
  }> = [];

  for (const brokerSlug of parsed.data.brokers) {
    const broker = DATA_BROKERS.find((item) => item.slug === brokerSlug);

    if (!broker) {
      continue;
    }

    const emailTemplate = generateOptOutEmailTemplate(
      {
        fullName: parsed.data.fullName,
        email: parsed.data.email,
        currentEmployer: parsed.data.currentEmployer
      },
      broker
    );

    if (broker.optOut.method === "email") {
      if (parsed.data.sendEmails && transporter && broker.optOut.email) {
        try {
          await transporter.sendMail({
            from: fromAddress,
            to: broker.optOut.email,
            subject: `Opt-Out Request - ${parsed.data.fullName}`,
            text: emailTemplate,
            replyTo: parsed.data.email
          });

          const detail = `Opt-out email sent to ${broker.optOut.email}.`;
          await recordOptOutRequest({
            email: parsed.data.email,
            brokerSlug,
            status: "sent",
            detail
          });
          results.push({ brokerSlug, status: "sent", detail, emailTemplate });
        } catch {
          const detail = "Email delivery failed. Draft kept so you can send manually.";
          await recordOptOutRequest({
            email: parsed.data.email,
            brokerSlug,
            status: "drafted",
            detail
          });
          results.push({ brokerSlug, status: "drafted", detail, emailTemplate });
        }
      } else {
        const detail = transporter
          ? `Draft ready for ${broker.optOut.email}. Enable sendEmails to dispatch automatically.`
          : "Draft generated. Configure SMTP to send automatically from this dashboard.";

        await recordOptOutRequest({
          email: parsed.data.email,
          brokerSlug,
          status: "drafted",
          detail
        });

        results.push({ brokerSlug, status: "drafted", detail, emailTemplate });
      }

      continue;
    }

    if (parsed.data.autoSubmitWebforms && broker.optOut.url) {
      try {
        const response = await fetch(broker.optOut.url, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: new URLSearchParams({
            full_name: parsed.data.fullName,
            email: parsed.data.email,
            employer: parsed.data.currentEmployer,
            request_type: "opt_out_salary_data"
          })
        });

        if (response.ok) {
          const detail = "Webform submission sent. Verify completion on the broker confirmation page.";
          await recordOptOutRequest({
            email: parsed.data.email,
            brokerSlug,
            status: "submitted",
            detail
          });
          results.push({ brokerSlug, status: "submitted", detail, emailTemplate });
          continue;
        }
      } catch {
        // fall through to manual review
      }
    }

    const detail = broker.optOut.url
      ? `Manual review required. Open ${broker.optOut.url} and paste the generated request details.`
      : "Manual review required for this broker's webform flow.";

    await recordOptOutRequest({
      email: parsed.data.email,
      brokerSlug,
      status: "manual_review",
      detail
    });

    results.push({ brokerSlug, status: "manual_review", detail, emailTemplate });
  }

  return NextResponse.json({
    results
  });
}
