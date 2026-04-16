import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SalaryShield — Check and control who sees your salary data",
  description: "Scan job sites, salary databases, and data brokers to find where your salary information appears publicly. Track exposure, request removals, and monitor ongoing privacy."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#0d1117] text-[#c9d1d9] antialiased">{children}</body>
    </html>
  );
}
