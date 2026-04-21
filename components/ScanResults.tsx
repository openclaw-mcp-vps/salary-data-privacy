"use client";

import { type FormEvent, useMemo, useState } from "react";
import { AlertTriangle, Radar } from "lucide-react";

import type { ScanResult } from "@/lib/data-brokers";
import { DataBrokerCard } from "@/components/DataBrokerCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type ScanRecordPreview = {
  id: string;
  fullName: string;
  createdAt: string;
  input: {
    currentEmployer: string;
    previousEmployers: string[];
    state: string;
    hrPlatforms: string[];
    recentLoanApplication: boolean;
    recentJobChange: boolean;
  };
  result: ScanResult;
};

type ScanResultsProps = {
  email: string;
  recentScans: ScanRecordPreview[];
};

export function ScanResults({ email, recentScans }: ScanResultsProps) {
  const latestExisting = recentScans[0] ?? null;

  const [fullName, setFullName] = useState(latestExisting?.fullName || "");
  const [currentEmployer, setCurrentEmployer] = useState(latestExisting?.input.currentEmployer || "");
  const [previousEmployersText, setPreviousEmployersText] = useState(latestExisting?.input.previousEmployers.join(", ") || "");
  const [stateRegion, setStateRegion] = useState(latestExisting?.input.state || "");
  const [hrPlatformsText, setHrPlatformsText] = useState(latestExisting?.input.hrPlatforms.join(", ") || "workday, adp");
  const [recentLoanApplication, setRecentLoanApplication] = useState(latestExisting?.input.recentLoanApplication || false);
  const [recentJobChange, setRecentJobChange] = useState(latestExisting?.input.recentJobChange || false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<ScanResult | null>(latestExisting?.result || null);
  const [scanTimestamp, setScanTimestamp] = useState<string | null>(latestExisting?.createdAt || null);

  const scanHistoryItems = useMemo(() => {
    return recentScans.slice(0, 4).map((scan) => ({
      id: scan.id,
      createdAt: new Date(scan.createdAt).toLocaleString(),
      averageRisk: scan.result.summary.averageRisk,
      highRiskCount: scan.result.summary.highRiskCount
    }));
  }, [recentScans]);

  async function runScan(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/scan-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          fullName,
          email,
          currentEmployer,
          previousEmployers: previousEmployersText
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
          state: stateRegion,
          hrPlatforms: hrPlatformsText
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
          recentLoanApplication,
          recentJobChange
        })
      });

      const payload = (await response.json()) as {
        error?: string;
        scan?: { createdAt: string; result: ScanResult };
      };

      if (!response.ok || !payload.scan) {
        setError(payload.error || "Could not complete scan.");
        return;
      }

      setResult(payload.scan.result);
      setScanTimestamp(payload.scan.createdAt);
    } catch {
      setError("Network error while running the scan.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-[var(--font-space-grotesk)] text-2xl">Run salary exposure scan</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={runScan} className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="full-name" className="text-sm text-slate-300">
                Full name
              </label>
              <Input id="full-name" value={fullName} onChange={(event) => setFullName(event.target.value)} required />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm text-slate-300">
                Email
              </label>
              <Input id="email" value={email} readOnly disabled />
            </div>

            <div className="space-y-2">
              <label htmlFor="current-employer" className="text-sm text-slate-300">
                Current employer
              </label>
              <Input
                id="current-employer"
                value={currentEmployer}
                onChange={(event) => setCurrentEmployer(event.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="state" className="text-sm text-slate-300">
                State or province
              </label>
              <Input id="state" value={stateRegion} onChange={(event) => setStateRegion(event.target.value)} required />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <label htmlFor="prev-employers" className="text-sm text-slate-300">
                Previous employers (comma-separated)
              </label>
              <Input
                id="prev-employers"
                value={previousEmployersText}
                onChange={(event) => setPreviousEmployersText(event.target.value)}
                placeholder="Acme Corp, Northwind Financial"
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <label htmlFor="hr-platforms" className="text-sm text-slate-300">
                HR platforms seen in your payroll/onboarding flow (comma-separated)
              </label>
              <Input
                id="hr-platforms"
                value={hrPlatformsText}
                onChange={(event) => setHrPlatformsText(event.target.value)}
                placeholder="workday, adp, ukg"
              />
            </div>

            <label className="flex items-center gap-2 text-sm text-slate-300">
              <input
                type="checkbox"
                checked={recentLoanApplication}
                onChange={(event) => setRecentLoanApplication(event.target.checked)}
                className="h-4 w-4 rounded border-slate-600 bg-slate-900"
              />
              I applied for a loan in the last 12 months
            </label>

            <label className="flex items-center gap-2 text-sm text-slate-300">
              <input
                type="checkbox"
                checked={recentJobChange}
                onChange={(event) => setRecentJobChange(event.target.checked)}
                className="h-4 w-4 rounded border-slate-600 bg-slate-900"
              />
              I changed jobs recently
            </label>

            <div className="sm:col-span-2">
              <Button type="submit" disabled={loading}>
                {loading ? "Scanning salary data exposure..." : "Run scan"}
              </Button>
            </div>

            {error ? <p className="sm:col-span-2 text-sm text-rose-300">{error}</p> : null}
          </form>
        </CardContent>
      </Card>

      {result ? (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Radar className="h-5 w-5 text-cyan-300" />
                Latest scan summary
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <SummaryStat label="High risk brokers" value={result.summary.highRiskCount.toString()} emphasis="high" />
              <SummaryStat label="Medium risk brokers" value={result.summary.mediumRiskCount.toString()} emphasis="medium" />
              <SummaryStat label="Low risk brokers" value={result.summary.lowRiskCount.toString()} emphasis="low" />
              <SummaryStat label="Average risk" value={`${result.summary.averageRisk}/100`} emphasis="neutral" />
              <p className="sm:col-span-2 lg:col-span-4 text-xs text-slate-400">
                Last scanned: {scanTimestamp ? new Date(scanTimestamp).toLocaleString() : new Date(result.scannedAt).toLocaleString()}
              </p>
            </CardContent>
          </Card>

          {result.newDataSharingAlerts.length > 0 ? (
            <Card className="border-amber-700/40">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg text-amber-200">
                  <AlertTriangle className="h-5 w-5" />
                  New data-sharing alerts since your last scan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-300">
                {result.newDataSharingAlerts.map((alert) => (
                  <div key={alert.id} className="rounded-lg border border-amber-800/30 bg-amber-950/20 p-3">
                    <p className="font-medium text-amber-100">{alert.title}</p>
                    <p className="mt-1 text-slate-300">{alert.summary}</p>
                    <p className="mt-1 text-xs text-slate-400">
                      Effective {new Date(alert.effectiveDate).toLocaleDateString()} - {alert.source}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          ) : null}

          <div className="space-y-4">
            {result.findings.map((finding) => (
              <DataBrokerCard
                key={finding.broker.slug}
                finding={finding}
                fullName={fullName}
                email={email}
                currentEmployer={currentEmployer}
              />
            ))}
          </div>
        </div>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent scans</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-slate-300">
          {scanHistoryItems.length === 0 ? (
            <p>No previous scans yet.</p>
          ) : (
            scanHistoryItems.map((item) => (
              <div key={item.id} className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-slate-800 px-3 py-2">
                <p>{item.createdAt}</p>
                <div className="flex items-center gap-2">
                  <Badge variant="warning">High risk: {item.highRiskCount}</Badge>
                  <Badge variant="secondary">Avg: {item.averageRisk}/100</Badge>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}

type SummaryStatProps = {
  label: string;
  value: string;
  emphasis: "high" | "medium" | "low" | "neutral";
};

function SummaryStat({ label, value, emphasis }: SummaryStatProps) {
  const emphasisClasses = {
    high: "border-rose-700/40 bg-rose-950/20 text-rose-200",
    medium: "border-amber-700/40 bg-amber-950/20 text-amber-200",
    low: "border-emerald-700/40 bg-emerald-950/20 text-emerald-200",
    neutral: "border-slate-700 bg-slate-900 text-slate-200"
  };

  return (
    <div className={`rounded-lg border p-3 ${emphasisClasses[emphasis]}`}>
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 font-[var(--font-space-grotesk)] text-2xl font-semibold">{value}</p>
    </div>
  );
}
