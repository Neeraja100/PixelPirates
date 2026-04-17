export default function SecurityView({ transactions, onDelete }) {
  const recentTransactions = [...(transactions || [])].reverse();

  return (
    <div className="fade-up" style={{ maxWidth: "800px", margin: "0 auto" }}>
      <div style={{ marginBottom: "3rem", textAlign: "center" }}>
        <span className="material-symbols-outlined" style={{ fontSize: "3rem", color: "#8a2be2", marginBottom: "1rem" }}>shield_lock</span>
        <h1 className="font-manrope" style={{ fontSize: "2.5rem", fontWeight: 700, color: "#e5e2e1", letterSpacing: "0.01em" }}>
          Transaction <span className="gradient-text">History</span>
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

         <div style={{ marginBottom: "2rem" }}>
            <h4 className="font-manrope" style={{ fontSize: "1.125rem", color: "#e5e2e1", fontWeight: 600, marginBottom: "1rem", borderBottom: "1px solid rgba(76,67,84,0.3)", paddingBottom: "0.5rem" }}>
               Recent Transactions
            </h4>
            {recentTransactions.length === 0 ? (
               <p className="font-inter" style={{ color: "#988ca0", fontSize: "0.9375rem" }}>No transactions logged yet.</p>
            ) : (
               <div style={{ maxHeight: "300px", overflowY: "auto", paddingRight: "0.5rem" }}>
                 {recentTransactions.map((tx, idx) => (
                    <div key={idx} style={{ 
                       display: "flex", 
                       justifyContent: "space-between", 
                       padding: "0.75rem 0", 
                       borderBottom: "1px solid rgba(255,255,255,0.05)" 
                    }}>
                       <span className="font-inter" style={{ color: "#e5e2e1", fontSize: "0.9375rem" }}>
                          {tx.description || tx.category || "Expense"}
                       </span>
                       <span className="font-manrope" style={{ color: tx.type === "income" ? "#b8ffc4" : "#dcb8ff", fontWeight: 600, fontSize: "0.9375rem" }}>
                          {tx.type === "income" ? "+" : "-"} ₹{Math.abs(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                       </span>
                    </div>
                 ))}
               </div>
            )}
         </div>
         
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
