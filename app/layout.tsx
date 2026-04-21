import type { Metadata } from "next";
import { Space_Grotesk, Source_Sans_3 } from "next/font/google";
import Link from "next/link";

import "@/app/globals.css";

const headingFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap"
});

const bodyFont = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans",
  display: "swap"
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://salary-data-privacy.example.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Salary Data Privacy | Check and control who sees your salary data",
    template: "%s | Salary Data Privacy"
  },
  description:
    "See which companies and data brokers can access your salary history, send opt-out requests, and monitor new salary-data sharing agreements.",
  openGraph: {
    title: "Salary Data Privacy",
    description:
      "Audit your salary-data exposure, automate opt-outs, and monitor broker activity before it affects rates or negotiations.",
    type: "website",
    url: siteUrl,
    siteName: "Salary Data Privacy"
  },
  twitter: {
    card: "summary_large_image",
    title: "Salary Data Privacy",
    description:
      "Check and control who sees your salary data before it affects loans, insurance, or job negotiations."
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${headingFont.variable} ${bodyFont.variable} bg-[#0d1117] text-slate-100 antialiased`}>
        <div className="mx-auto min-h-screen w-full max-w-6xl px-4 pb-12 sm:px-6 lg:px-8">
          <header className="sticky top-0 z-40 border-b border-slate-800/70 bg-[#0d1117]/90 backdrop-blur">
            <div className="mx-auto flex h-16 w-full items-center justify-between">
              <Link href="/" className="font-[var(--font-space-grotesk)] text-lg font-semibold tracking-tight">
                Salary Data Privacy
              </Link>
              <nav className="flex items-center gap-5 text-sm text-slate-300">
                <Link href="/pricing" className="transition-colors hover:text-cyan-300">
                  Pricing
                </Link>
                <Link href="/dashboard" className="transition-colors hover:text-cyan-300">
                  Dashboard
                </Link>
              </nav>
            </div>
          </header>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
