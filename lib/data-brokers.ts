import { z } from "zod";

export const scanInputSchema = z.object({
  fullName: z.string().min(2, "Enter your legal name."),
  email: z.string().email("Enter a valid email address."),
  currentEmployer: z.string().min(2, "Enter your current employer."),
  previousEmployers: z.array(z.string().min(2)).max(12).default([]),
  state: z.string().min(2, "Enter your state or province."),
  hrPlatforms: z.array(z.string().min(2)).max(8).default([]),
  recentLoanApplication: z.boolean().default(false),
  recentJobChange: z.boolean().default(false)
});

export type ScanInput = z.infer<typeof scanInputSchema>;

export type BrokerCategory = "Data Broker" | "Employment Verification" | "Background Check";

export type DataBroker = {
  slug: string;
  name: string;
  category: BrokerCategory;
  description: string;
  baseRisk: number;
  loanSignalWeight: number;
  jobChangeWeight: number;
  hrSignalWeight: number;
  multiEmployerWeight: number;
  optOut: {
    method: "email" | "webform";
    url?: string;
    email?: string;
    requirements: string[];
  };
};

export type DataSharingAlert = {
  id: string;
  title: string;
  summary: string;
  source: string;
  effectiveDate: string;
  affectedBrokers: string[];
};

export type ScanFinding = {
  broker: DataBroker;
  riskScore: number;
  exposure: "High" | "Medium" | "Low";
  reasons: string[];
  recommendedAction: string;
  estimatedImpact: string;
  emailTemplate: string;
};

export type ScanSummary = {
  highRiskCount: number;
  mediumRiskCount: number;
  lowRiskCount: number;
  averageRisk: number;
};

export type ScanResult = {
  scannedAt: string;
  summary: ScanSummary;
  findings: ScanFinding[];
  newDataSharingAlerts: DataSharingAlert[];
};

const PRIVACY_PROTECTIVE_STATES = new Set(["ca", "co", "ct", "va", "ut", "tx"]);

export const DATA_BROKERS: DataBroker[] = [
  {
    slug: "equifax-the-work-number",
    name: "Equifax - The Work Number",
    category: "Employment Verification",
    description:
      "Payroll and employment verification exchange used by mortgage lenders, tenant-screening firms, and pre-employment screeners.",
    baseRisk: 72,
    loanSignalWeight: 16,
    jobChangeWeight: 12,
    hrSignalWeight: 14,
    multiEmployerWeight: 8,
    optOut: {
      method: "webform",
      url: "https://employees.theworknumber.com/employee-data-freeze",
      requirements: [
        "Government-issued ID",
        "Current mailing address",
        "Last four digits of SSN"
      ]
    }
  },
  {
    slug: "experian-verify",
    name: "Experian Verify",
    category: "Employment Verification",
    description:
      "Competes with payroll verifiers and supplies income confidence data into lending and identity decisioning flows.",
    baseRisk: 61,
    loanSignalWeight: 18,
    jobChangeWeight: 8,
    hrSignalWeight: 12,
    multiEmployerWeight: 7,
    optOut: {
      method: "email",
      email: "privacy@experian.com",
      requirements: ["Full legal name", "Date of birth", "Address history for two years"]
    }
  },
  {
    slug: "truv",
    name: "Truv",
    category: "Employment Verification",
    description:
      "Income and employment API used by fintech underwriting stacks for instant payroll-linked checks.",
    baseRisk: 56,
    loanSignalWeight: 20,
    jobChangeWeight: 6,
    hrSignalWeight: 14,
    multiEmployerWeight: 6,
    optOut: {
      method: "email",
      email: "privacy@truv.com",
      requirements: ["Legal name", "Email used for payroll login", "Employer name"]
    }
  },
  {
    slug: "truework",
    name: "Truework",
    category: "Employment Verification",
    description:
      "Verification service consumed by lenders, staffing firms, and property managers to validate salary and role tenure.",
    baseRisk: 64,
    loanSignalWeight: 15,
    jobChangeWeight: 12,
    hrSignalWeight: 10,
    multiEmployerWeight: 8,
    optOut: {
      method: "email",
      email: "privacy@truework.com",
      requirements: ["Legal name", "Employer names", "Phone number"]
    }
  },
  {
    slug: "lexisnexis-risk-solutions",
    name: "LexisNexis Risk Solutions",
    category: "Data Broker",
    description:
      "Data broker and risk intelligence network that aggregates employment-related data into broad consumer profiles.",
    baseRisk: 58,
    loanSignalWeight: 13,
    jobChangeWeight: 10,
    hrSignalWeight: 7,
    multiEmployerWeight: 13,
    optOut: {
      method: "webform",
      url: "https://consumer.risk.lexisnexis.com/request",
      requirements: ["Legal name", "Address", "DOB", "Identity verification"]
    }
  },
  {
    slug: "checkr",
    name: "Checkr",
    category: "Background Check",
    description:
      "Background screening provider that can ingest employment history and compensation context during candidate checks.",
    baseRisk: 47,
    loanSignalWeight: 4,
    jobChangeWeight: 21,
    hrSignalWeight: 5,
    multiEmployerWeight: 10,
    optOut: {
      method: "email",
      email: "privacy@checkr.com",
      requirements: ["Legal name", "Email", "Phone number", "Address"]
    }
  },
  {
    slug: "hireright",
    name: "HireRight",
    category: "Background Check",
    description:
      "Pre-employment screening platform frequently used during role changes and compensation negotiations.",
    baseRisk: 45,
    loanSignalWeight: 5,
    jobChangeWeight: 23,
    hrSignalWeight: 6,
    multiEmployerWeight: 9,
    optOut: {
      method: "email",
      email: "privacy@hireright.com",
      requirements: ["Legal name", "Employer involved in screening", "Address"]
    }
  },
  {
    slug: "idi-core",
    name: "IDI Core",
    category: "Data Broker",
    description:
      "Consumer intelligence broker providing identity and employment-linked enrichment to enterprise clients.",
    baseRisk: 51,
    loanSignalWeight: 11,
    jobChangeWeight: 8,
    hrSignalWeight: 8,
    multiEmployerWeight: 14,
    optOut: {
      method: "webform",
      url: "https://www.ididata.com/opt-out/",
      requirements: ["Legal name", "Address", "Date of birth"]
    }
  }
];

