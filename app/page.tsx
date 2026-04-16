export default function Page() {
  const checkoutUrl = process.env.NEXT_PUBLIC_LS_CHECKOUT_URL || "#";

  return (
    <main className="min-h-screen bg-[#0d1117] text-[#c9d1d9]">
      {/* Nav */}
      <nav className="border-b border-[#21262d] px-6 py-4 flex items-center justify-between max-w-5xl mx-auto">
        <span className="text-[#58a6ff] font-bold text-lg tracking-tight">SalaryShield</span>
        <a href={checkoutUrl} className="bg-[#58a6ff] text-[#0d1117] text-sm font-semibold px-4 py-2 rounded-md hover:bg-[#79b8ff] transition-colors">
          Get Started
        </a>
      </nav>

      {/* Hero */}
      <section className="max-w-3xl mx-auto px-6 pt-20 pb-16 text-center">
        <span className="inline-block bg-[#161b22] border border-[#21262d] text-[#58a6ff] text-xs font-medium px-3 py-1 rounded-full mb-6">
          Privacy Tools for Professionals
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight mb-5">
          Check and control<br />who sees your salary data
        </h1>
        <p className="text-[#8b949e] text-lg mb-8 max-w-xl mx-auto">
          Your salary is showing up on job sites, data brokers, and salary databases — without your consent. SalaryShield finds every exposure and helps you remove it.
        </p>
        <a href={checkoutUrl} className="inline-block bg-[#58a6ff] text-[#0d1117] font-bold text-base px-8 py-3 rounded-lg hover:bg-[#79b8ff] transition-colors shadow-lg">
          Start Protecting for $12/mo
        </a>
        <p className="text-[#8b949e] text-sm mt-3">Cancel anytime. No contracts.</p>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-3 mt-10">
          {["Automated scans", "Removal requests", "Breach alerts", "Broker monitoring", "Exposure reports"].map((f) => (
            <span key={f} className="bg-[#161b22] border border-[#21262d] text-[#c9d1d9] text-sm px-4 py-1.5 rounded-full">{f}</span>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            { step: "01", title: "Scan", desc: "We search 50+ job sites, salary databases, and data brokers for your information." },
            { step: "02", title: "Review", desc: "See exactly where your salary data appears and how exposed you are." },
            { step: "03", title: "Remove", desc: "We send automated removal requests and track progress until your data is gone." }
          ].map((item) => (
            <div key={item.step} className="bg-[#161b22] border border-[#21262d] rounded-xl p-6">
              <div className="text-[#58a6ff] text-xs font-bold mb-2">{item.step}</div>
              <div className="text-white font-semibold text-lg mb-2">{item.title}</div>
              <div className="text-[#8b949e] text-sm">{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-md mx-auto px-6 pb-20" id="pricing">
        <h2 className="text-2xl font-bold text-white text-center mb-8">Simple, transparent pricing</h2>
        <div className="bg-[#161b22] border border-[#58a6ff] rounded-2xl p-8 text-center shadow-xl">
          <div className="text-[#58a6ff] text-sm font-semibold uppercase tracking-widest mb-2">Pro Plan</div>
          <div className="text-5xl font-extrabold text-white mb-1">$12<span className="text-xl font-normal text-[#8b949e]">/mo</span></div>
          <p className="text-[#8b949e] text-sm mb-6">Everything you need to protect your salary privacy</p>
          <ul className="text-left space-y-3 mb-8">
            {[
              "Continuous monitoring across 50+ sources",
              "Automated removal requests",
              "Real-time breach & exposure alerts",
              "Monthly privacy score report",
              "Priority email support"
            ].map((feat) => (
              <li key={feat} className="flex items-start gap-2 text-sm text-[#c9d1d9]">
                <span className="text-[#58a6ff] mt-0.5">&#10003;</span>
                {feat}
              </li>
            ))}
          </ul>
          <a href={checkoutUrl} className="block w-full bg-[#58a6ff] text-[#0d1117] font-bold py-3 rounded-lg hover:bg-[#79b8ff] transition-colors text-center">
            Get Started — $12/mo
          </a>
          <p className="text-[#8b949e] text-xs mt-3">Secure checkout via Lemon Squeezy. Cancel anytime.</p>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-2xl mx-auto px-6 pb-20" id="faq">
        <h2 className="text-2xl font-bold text-white text-center mb-8">Frequently asked questions</h2>
        <div className="space-y-4">
          {[
            {
              q: "How does SalaryShield find my salary data?",
              a: "We scan publicly accessible job sites, salary aggregators, LinkedIn data, and known data broker databases using your name and professional profile to locate any salary information tied to you."
            },
            {
              q: "Can you actually get my data removed?",
              a: "Yes. We submit formal opt-out and removal requests on your behalf to each source. Most removals complete within 7–30 days. We monitor and re-submit if data reappears."
            },
            {
              q: "Is my personal information safe with SalaryShield?",
              a: "Absolutely. We use your information solely to perform scans and removals. We never sell or share your data, and all information is encrypted at rest and in transit."
            }
          ].map((item) => (
            <div key={item.q} className="bg-[#161b22] border border-[#21262d] rounded-xl p-6">
              <div className="text-white font-semibold mb-2">{item.q}</div>
              <div className="text-[#8b949e] text-sm leading-relaxed">{item.a}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#21262d] py-8 text-center text-[#8b949e] text-sm">
        <p>&copy; {new Date().getFullYear()} SalaryShield. All rights reserved.</p>
        <p className="mt-1">Your salary data deserves to stay private.</p>
      </footer>
    </main>
  );
}
