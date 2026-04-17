import { useState } from "react";

import { demoTransactions } from "../data/demoTransactions.js";

const emptyTransaction = {
  date: new Date().toISOString().slice(0, 10),
  description: "",
  amount: "",
  type: "expense",
  category: "Uncategorized",
};

export default function DataInput({ onManualSubmit, onTextSubmit, onUploadSubmit, loading }) {
  const [mode, setMode] = useState("manual");
  const [transactions, setTransactions] = useState([emptyTransaction]);
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);

  function updateRow(index, field, value) {
    setTransactions((current) =>
      current.map((item, itemIndex) => (itemIndex === index ? { ...item, [field]: value } : item)),
    );
  }

  function addRow() {
    setTransactions((current) => [...current, { ...emptyTransaction }]);
  }

  function submitManual(event) {
    event.preventDefault();
    const payload = transactions
      .filter((item) => item.description && item.amount)
      .map((item) => ({ ...item, amount: Number(item.amount) }));
    onManualSubmit(payload);
  }

  const modes = [
    { key: "manual", label: "Manual Entry", icon: "✏️" },
    { key: "text",   label: "AI Voice / Text", icon: "🎙️" },
    { key: "upload", label: "PDF / CSV Upload", icon: "📎" },
  ];

  return (
    <section className="glass-card fade-up">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <p className="overline mb-2">Data Capture</p>
          <h2
            className="font-manrope"
            style={{ fontSize: "1.625rem", fontWeight: 700, color: "#e5e2e1", letterSpacing: "0.01em" }}
          >
            Here's what your money says about you.
          </h2>
          <p style={{ fontSize: "0.875rem", color: "#988ca0", marginTop: "0.375rem" }}>
            Add transactions via any method below.
          </p>
        </div>
        <button
          className="btn-secondary"
          onClick={() => onManualSubmit(demoTransactions)}
          disabled={loading}
        >
          Use demo data
        </button>
      </div>

      {/* Mode tabs */}
      <div
        className="inline-flex gap-1 mb-6 p-1"
        style={{
          background: "#1c1b1b",
          borderRadius: "10px",
          border: "1px solid rgba(76,67,84,0.25)",
        }}
      >
        {modes.map(({ key, label, icon }) => (
          <button
            key={key}
            className={`nav-tab ${mode === key ? "active" : ""}`}
            style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}
            onClick={() => setMode(key)}
            type="button"
          >
            <span>{icon}</span>
            {label}
          </button>
        ))}
      </div>

      {/* Manual entry */}
      {mode === "manual" && (
        <form className="space-y-3" onSubmit={submitManual}>
          <div
            className="hidden sm:grid font-inter"
            style={{
              gridTemplateColumns: "1fr 2fr 1fr 1fr",
              gap: "0.75rem",
              fontSize: "0.6875rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#988ca0",
              fontWeight: 600,
              paddingBottom: "0.5rem",
              borderBottom: "1px solid rgba(76,67,84,0.20)",
              marginBottom: "0.5rem",
            }}
          >
            <span>Date</span>
            <span>Description</span>
            <span>Amount</span>
            <span>Type</span>
          </div>
          {transactions.map((transaction, index) => (
            <div className="grid gap-2 sm:gap-3" style={{ gridTemplateColumns: "1fr 2fr 1fr 1fr" }} key={`${transaction.date}-${index}`}>
              <input
                className="field"
                type="date"
                value={transaction.date}
                onChange={(e) => updateRow(index, "date", e.target.value)}
              />
              <input
                className="field"
                placeholder="Description"
                value={transaction.description}
                onChange={(e) => updateRow(index, "description", e.target.value)}
              />
              <input
                className="field"
                min="0"
                type="number"
                placeholder="Amount"
                value={transaction.amount}
                onChange={(e) => updateRow(index, "amount", e.target.value)}
              />
              <select
                className="field"
                value={transaction.type}
                onChange={(e) => updateRow(index, "type", e.target.value)}
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
          ))}
          <div className="flex flex-wrap gap-3 pt-2">
            <button className="btn-secondary" type="button" onClick={addRow}>
              + Add row
            </button>
            <button className="btn-primary" disabled={loading}>
              {loading ? "Processing..." : "Add transactions →"}
            </button>
          </div>
        </form>
      )}

      {/* AI text / voice */}
      {mode === "text" && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onTextSubmit(text);
          }}
        >
          <p style={{ fontSize: "0.875rem", color: "#988ca0", marginBottom: "0.75rem" }}>
            Simply describe your spending to the Mirror in natural language.
          </p>
          <textarea
            className="field"
            style={{ minHeight: "10rem", resize: "vertical" }}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={"2026-02-08, Zomato weekend dinner, 1850\n2026-02-01, Salary credited, 80000"}
            required
          />
          <button className="btn-primary mt-4" disabled={loading}>
            {loading ? "Parsing..." : "Parse with AI →"}
          </button>
        </form>
      )}

      {/* Upload */}
      {mode === "upload" && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (file) onUploadSubmit(file);
          }}
        >
          <p style={{ fontSize: "0.875rem", color: "#988ca0", marginBottom: "0.75rem" }}>
            Import your bank statement for a complete historical overview.
          </p>
          <div
            className="field"
            style={{
              padding: "2rem",
              textAlign: "center",
              cursor: "pointer",
              borderStyle: "dashed",
              borderColor: "rgba(138,43,226,0.35)",
              borderRadius: "10px",
            }}
          >
            <input
              type="file"
              accept=".csv,.pdf"
              style={{ width: "100%", cursor: "pointer" }}
              onChange={(e) => setFile(e.target.files?.[0])}
            />
            <p style={{ color: "#988ca0", marginTop: "0.5rem", fontSize: "0.8125rem" }}>
              Supports .csv and .pdf bank statements
            </p>
          </div>
          <button className="btn-primary mt-4" disabled={loading || !file}>
            {loading ? "Uploading..." : "Upload & Parse →"}
          </button>
        </form>
      )}
    </section>
  );
}
