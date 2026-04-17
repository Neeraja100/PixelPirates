import { useState, useRef } from "react";
import { XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, CartesianGrid, PieChart, Pie, Cell } from "recharts";
import { formatMoney } from "../utils/formatters.js";
import { generatePortfolioSim, generateSpendingDensity, generatePaymentMethods } from "../utils/simulatedData.js";

const tooltipStyle = {
  background: "rgba(28,27,27,0.95)",
  border: "1px solid rgba(76,67,84,0.40)",
  borderRadius: "8px",
  backdropFilter: "blur(16px)",
  color: "#e5e2e1",
  fontSize: "0.8125rem",
};

export default function MirrorView({ transactions, metrics, onAddTransactions, onUpload }) {
  const [showManualModal, setShowManualModal] = useState(false);
  const [manualType, setManualType] = useState("");
  const [manualAmount, setManualAmount] = useState("");
  const fileInputRef = useRef(null);

  const handleManualSubmit = () => {
    if (!manualType || !manualAmount) return;
    onAddTransactions([{
      date: new Date().toISOString().split('T')[0],
      description: manualType,
      amount: Number(manualAmount),
      type: "expense",
      category: "manual"
    }]);
    setShowManualModal(false);
    setManualType("");
    setManualAmount("");
  };

  const portfolio = generatePortfolioSim(transactions);
  const densityMap = generateSpendingDensity(transactions);
  const paymentMethods = generatePaymentMethods(metrics);

  return (
    <div className="space-y-6 fade-up">
      {/* Hero: Total Valuation */}
      <section style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem" }}>
        <div>
          <p className="overline mb-1">TOTAL VALUATION</p>
          <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem" }}>
            <span className="font-manrope" style={{ fontSize: "3.5rem", fontWeight: 700, color: "#e5e2e1", lineHeight: 1 }}>
              ₹{portfolio.valuation.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).split('.')[0]}
            </span>
            <span className="font-manrope" style={{ fontSize: "1.5rem", color: "#8a2be2" }}>
              .{portfolio.valuation.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).split('.')[1]}
            </span>
          </div>
        </div>
        
        {/* Sparkline */}
        <div style={{ width: "200px", height: "60px" }}>
          <p className="font-inter" style={{ fontSize: "0.75rem", color: "#ffb873", fontWeight: 700, textAlign: "right", marginBottom: "0.25rem" }}>
            +12.4% THIS QUARTER
          </p>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={portfolio.sparkline}>
              <defs>
                <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#dcb8ff" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#dcb8ff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="value" stroke="#dcb8ff" strokeWidth={2} fill="url(#sparkGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Main Grid */}
      <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
        {/* Portfolio Distribution */}
        <div className="glass-card" style={{ padding: "2rem", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <h3 className="font-manrope" style={{ fontSize: "1.375rem", fontWeight: 700, color: "#e5e2e1", display: "flex", justifyContent: "space-between" }}>
              Portfolio Distribution
              <span className="material-symbols-outlined" style={{ color: "#4c4354" }}>auto_awesome</span>
            </h3>
            <p className="font-inter mt-3" style={{ color: "#cfc2d7", fontSize: "0.9375rem", lineHeight: 1.6, maxWidth: "80%" }}>
              Your wealth is currently heavily weighted in <span style={{ color: "#dcb8ff" }}>Equities</span> and <span style={{ color: "#dcb8ff" }}>Digital Assets</span>. Consider rebalancing into Fixed Income to hedge against volatility.
            </p>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mt-8 pt-6" style={{ borderTop: "1px solid rgba(76,67,84,0.15)" }}>
            <div>
              <p className="overline" style={{ fontSize: "0.625rem" }}>LIQUID</p>
              <p className="font-manrope" style={{ fontSize: "1.25rem", fontWeight: 700, color: "#e5e2e1", marginTop: "0.25rem" }}>₹{portfolio.liquid.toLocaleString()}</p>
            </div>
            <div>
              <p className="overline" style={{ fontSize: "0.625rem" }}>INVESTMENTS</p>
              <p className="font-manrope" style={{ fontSize: "1.25rem", fontWeight: 700, color: "#e5e2e1", marginTop: "0.25rem" }}>₹{portfolio.investments.toLocaleString()}</p>
            </div>
            <div>
              <p className="overline" style={{ fontSize: "0.625rem" }}>FIXED ASSETS</p>
              <p className="font-manrope" style={{ fontSize: "1.25rem", fontWeight: 700, color: "#e5e2e1", marginTop: "0.25rem" }}>₹{portfolio.fixed.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Spending Density */}
        <div className="glass-card" style={{ padding: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem" }}>
            <p className="overline">SPENDING DENSITY</p>
            <span className="material-symbols-outlined" style={{ fontSize: "1rem", color: "#4c4354" }}>info</span>
          </div>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "0.35rem" }}>
            {densityMap.map((cell, i) => (
              <div 
                key={i} 
                style={{ 
                  aspectRatio: "1", 
                  borderRadius: "2px", 
                  background: cell.value > 80 ? "#8a2be2" : cell.value > 50 ? "rgba(138,43,226,0.6)" : cell.value > 20 ? "rgba(138,43,226,0.3)" : "rgba(76,67,84,0.15)" 
                }} 
              />
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.75rem" }}>
            <span className="font-inter" style={{ fontSize: "0.5rem", color: "#988ca0", textTransform: "uppercase", letterSpacing: "0.1em" }}>MON</span>
            <span className="font-inter" style={{ fontSize: "0.5rem", color: "#988ca0", textTransform: "uppercase", letterSpacing: "0.1em" }}>SUN</span>
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_1.5fr]">
        {/* Payment Methods */}
        <div className="glass-card" style={{ padding: "1.5rem", display: "flex", alignItems: "center" }}>
          <div style={{ width: "120px", height: "120px", position: "relative" }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={paymentMethods} innerRadius={42} outerRadius={55} dataKey="value" stroke="none">
                  {paymentMethods.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <span className="font-manrope" style={{ fontSize: "1rem", fontWeight: 700, color: "#e5e2e1" }}>70%</span>
              <span className="font-inter" style={{ fontSize: "0.4rem", color: "#988ca0", letterSpacing: "0.05em" }}>DIGITAL</span>
            </div>
          </div>
          
          <div style={{ marginLeft: "1.5rem", flex: 1 }}>
            <p className="font-manrope" style={{ fontWeight: 600, color: "#e5e2e1", marginBottom: "1rem", fontSize: "0.9375rem" }}>Payment Methods</p>
            {paymentMethods.map(pm => (
              <div key={pm.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: pm.fill }} />
                  <span className="font-inter" style={{ fontSize: "0.75rem", color: "#cfc2d7" }}>{pm.name}</span>
                </div>
                <span className="font-inter" style={{ fontSize: "0.75rem", color: "#cfc2d7" }}>₹{(pm.value/1000).toFixed(1)}k</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Entry Dock placeholder */}
        <div className="glass-card" style={{ padding: "1.5rem", display: "flex", flexDirection: "column", justifyContent: "center" }}>
             <p className="overline mb-4">ENTER EXPENSES' DETAILS</p>
             <div className="grid grid-cols-3 gap-3">
                <button onClick={() => setShowManualModal(true)} className="btn-secondary" style={{ display: "flex", gap: "0.5rem", justifyContent: "center", padding: "1rem" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: "1.125rem" }}>edit_note</span>
                    Manual
                </button>
                <button onClick={() => console.log("AI Voice placeholder invoked")} className="btn-secondary" style={{ display: "flex", gap: "0.5rem", justifyContent: "center", padding: "1rem" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: "1.125rem" }}>mic</span>
                    AI Voice
                </button>
                <button onClick={() => fileInputRef.current?.click()} className="btn-secondary" style={{ display: "flex", gap: "0.5rem", justifyContent: "center", padding: "1rem" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: "1.125rem" }}>upload_file</span>
                    PDF
                </button>
                <input type="file" ref={fileInputRef} accept=".pdf" style={{ display: "none" }} onChange={(e) => { 
                    if(e.target.files[0]) onUpload(e.target.files[0]); 
                    e.target.value = null;
                }} />
             </div>
        </div>
      </div>

      {showManualModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div className="glass-card" style={{ padding: "2rem", width: "400px", maxWidth: "90%" }}>
            <h3 className="font-manrope mb-4" style={{ fontSize: "1.25rem", color: "#e5e2e1" }}>Manual Entry</h3>
            <input 
              type="text" 
              placeholder="Expense Type" 
              value={manualType} 
              onChange={e => setManualType(e.target.value)} 
              className="mb-3 font-inter"
              style={{ width: "100%", padding: "0.75rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#fff", outline: "none" }}
            />
            <input 
              type="number" 
              placeholder="Expense Amount" 
              value={manualAmount} 
              onChange={e => setManualAmount(e.target.value)} 
              className="mb-4 font-inter"
              style={{ width: "100%", padding: "0.75rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#fff", outline: "none" }}
            />
            <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
              <button className="btn-secondary" onClick={() => setShowManualModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleManualSubmit}>Submit</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
