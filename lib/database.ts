import { randomUUID } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";

import type { ScanInput, ScanResult } from "@/lib/data-brokers";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "salary-privacy-db.json");

type PurchaseRecord = {
  id: string;
  email: string;
  amountTotal?: number;
  currency?: string;
  customerName?: string;
  stripeSessionId?: string;
  paymentStatus: "paid" | "unpaid";
  createdAt: string;
  updatedAt: string;
};

type ScanRecord = {
  id: string;
  email: string;
  fullName: string;
  input: ScanInput;
  result: ScanResult;
  createdAt: string;
};

type OptOutRecord = {
  id: string;
  email: string;
  brokerSlug: string;
  status: "sent" | "drafted" | "submitted" | "manual_review";
  detail: string;
  createdAt: string;
};

type DatabaseShape = {
  purchases: PurchaseRecord[];
  scans: ScanRecord[];
  optOutRequests: OptOutRecord[];
};

let writeQueue: Promise<void> = Promise.resolve();

const EMPTY_DATABASE: DatabaseShape = {
  purchases: [],
  scans: [],
  optOutRequests: []
};

async function ensureDatabase() {
  await fs.mkdir(DATA_DIR, { recursive: true });

  try {
    await fs.access(DB_FILE);
  } catch {
    await fs.writeFile(DB_FILE, JSON.stringify(EMPTY_DATABASE, null, 2), "utf8");
  }
}

async function readDatabase(): Promise<DatabaseShape> {
  await ensureDatabase();
  const raw = await fs.readFile(DB_FILE, "utf8");

  try {
    const parsed = JSON.parse(raw) as DatabaseShape;

    return {
      purchases: parsed.purchases ?? [],
      scans: parsed.scans ?? [],
      optOutRequests: parsed.optOutRequests ?? []
    };
  } catch {
    return EMPTY_DATABASE;
  }
}

async function writeDatabase(data: DatabaseShape) {
  await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2), "utf8");
}

async function mutateDatabase<T>(mutator: (database: DatabaseShape) => T | Promise<T>): Promise<T> {
  const holder: { value?: T } = {};

  writeQueue = writeQueue.then(async () => {
    const database = await readDatabase();
    holder.value = await mutator(database);
    await writeDatabase(database);
  });

  await writeQueue;

  return holder.value as T;
}

export async function recordPurchase(input: {
  email: string;
  paymentStatus: "paid" | "unpaid";
  stripeSessionId?: string;
  customerName?: string;
  amountTotal?: number;
  currency?: string;
}) {
  const normalizedEmail = input.email.trim().toLowerCase();
  const now = new Date().toISOString();

  return mutateDatabase((database) => {
    const existing = database.purchases.find(
      (item) => item.stripeSessionId && input.stripeSessionId && item.stripeSessionId === input.stripeSessionId
    );

    if (existing) {
      existing.paymentStatus = input.paymentStatus;
      existing.customerName = input.customerName ?? existing.customerName;
      existing.amountTotal = input.amountTotal ?? existing.amountTotal;
      existing.currency = input.currency ?? existing.currency;
      existing.updatedAt = now;
      return existing;
    }

    const record: PurchaseRecord = {
      id: randomUUID(),
      email: normalizedEmail,
      paymentStatus: input.paymentStatus,
      stripeSessionId: input.stripeSessionId,
      customerName: input.customerName,
      amountTotal: input.amountTotal,
      currency: input.currency,
      createdAt: now,
      updatedAt: now
    };

    database.purchases.push(record);

    return record;
  });
}

export async function findPaidPurchaseByEmail(email: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const database = await readDatabase();

  return database.purchases
    .filter((item) => item.email === normalizedEmail && item.paymentStatus === "paid")
    .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))[0];
}

export async function saveScanResult(input: {
  email: string;
  fullName: string;
  scanInput: ScanInput;
  result: ScanResult;
}) {
  const normalizedEmail = input.email.trim().toLowerCase();

  return mutateDatabase((database) => {
    const record: ScanRecord = {
      id: randomUUID(),
      email: normalizedEmail,
      fullName: input.fullName,
      input: input.scanInput,
      result: input.result,
      createdAt: new Date().toISOString()
    };

    database.scans.unshift(record);
    database.scans = database.scans.slice(0, 150);

    return record;
  });
}

export async function getLatestScanByEmail(email: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const database = await readDatabase();

  return database.scans.find((record) => record.email === normalizedEmail) || null;
}

export async function listRecentScansByEmail(email: string, limit = 5) {
  const normalizedEmail = email.trim().toLowerCase();
  const database = await readDatabase();

  return database.scans.filter((record) => record.email === normalizedEmail).slice(0, limit);
}

export async function recordOptOutRequest(input: {
  email: string;
  brokerSlug: string;
  status: OptOutRecord["status"];
  detail: string;
}) {
  const normalizedEmail = input.email.trim().toLowerCase();

  return mutateDatabase((database) => {
    const record: OptOutRecord = {
      id: randomUUID(),
      email: normalizedEmail,
      brokerSlug: input.brokerSlug,
      status: input.status,
      detail: input.detail,
      createdAt: new Date().toISOString()
    };

    database.optOutRequests.unshift(record);
    database.optOutRequests = database.optOutRequests.slice(0, 400);

    return record;
  });
}
