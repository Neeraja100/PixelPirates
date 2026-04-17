import { useEffect, useState } from "react";

import { formatMoney } from "../utils/formatters.js";

const COL_HEADERS = ["Date", "Description", "Category", "Type", "Amount"];

export default function TransactionTable({ transactions, onSave, loading }) {
  const [search, setSearch] = useState("");
  const [drafts, setDrafts] = useState(transactions);

  useEffect(() => setDrafts(transactions), [transactions]);

  const filtered = drafts.filter((transaction) =>
    `${transaction.description} ${transaction.category} ${transaction.type}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  function update(id, field, value) {
    setDrafts((current) =>
      current.map((item) => (item.id === id ? { ...item, [field]: field === "amount" ? Number(value) : value } : item)),
    );
  }

  const visibleTotal = filtered.reduce((total, item) => total + Number(item.amount || 0), 0);

  return (
    <section className="glass-card">
      {/* Header */}
      <div
        style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem", marginBottom: "1.5rem" }}
      >
        <div>
          <p className="overline mb-1">Recent Exchanges</p>
          <h2 className="font-manrope" style={{ fontSize: "1.5rem", fontWeight: 700, color: "#e5e2e1" }}>
            Transaction Ledger
          </h2>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <span
            className="font-inter"
            style={{ fontSize: "0.8125rem", color: "#988ca0" }}
          >
            Visible: <span style={{ color: "#dcb8ff", fontWeight: 600 }}>{formatMoney(visibleTotal)}</span>
          </span>
          <button
            className="btn-secondary"
            onClick={() => onSave(drafts)}
            disabled={loading || drafts.length === 0}
            style={{ padding: "0.65rem 1.25rem", fontSize: "0.875rem" }}
          >
            Save edits
          </button>
        </div>
      </div>

      {/* Search */}
      <input
        className="field"
        style={{ marginBottom: "1rem", maxWidth: "420px" }}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by merchant, category, or type…"
      />

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            minWidth: "760px",
            borderCollapse: "separate",
            borderSpacing: "0 6px",
            fontSize: "0.875rem",
          }}
        >
          <thead>
            <tr>
              {COL_HEADERS.map((h) => (
                <th
                  key={h}
                  className="font-inter"
                  style={{
                    padding: "0 0.75rem 0.5rem",
                    textAlign: "left",
                    fontSize: "0.6875rem",
                    fontWeight: 600,
                    letterSpacing: "0.09em",
                    textTransform: "uppercase",
                    color: "#988ca0",
                    borderBottom: "1px solid rgba(76,67,84,0.25)",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((transaction) => (
              <tr
                key={transaction.id}
                style={{ background: "#2a2a2a", borderRadius: "8px" }}
              >
                <td style={{ padding: "0.5rem 0.75rem", borderRadius: "8px 0 0 8px" }}>
                  <input
                    className="field"
                    style={{ padding: "0.45rem 0.75rem", fontSize: "0.8125rem" }}
                    value={transaction.date}
                    onChange={(e) => update(transaction.id, "date", e.target.value)}
                  />
                </td>
                <td style={{ padding: "0.5rem 0.75rem" }}>
                  <input
                    className="field"
                    style={{ padding: "0.45rem 0.75rem", fontSize: "0.8125rem" }}
                    value={transaction.description}
                    onChange={(e) => update(transaction.id, "description", e.target.value)}
                  />
                </td>
                <td style={{ padding: "0.5rem 0.75rem" }}>
                  <input
                    className="field"
                    style={{ padding: "0.45rem 0.75rem", fontSize: "0.8125rem" }}
                    value={transaction.category}
                    onChange={(e) => update(transaction.id, "category", e.target.value)}
                  />
                </td>
                <td style={{ padding: "0.5rem 0.75rem" }}>
                  <select
                    className="field"
                    style={{ padding: "0.45rem 0.75rem", fontSize: "0.8125rem" }}
                    value={transaction.type}
                    onChange={(e) => update(transaction.id, "type", e.target.value)}
                  >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                </td>
                <td style={{ padding: "0.5rem 0.75rem", borderRadius: "0 8px 8px 0" }}>
                  <input
                    className="field"
                    style={{
                      padding: "0.45rem 0.75rem",
                      fontSize: "0.8125rem",
                      color: transaction.type === "income" ? "#dcb8ff" : "#ffb4ab",
                    }}
                    type="number"
                    value={transaction.amount}
                    onChange={(e) => update(transaction.id, "amount", e.target.value)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p
            style={{ color: "#4c4354", textAlign: "center", padding: "2.5rem 0", fontSize: "0.9375rem" }}
          >
            No transactions match this filter.
          </p>
        )}
      </div>
    </section>
  );
}
