"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

type OptOutButtonProps = {
  brokerSlug: string;
  fullName: string;
  email: string;
  currentEmployer: string;
};

export function OptOutButton({ brokerSlug, fullName, email, currentEmployer }: OptOutButtonProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleClick() {
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/opt-out", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          fullName,
          email,
          currentEmployer,
          brokers: [brokerSlug],
          sendEmails: true,
          autoSubmitWebforms: false
        })
      });

      const payload = (await response.json()) as {
        error?: string;
        results?: Array<{ status: string; detail: string }>;
      };

      if (!response.ok) {
        setStatus("error");
        setMessage(payload.error || "Failed to run opt-out action.");
        return;
      }

      const result = payload.results?.[0];
      if (!result) {
        setStatus("error");
        setMessage("No opt-out result returned.");
        return;
      }

      setStatus("done");
      setMessage(result.detail);
    } catch {
      setStatus("error");
      setMessage("Request failed. Try again.");
    }
  }

  return (
    <div className="space-y-2">
      <Button onClick={handleClick} disabled={status === "loading"} variant="outline">
        {status === "loading" ? "Processing opt-out..." : "Automate opt-out"}
      </Button>
      {status === "done" ? <p className="text-xs text-emerald-300">{message}</p> : null}
      {status === "error" ? <p className="text-xs text-rose-300">{message}</p> : null}
    </div>
  );
}
