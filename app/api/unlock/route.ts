import { NextResponse } from "next/server";
import { z } from "zod";

import { ACCESS_COOKIE_MAX_AGE_SECONDS, ACCESS_COOKIE_NAME, createAccessToken } from "@/lib/access";
import { findPaidPurchaseByEmail } from "@/lib/database";

export const runtime = "nodejs";

const unlockSchema = z.object({
  email: z.string().email()
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = unlockSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Enter a valid purchase email address." }, { status: 400 });
  }

  const purchase = await findPaidPurchaseByEmail(parsed.data.email);

  if (!purchase) {
    return NextResponse.json(
      {
        error:
          "No paid purchase found for that email yet. Complete checkout first, or wait a minute for webhook processing before retrying."
      },
      { status: 404 }
    );
  }

  const token = createAccessToken(parsed.data.email);

  const response = NextResponse.json({
    message: "Purchase verified. Dashboard access is now unlocked for this browser."
  });

  response.cookies.set({
    name: ACCESS_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ACCESS_COOKIE_MAX_AGE_SECONDS
  });

  return response;
}