export const DATA_SHARING_ALERTS: DataSharingAlert[] = [
  {
    id: "2026-q1-mortgage-aggregator",
    title: "Verification feeds expanded into regional mortgage underwriting networks",
    summary:
      "Several payroll verification partners expanded reseller access for automated debt-to-income checks, increasing salary-data reach to secondary mortgage processors.",
    source: "Public partner notices and lender integration updates",
    effectiveDate: "2026-02-14",
    affectedBrokers: ["equifax-the-work-number", "truv", "truework"]
  },
  {
    id: "2026-q1-screening-bundle",
    title: "Background screening bundles added compensation-adjacent verification fields",
    summary:
      "New screening bundles now package role tenure and compensation-band verification in one workflow offered to hiring platforms.",
    source: "Vendor release notes and procurement announcements",
    effectiveDate: "2026-03-28",
    affectedBrokers: ["checkr", "hireright", "experian-verify"]
  }
];

function clampRisk(score: number) {
  return Math.max(0, Math.min(100, Math.round(score)));
}

function toExposure(score: number): ScanFinding["exposure"] {
  if (score >= 70) {
    return "High";
  }

  if (score >= 45) {
    return "Medium";
  }

  return "Low";
}

function calculateBrokerRisk(input: ScanInput, broker: DataBroker) {
  const reasons: string[] = [];
  let risk = broker.baseRisk;

  if (input.recentLoanApplication) {
    risk += broker.loanSignalWeight;
    reasons.push("Recent loan activity raises the odds this broker received salary verification requests.");
  }

  if (input.recentJobChange) {
    risk += broker.jobChangeWeight;
    reasons.push("Recent job changes commonly trigger background and employment verification pulls.");
  }

  if (input.hrPlatforms.length > 0) {
    risk += broker.hrSignalWeight;
    reasons.push("Third-party HR platform usage increases possible payroll data syndication pathways.");
  }

  if (input.previousEmployers.length > 0) {
    risk += broker.multiEmployerWeight;
    reasons.push("Multiple employers increase the number of historical payroll records that can be linked.");
  }

  const normalizedState = input.state.trim().toLowerCase();
  if (PRIVACY_PROTECTIVE_STATES.has(normalizedState)) {
    risk -= 7;
    reasons.push("State-level privacy protections may reduce exposure but do not eliminate broker resale.");
  } else {
    risk += 4;
    reasons.push("Weaker state privacy rights typically lead to broader downstream salary data reuse.");
  }

  const score = clampRisk(risk);

  return {
    score,
    reasons
  };
}

