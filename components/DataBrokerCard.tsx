import { ExternalLink } from "lucide-react";

import type { ScanFinding } from "@/lib/data-brokers";
import { OptOutButton } from "@/components/OptOutButton";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

type DataBrokerCardProps = {
  finding: ScanFinding;
  fullName: string;
  email: string;
  currentEmployer: string;
};

function getExposureVariant(exposure: ScanFinding["exposure"]) {
  if (exposure === "High") {
    return "danger" as const;
  }

  if (exposure === "Medium") {
    return "warning" as const;
  }

  return "muted" as const;
}

export function DataBrokerCard({ finding, fullName, email, currentEmployer }: DataBrokerCardProps) {
  return (
    <Card>
      <CardHeader className="gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle className="text-xl">{finding.broker.name}</CardTitle>
          <Badge variant={getExposureVariant(finding.exposure)}>
            {finding.exposure} risk ({finding.riskScore}/100)
          </Badge>
        </div>
        <CardDescription>{finding.broker.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-sm text-slate-300">
        <p>
          <span className="font-semibold text-slate-100">Category:</span> {finding.broker.category}
        </p>
        <div>
          <p className="font-semibold text-slate-100">Why this broker was flagged</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-300">
            {finding.reasons.map((reason) => (
              <li key={reason}>{reason}</li>
            ))}
          </ul>
        </div>
        <p>
          <span className="font-semibold text-slate-100">Recommended action:</span> {finding.recommendedAction}
        </p>
        <p>
          <span className="font-semibold text-slate-100">Expected impact:</span> {finding.estimatedImpact}
        </p>

        {finding.broker.optOut.url ? (
          <a
            href={finding.broker.optOut.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-cyan-300 underline-offset-4 hover:underline"
          >
            Open broker opt-out page
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        ) : null}

        <div className="space-y-2">
          <p className="font-semibold text-slate-100">Generated request template</p>
          <Textarea value={finding.emailTemplate} readOnly className="min-h-[210px]" />
        </div>

        <OptOutButton brokerSlug={finding.broker.slug} fullName={fullName} email={email} currentEmployer={currentEmployer} />
      </CardContent>
    </Card>
  );
}
