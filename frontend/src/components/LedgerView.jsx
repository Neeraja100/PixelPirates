export default function LedgerView({ actions, loading }) {
  const recommendations = actions && actions.length > 0 
    ? actions 
    : [];

  return (
    <div className="fade-up">
      <div style={{ marginBottom: "2rem" }}>
        <p className="overline mb-2">Strategic Shifts</p>
        <h1 className="font-manrope" style={{ fontSize: "2.25rem", fontWeight: 700, color: "#e5e2e1", letterSpacing: "0.01em" }}>
          <span className="gradient-text">Actions</span>
        </h1>
        <p className="font-inter mt-2" style={{ color: "#988ca0", fontSize: "0.9375rem" }}>
          Personalized financial suggestions based on your behavior. Implement these to optimize your trajectory.
        </p>
      </div>
      
      <div className="grid gap-4">
        {loading ? (
             <div className="glass-card" style={{ padding: "2rem", textAlign: "center" }}>
                 <p className="font-inter" style={{ color: "#cfc2d7" }}>Analyzing behavioral patterns to formulate suggestions...</p>
             </div>
        ) : recommendations.length === 0 ? (
             <div className="glass-card" style={{ padding: "2rem", textAlign: "center" }}>
                 <p className="font-inter" style={{ color: "#988ca0", fontSize: "0.9375rem" }}>Generate an analysis from the Insights tab to receive immediate action plans.</p>
             </div>
        ) : (
            recommendations.map((action, i) => (
               <div key={i} className="glass-card" style={{ padding: "1.5rem", display: "flex", gap: "1.5rem", alignItems: "center" }}>
                  <div style={{ background: "rgba(138,43,226,0.15)", borderRadius: "12px", width: "48px", height: "48px", display: "flex", alignItems: "center", justifyContent: "center", color: "#dcb8ff" }}>
                     <span className="material-symbols-outlined">auto_awesome</span>
                  </div>
                  <div>
                     <h3 className="font-manrope" style={{ color: "#e5e2e1", fontSize: "1.125rem", fontWeight: 600, marginBottom: "0.25rem" }}>Recommended Behavior</h3>
                     <p className="font-inter" style={{ color: "#cfc2d7", fontSize: "0.9375rem", lineHeight: 1.5 }}>{action}</p>
                  </div>
               </div>
            ))
        )}
      </div>
    </div>
  );
}
