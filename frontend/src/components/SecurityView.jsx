export default function SecurityView({ onDelete }) {
  return (
    <div className="fade-up" style={{ maxWidth: "800px", margin: "0 auto" }}>
      <div style={{ marginBottom: "3rem", textAlign: "center" }}>
        <span className="material-symbols-outlined" style={{ fontSize: "3rem", color: "#8a2be2", marginBottom: "1rem" }}>shield_lock</span>
        <h1 className="font-manrope" style={{ fontSize: "2.5rem", fontWeight: 700, color: "#e5e2e1", letterSpacing: "0.01em" }}>
          Security <span className="gradient-text">Architecture</span>
        </h1>
        <p className="font-inter mt-3" style={{ color: "#988ca0", fontSize: "1rem" }}>
          Your data is processed locally within an ephemeral session.
        </p>
      </div>

      <div className="glass-card" style={{ padding: "3rem 2.5rem" }}>
         <h3 className="font-manrope" style={{ fontSize: "1.25rem", color: "#e5e2e1", fontWeight: 600, marginBottom: "1rem" }}>
            Privacy Protocol Active
         </h3>
         <p className="font-inter" style={{ fontSize: "0.9375rem", color: "#cfc2d7", lineHeight: 1.6, marginBottom: "2rem" }}>
            The Financial Mirror does not permanently store your transactions. All analytical processing is done in an isolated, encrypted memory layer that vaporizes when your session concludes. You maintain ultimate sovereignty over your reflection.
         </p>
         
         <div style={{ 
            background: "rgba(255,180,171,0.05)",
            border: "1px solid rgba(255,180,171,0.2)",
            borderRadius: "8px",
            padding: "1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1.5rem"
         }}>
             <div>
                 <h4 className="font-manrope" style={{ color: "#ffb4ab", fontWeight: 600, fontSize: "1rem", marginBottom: "0.25rem" }}>Terminate Session</h4>
                 <p className="font-inter" style={{ color: "#cfc2d7", fontSize: "0.8125rem" }}>Instantly erase all session memory and current transactions.</p>
             </div>
             <button className="btn-danger" onClick={onDelete} style={{ padding: "0.75rem 1.5rem" }}>
                 <span className="material-symbols-outlined" style={{ fontSize: "1.2rem", marginRight: "0.5rem", verticalAlign: "middle" }}>delete_forever</span>
                 Delete All Data
             </button>
         </div>
      </div>
    </div>
  );
}
