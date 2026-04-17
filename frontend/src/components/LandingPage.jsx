export default function LandingPage({ onStart }) {
  return (
    <main className="relative flex min-h-screen w-full flex-col overflow-hidden" style={{ background: "#0e0e0e" }}>
      {/* Ambient glow blobs */}
      <div
        className="pointer-events-none absolute"
        style={{
          top: "-10%",
          left: "-5%",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background: "#8a2be2",
          filter: "blur(160px)",
          opacity: 0.12,
        }}
      />
      <div
        className="pointer-events-none absolute"
        style={{
          bottom: "5%",
          right: "-5%",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: "#080cff",
          filter: "blur(140px)",
          opacity: 0.08,
        }}
      />

      {/* Nav */}
      <nav
        className="relative z-10 flex items-center justify-between px-8 py-5"
        style={{ borderBottom: "1px solid rgba(76,67,84,0.25)", backdropFilter: "blur(24px)" }}
      >
        <div className="flex items-center gap-3">
          <div className="pulse-dot" />
          <span
            className="gradient-text font-manrope"
            style={{ fontSize: "1.125rem", fontWeight: 700, letterSpacing: "0.04em" }}
          >
            The Financial Mirror
          </span>
        </div>
        <div className="flex items-center gap-2">
          {["Experience", "Insights", "Security"].map((label) => (
            <button key={label} className="nav-tab">{label}</button>
          ))}
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 flex flex-1 flex-col justify-center px-12 py-16 lg:px-20">
        <div className="max-w-4xl">
          <p className="overline fade-up mb-6">Clarity is Luxury</p>
          <h1
            className="fade-up fade-up-1 font-manrope leading-tight"
            style={{
              fontSize: "clamp(2.8rem, 6vw, 5rem)",
              fontWeight: 300,
              color: "#e5e2e1",
              letterSpacing: "0.02em",
              maxWidth: "780px",
            }}
          >
            See your money.{" "}
            <span className="gradient-text" style={{ fontWeight: 700 }}>
              Understand&nbsp;your&nbsp;life.
            </span>
          </h1>
          <p
            className="fade-up fade-up-2 mt-6"
            style={{ fontSize: "1.125rem", color: "#cfc2d7", lineHeight: 1.7, maxWidth: "560px" }}
          >
            Not just tracking. Real clarity. Elevate your financial consciousness through
            data-driven introspection.
          </p>

          <div className="fade-up fade-up-3 mt-10 flex flex-wrap gap-4">
            <button className="btn-primary" onClick={onStart}>
              Begin Your Reflection
            </button>
            <button className="btn-secondary">Learn how it works</button>
          </div>

          {/* Trust pillars */}
          <div className="fade-up fade-up-4 mt-16 grid gap-5 sm:grid-cols-3" style={{ maxWidth: "720px" }}>
            {[
              {
                icon: "🔒",
                title: "We don't access personal content",
                body: "Your transactions are analyzed algorithmically without human oversight.",
              },
              {
                icon: "🛡️",
                title: "Your data stays private",
                body: "Military-grade encryption ensures your reflection belongs only to you.",
              },
              {
                icon: "⚡",
                title: "You are always in control",
                body: "One-click data deletion and localized processing for ultimate peace of mind.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="glass-card"
                style={{ padding: "1.5rem", background: "rgba(28,27,27,0.55)" }}
              >
                <div style={{ fontSize: "1.5rem", marginBottom: "0.75rem" }}>{item.icon}</div>
                <p style={{ fontWeight: 700, fontSize: "0.875rem", color: "#e5e2e1", marginBottom: "0.5rem" }}>
                  {item.title}
                </p>
                <p style={{ fontSize: "0.8125rem", color: "#988ca0", lineHeight: 1.55 }}>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom bar */}
      <footer
        className="relative z-10 flex items-center justify-between px-8 py-4 font-inter"
        style={{
          borderTop: "1px solid rgba(76,67,84,0.20)",
          fontSize: "0.75rem",
          color: "#988ca0",
        }}
      >
        <span>© 2026 The Financial Mirror. All rights reserved.</span>
        <div className="flex gap-4">
          {["Privacy Protocol", "Terms of Service", "Security Architecture"].map((l) => (
            <a key={l} style={{ color: "#988ca0", textDecoration: "none", transition: "color 150ms" }}
               onMouseEnter={(e) => (e.target.style.color = "#dcb8ff")}
               onMouseLeave={(e) => (e.target.style.color = "#988ca0")}
            >
              {l}
            </a>
          ))}
        </div>
      </footer>
    </main>
  );
}
