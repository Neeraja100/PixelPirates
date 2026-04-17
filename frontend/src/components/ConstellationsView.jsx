import { BarChart, Bar, XAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from "recharts";
import { formatMoney } from "../utils/formatters.js";
import { generateMidnightImpulses, generateGhostSubscriptions } from "../utils/simulatedData.js";

const tooltipStyle = {
  background: "rgba(28,27,27,0.95)",
  border: "1px solid rgba(76,67,84,0.40)",
  borderRadius: "8px",
  backdropFilter: "blur(16px)",
  color: "#e5e2e1",
  fontSize: "0.8125rem",
};

export default function ConstellationsView({ personality, insights, transactions, loading, onGenerate, onRefine }) {
  const impulses = generateMidnightImpulses(transactions);
  const ghosts = generateGhostSubscriptions(transactions);

  return (
    <div className="space-y-8 fade-up">
      <div style={{ marginBottom: "2rem" }}>
        <p className="overline" style={{ letterSpacing: "0.15em", color: "#cfc2d7", marginBottom: "0.5rem" }}>EXPLORER PHASE: ANALYSIS</p>
        <h1 className="font-manrope" style={{ fontSize: "2.75rem", fontWeight: 700, color: "#e5e2e1", display: "flex", gap: "0.75rem" }}>
          Financial <span style={{ color: "#080cff", background: "linear-gradient(90deg, #8a2be2, #080cff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Constellations</span>
        </h1>
        <p className="font-inter mt-3" style={{ color: "#988ca0", fontSize: "0.875rem", maxWidth: "340px", lineHeight: 1.6 }}>
          Your spending patterns mapped onto the digital void. Each node represents a gravitational pull on your capital. Explore the nebula of your financial psyche.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        
        {/* Persona Card */}
        <div className="glass-card" style={{ 
            position: "relative", 
            overflow: "hidden", 
            padding: "2.5rem 2rem", 
            minHeight: "340px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            background: "linear-gradient(to bottom right, rgba(28,27,27,0.8), rgba(20,18,22,0.95))"
          }}>
          {/* Nebula Glow */}
          <div className="pointer-events-none absolute" style={{
            top: "10%",
            left: "20%",
            width: "400px",
            height: "400px",
            background: "radial-gradient(circle, rgba(138,43,226,0.2) 0%, rgba(8,12,255,0.15) 40%, rgba(0,0,0,0) 70%)",
            filter: "blur(40px)",
            opacity: 0.8,
            animation: "pulse 8s ease-in-out infinite alternate"
          }} />
          <div className="pointer-events-none absolute" style={{
            bottom: "-10%",
            right: "-10%",
            width: "300px",
            height: "300px",
            background: "radial-gradient(circle, rgba(255,184,115,0.15) 0%, rgba(0,0,0,0) 70%)",
            filter: "blur(50px)",
          }} />
          
          <div style={{ position: "relative", zIndex: 1, maxWidth: "80%" }}>
            <p className="font-inter" style={{ fontSize: "0.625rem", color: "#ffb873", textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 700, marginBottom: "1rem" }}>
              CURRENT PERSONA
            </p>
            <h2 className="font-manrope" style={{ fontSize: "2.5rem", fontWeight: 300, color: "#e5e2e1", marginBottom: "1rem", letterSpacing: "-0.02em" }}>
              {personality?.tag || "The Comfort Spender"}
            </h2>
            <p className="font-inter" style={{ color: "#cfc2d7", fontSize: "0.9375rem", lineHeight: 1.6 }}>
              {personality?.summary || "Your spending gravitates toward emotional anchors. You value immediate serenity and atmospheric quality over long-term rigid accumulation."}
            </p>
          </div>

          <div style={{ position: "relative", zIndex: 1, display: "flex", gap: "1rem", marginTop: "2rem" }}>
             <button className="btn-primary" onClick={onGenerate} disabled={loading}>
                View Mirror Breakdown
             </button>
             <button className="btn-secondary" onClick={onRefine} disabled={loading}>
                Share Insight
             </button>
          </div>
        </div>

        {/* Right column of Constellations top half */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div className="glass-card" style={{ padding: "1.25rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
               <div>
                 <h4 className="font-manrope" style={{ color: "#e5e2e1", fontWeight: 700, fontSize: "1rem" }}>Atmosphere</h4>
                 <p className="font-inter" style={{ color: "#988ca0", fontSize: "0.6875rem" }}>Dining & Environment</p>
               </div>
               <div style={{ background: "rgba(138,43,226,0.15)", borderRadius: "8px", padding: "0.5rem", color: "#dcb8ff" }}>
                 <span className="material-symbols-outlined" style={{ fontSize: "1.2rem" }}>restaurant</span>
               </div>
            </div>
            
            <div className="glass-card" style={{ padding: "1.25rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
               <div>
                 <h4 className="font-manrope" style={{ color: "#e5e2e1", fontWeight: 700, fontSize: "1rem" }}>Zenith</h4>
                 <p className="font-inter" style={{ color: "#988ca0", fontSize: "0.6875rem" }}>Luxury Wellness</p>
               </div>
               <div style={{ background: "rgba(8,12,255,0.15)", borderRadius: "8px", padding: "0.5rem", color: "#8a2be2" }}>
                 <span className="material-symbols-outlined" style={{ fontSize: "1.2rem" }}>spa</span>
               </div>
            </div>

            <div className="glass-card" style={{ flex: 1, padding: "2rem", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
               <h3 className="font-manrope gradient-text" style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.5rem" }}>84%</h3>
               <p className="font-inter" style={{ color: "#988ca0", fontSize: "0.75rem", lineHeight: 1.5 }}>
                 Alignment with the Comfort Archetype this month.
               </p>
            </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        {/* Ghost Subscriptions */}
        <div className="glass-card" style={{ padding: "2rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
                <span className="material-symbols-outlined" style={{ color: "#8a2be2" }}>receipt_long</span>
                <h3 className="font-manrope" style={{ fontSize: "1.25rem", fontWeight: 700, color: "#e5e2e1" }}>Ghost Subscriptions</h3>
            </div>
            <p className="font-inter" style={{ color: "#988ca0", fontSize: "0.8125rem", lineHeight: 1.6, marginBottom: "2rem" }}>
                Faded digital ties that continue to pull from your ledger. These are services you've visually forgotten but financially retain.
            </p>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {ghosts.map((sub, i) => (
                    <div key={i} style={{ 
                        background: "rgba(30,28,33,0.6)", 
                        border: "1px solid rgba(76,67,84,0.1)", 
                        borderRadius: "8px", 
                        padding: "1rem" ,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                    }}>
                        <span className="font-inter" style={{ color: "#cfc2d7", fontSize: "0.875rem", fontWeight: 500 }}>{sub.name}</span>
                        <span className="font-inter" style={{ color: "#ffb4ab", fontSize: "0.875rem", fontWeight: 700 }}>${Math.abs(sub.amount).toFixed(2)}</span>
                    </div>
                ))}
            </div>

            <button style={{ 
                marginTop: "2rem", 
                background: "transparent", 
                border: "none", 
                color: "#e5e2e1", 
                fontSize: "0.75rem", 
                fontWeight: 700, 
                letterSpacing: "0.05em",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem"
            }}>
                EXORCISE ALL <span className="material-symbols-outlined" style={{ fontSize: "1rem" }}>arrow_forward</span>
            </button>
        </div>

        {/* Midnight Impulses Bar Chart */}
        <div className="glass-card" style={{ padding: "2rem", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem" }}>
                <div>
                   <h3 className="font-manrope" style={{ fontSize: "1.375rem", fontWeight: 700, color: "#e5e2e1" }}>Midnight Impulses</h3>
                   <p className="font-inter" style={{ color: "#ffb873", fontSize: "0.625rem", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, marginTop: "0.25rem" }}>
                       PEAK: 02:14 AM
                   </p>
                </div>
                <span className="material-symbols-outlined" style={{ color: "#ffb873", fontSize: "1.5rem" }}>dark_mode</span>
            </div>

            <div style={{ flex: 1, position: "relative", minHeight: "180px" }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={impulses} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#ffb873" stopOpacity={0.9} />
                                <stop offset="100%" stopColor="#ffb4ab" stopOpacity={0.2} />
                            </linearGradient>
                            <linearGradient id="dimGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#ffb873" stopOpacity={0.4} />
                                <stop offset="100%" stopColor="#ffb873" stopOpacity={0.05} />
                            </linearGradient>
                        </defs>
                        <RechartsTooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(255,184,115,0.05)" }} />
                        <Bar dataKey="intensity" radius={[4, 4, 0, 0]}>
                            {impulses.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.intensity > 70 ? "url(#goldGrad)" : "url(#dimGrad)"} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div style={{ display: "flex", gap: "2rem", marginTop: "1.5rem", borderTop: "1px solid rgba(76,67,84,0.15)", paddingTop: "1.5rem" }}>
                 <div style={{ flex: 1 }}>
                     <p className="font-inter" style={{ fontSize: "0.625rem", color: "#988ca0", letterSpacing: "0.05em", marginBottom: "0.25rem" }}>Frequency</p>
                     <p className="font-manrope" style={{ fontSize: "1.125rem", color: "#e5e2e1", fontWeight: 600 }}>High</p>
                 </div>
                 <div style={{ flex: 1 }}>
                     <p className="font-inter" style={{ fontSize: "0.625rem", color: "#988ca0", letterSpacing: "0.05em", marginBottom: "0.25rem" }}>Average Cost</p>
                     <p className="font-manrope" style={{ fontSize: "1.125rem", color: "#ffb873", fontWeight: 600 }}>$142.00</p>
                 </div>
            </div>
        </div>
      </div>

      {/* Insight Quotes */}
      <div style={{ marginTop: "4rem", textAlign: "center", padding: "2rem 0" }}>
          <span className="material-symbols-outlined" style={{ fontSize: "3rem", color: "#8a2be2", opacity: 0.5, marginBottom: "1rem" }}>format_quote</span>
          <h2 className="font-manrope" style={{ fontSize: "2rem", fontWeight: 300, color: "#e5e2e1", fontStyle: "italic", maxWidth: "800px", margin: "0 auto", lineHeight: 1.4 }}>
             {insights?.insights?.[0] || "\"Money is not just currency; it is a vibrational frequency that reflects your innermost desires.\""}
          </h2>
          <p className="font-inter" style={{ marginTop: "1.5rem", fontSize: "0.6875rem", color: "#988ca0", textTransform: "uppercase", letterSpacing: "0.25em" }}>
              MIRROR INSIGHT #402
          </p>
      </div>

    </div>
  );
}
