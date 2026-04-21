import { NextResponse } from "next/server";

import { ACCESS_COOKIE_NAME, verifyAccessToken } from "@/lib/access";
import { getLatestScanByEmail, saveScanResult } from "@/lib/database";
import { runSalaryExposureScan, scanInputSchema } from "@/lib/data-brokers";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const accessToken = request.headers.get("cookie")
    ?.split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${ACCESS_COOKIE_NAME}=`))
    ?.replace(`${ACCESS_COOKIE_NAME}=`, "");

  const access = verifyAccessToken(accessToken);

  if (!access) {
    return NextResponse.json({ error: "Access denied. Unlock dashboard first." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsedInput = scanInputSchema.safeParse(body);

  if (!parsedInput.success) {
    return NextResponse.json(
      {
        error: "Invalid scan input.",
        details: parsedInput.error.flatten()
      },
      { status: 400 }
    );
  }

  if (parsedInput.data.email.trim().toLowerCase() !== access.email) {
    return NextResponse.json({ error: "You can only scan data for your unlocked purchase email." }, { status: 403 });
  }

  const lastScan = await getLatestScanByEmail(access.email);
  const result = runSalaryExposureScan(parsedInput.data, lastScan?.createdAt ?? null);

  const scan = await saveScanResult({
    email: parsedInput.data.email,
    fullName: parsedInput.data.fullName,
    scanInput: parsedInput.data,
    result
  });

  return NextResponse.json({
    scan
  });
}
