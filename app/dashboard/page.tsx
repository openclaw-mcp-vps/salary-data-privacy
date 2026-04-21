import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ScanResults } from "@/components/ScanResults";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ACCESS_COOKIE_NAME, verifyAccessToken } from "@/lib/access";
import { listRecentScansByEmail } from "@/lib/database";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "View salary-data exposure findings, monitor new sharing agreements, and automate opt-out requests."
};

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_COOKIE_NAME)?.value;
  const access = verifyAccessToken(accessToken);

  if (!access) {
    redirect("/pricing");
  }

  const recentScans = await listRecentScansByEmail(access.email);

  return (
    <div className="space-y-8 py-10">
      <Card className="border-cyan-900/30">
        <CardHeader>
          <CardTitle className="font-[var(--font-space-grotesk)] text-3xl text-white">Salary data control center</CardTitle>
        </CardHeader>
        <CardContent className="text-slate-300">
          Monitor where your compensation data may be circulating, trigger opt-out requests, and watch for new broker-sharing expansions.
        </CardContent>
      </Card>

      <ScanResults email={access.email} recentScans={recentScans} />
    </div>
  );
}