function getRecommendedAction(exposure: ScanFinding["exposure"], broker: DataBroker) {
  if (broker.optOut.method === "webform") {
    if (exposure === "High") {
      return "Submit a freeze/opt-out request today and schedule a 30-day verification rescan.";
    }

    return "Queue a webform opt-out and confirm removal status after your next scan cycle.";
  }

  if (exposure === "High") {
    return "Send an immediate deletion request by email and retain confirmation receipts.";
  }

  return "Generate the email opt-out template now and send it before your next credit or job application.";
}

function getEstimatedImpact(exposure: ScanFinding["exposure"]) {
  if (exposure === "High") {
    return "High probability of salary data affecting lender pricing, insurance underwriting, or recruiter benchmarking.";
  }

  if (exposure === "Medium") {
    return "Moderate probability of salary history being referenced in selected credit and screening decisions.";
  }

  return "Lower immediate risk, but profile linkage can expand quickly after new financial or employment events.";
}

export function generateOptOutEmailTemplate(input: Pick<ScanInput, "fullName" | "email" | "currentEmployer">, broker: DataBroker) {
  return [
    `Subject: Opt-Out and Data Deletion Request - ${input.fullName}`,
    "",
    `To the ${broker.name} Privacy Team,`,
    "",
    `I am requesting an opt-out from all salary and employment-data sharing, resale, and processing connected to my profile.`,
    "",
    "Please treat this as a formal request to:",
    "1. Disclose every source and recipient that has accessed or purchased my compensation-related data.",
    "2. Stop sharing my salary history and verification data with any third party.",
    "3. Delete non-required salary and employment records tied to my identity.",
    "4. Confirm completion of this request in writing.",
    "",
    "Identity details:",
    `- Full name: ${input.fullName}`,
    `- Email: ${input.email}`,
    `- Current employer: ${input.currentEmployer}`,
    "",
    "If additional verification is needed, reply with your required secure process.",
    "",
    "Regards,",
    input.fullName
  ].join("\n");
}

export function monitorNewDataSharingAgreements(lastScanAt?: string | null) {
  if (!lastScanAt) {
    return DATA_SHARING_ALERTS;
  }

  const last = new Date(lastScanAt);
  if (Number.isNaN(last.getTime())) {
    return DATA_SHARING_ALERTS;
  }

  return DATA_SHARING_ALERTS.filter((alert) => new Date(alert.effectiveDate) > last);
}

export function runSalaryExposureScan(input: ScanInput, lastScanAt?: string | null): ScanResult {
  const findings: ScanFinding[] = DATA_BROKERS.map((broker) => {
    const { score, reasons } = calculateBrokerRisk(input, broker);
    const exposure = toExposure(score);

    return {
      broker,
      riskScore: score,
      exposure,
      reasons,
      recommendedAction: getRecommendedAction(exposure, broker),
      estimatedImpact: getEstimatedImpact(exposure),
      emailTemplate: generateOptOutEmailTemplate(input, broker)
    };
  }).sort((a, b) => b.riskScore - a.riskScore);

  const summary: ScanSummary = {
    highRiskCount: findings.filter((item) => item.exposure === "High").length,
    mediumRiskCount: findings.filter((item) => item.exposure === "Medium").length,
    lowRiskCount: findings.filter((item) => item.exposure === "Low").length,
    averageRisk: Math.round(findings.reduce((sum, finding) => sum + finding.riskScore, 0) / findings.length)
  };

  return {
    scannedAt: new Date().toISOString(),
    findings,
    summary,
    newDataSharingAlerts: monitorNewDataSharingAgreements(lastScanAt)
  };
}
