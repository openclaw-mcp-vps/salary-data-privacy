import { createHmac, timingSafeEqual } from "node:crypto";

export type StripeWebhookEvent = {
  id: string;
  type: string;
  data: {
    object: Record<string, unknown>;
  };
};

function parseStripeSignatureHeader(signatureHeader: string) {
  const entries = signatureHeader.split(",").map((item) => item.trim());

  const timestamp = entries.find((entry) => entry.startsWith("t="))?.replace("t=", "");
  const signatures = entries
    .filter((entry) => entry.startsWith("v1="))
    .map((entry) => entry.replace("v1=", ""))
    .filter(Boolean);

  return {
    timestamp,
    signatures
  };
}

export function verifyStripeWebhookSignature(payload: string, signatureHeader: string | null, secret: string) {
  if (!signatureHeader || !secret) {
    return false;
  }

  const { timestamp, signatures } = parseStripeSignatureHeader(signatureHeader);
  if (!timestamp || signatures.length === 0) {
    return false;
  }

  const timestampNumber = Number(timestamp);
  if (Number.isNaN(timestampNumber)) {
    return false;
  }

  const ageInSeconds = Math.abs(Math.floor(Date.now() / 1000) - timestampNumber);
  if (ageInSeconds > 300) {
    return false;
  }

  const signedPayload = `${timestamp}.${payload}`;
  const expectedSignature = createHmac("sha256", secret).update(signedPayload).digest("hex");
  const expectedBuffer = Buffer.from(expectedSignature, "utf8");

  return signatures.some((signature) => {
    const signatureBuffer = Buffer.from(signature, "utf8");

    if (signatureBuffer.length !== expectedBuffer.length) {
      return false;
    }

    return timingSafeEqual(signatureBuffer, expectedBuffer);
  });
}

export function parseStripeWebhookEvent(payload: string) {
  try {
    return JSON.parse(payload) as StripeWebhookEvent;
  } catch {
    return null;
  }
}

export function extractCheckoutEmail(event: StripeWebhookEvent) {
  const object = event.data.object;

  const customerDetails = object.customer_details as { email?: string } | undefined;
  if (customerDetails?.email) {
    return customerDetails.email;
  }

  const customerEmail = object.customer_email as string | undefined;
  if (customerEmail) {
    return customerEmail;
  }

  return null;
}
