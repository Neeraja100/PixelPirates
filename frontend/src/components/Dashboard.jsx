import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { formatMoney, percent } from "../utils/formatters.js";
import TransactionTable from "./TransactionTable.jsx";

const CHART_COLORS = ["#dcb8ff", "#bec2ff", "#ffb873", "#8a2be2", "#080cff"];

const tooltipStyle = {
  background: "rgba(28,27,27,0.95)",
  border: "1px solid rgba(76,67,84,0.40)",
  borderRadius: "8px",
  backdropFilter: "blur(16px)",
  color: "#e5e2e1",
  fontSize: "0.8125rem",
};

const axisStyle = { stroke: "#4c4354", fontSize: 11, fontFamily: "Inter, sans-serif" };

export default function Dashboard({
  metrics,
  personality,
  insights,
  actions,
  nudge,
  transactions,
  onGenerate,
  onRefine,
  onNudge,
  onSaveTransactions,
  onDelete,
  loading,
}) {
  const categoryData = Object.entries(metrics?.by_category || {}).map(([name, value]) => ({ name, value }));
  const monthData = Object.entries(metrics?.by_month || {}).map(([name, value]) => ({ name, value }));
  const score = personality?.score ?? metrics?.score ?? 0;

  return (
    <div className="space-y-5">

      {/* ── Privacy / session banner ── */}
      <section
        className="glass-card fade-up"
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
          padding: "1.5rem 2rem",
        }}
      >
        <div>
          <p className="overline mb-1">Privacy Layer — Active</p>
          <h2
            className="font-manrope"
            style={{ fontSize: "1.125rem", fontWeight: 700, color: "#e5e2e1" }}
          >
            Session-based adaptive analysis
          </h2>
          <p style={{ fontSize: "0.875rem", color: "#988ca0", marginTop: "0.25rem" }}>
            No permanent storage. Session ends → data cleared.
          </p>
        </div>
        <button className="btn-danger" onClick={onDelete}>
          🗑 Delete all data
        </button>
      </section>

      {/* ── Health score + SWOT ── */}
      <section className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr] fade-up fade-up-1">

        {/* Score card */}
        <div
          className="glass-card"
          style={{ position: "relative", overflow: "hidden" }}
        >
          <div
            className="pointer-events-none absolute"
            style={{
              bottom: "-40px",
              right: "-40px",
              width: "200px",
              height: "200px",
              borderRadius: "50%",
              background: "#8a2be2",
              filter: "blur(80px)",
              opacity: 0.18,
            }}
          />
          <p className="overline mb-4">Financial Health</p>
          <div style={{ display: "flex", alignItems: "flex-end", gap: "0.5rem" }}>
            <span
              className="gradient-text font-manrope"
              style={{ fontSize: "5rem", fontWeight: 800, lineHeight: 1 }}
            >
              {score}
            </span>
            <span style={{ color: "#4c4354", fontSize: "1.5rem", fontWeight: 300, paddingBottom: "0.5rem" }}>/100</span>
          </div>
          <h3
            className="font-manrope mt-4"
            style={{ fontSize: "1.375rem", fontWeight: 700, color: "#e5e2e1" }}
          >
            {personality?.tag || "Analysis pending"}
          </h3>
          <p style={{ color: "#988ca0", marginTop: "0.75rem", lineHeight: 1.65, fontSize: "0.9375rem" }}>
            {personality?.summary || "Generate analysis after adding your transaction data."}
          </p>

          <div className="grid grid-cols-2 gap-3 mt-6">
            {[
              { label: "Income", value: formatMoney(metrics?.income) },
              { label: "Expenses", value: formatMoney(metrics?.expenses) },
              { label: "Savings Rate", value: percent(metrics?.savings_rate) },
              { label: "Discretionary", value: percent(metrics?.discretionary_ratio) },
            ].map(({ label, value }) => (
              <div className="metric-chip" key={label} style={{ position: "relative" }}>
                <p
                  className="font-inter"
                  style={{ fontSize: "0.6875rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#988ca0" }}
                >
                  {label}
                </p>
                <p style={{ fontSize: "1.125rem", fontWeight: 700, color: "#e5e2e1", marginTop: "0.25rem" }}>
                  {value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* SWOT */}
        <div className="glass-card">
          <p className="overline mb-4">SWOT Assessment</p>
          <div className="grid gap-3 md:grid-cols-2">
            {[
              { key: "strengths",     color: "#dcb8ff", emoji: "💪" },
              { key: "weaknesses",    color: "#ffb4ab", emoji: "⚠️" },
              { key: "opportunities", color: "#ffb873", emoji: "🔭" },
              { key: "threats",       color: "#bec2ff", emoji: "🛡️" },
            ].map(({ key, color, emoji }) => (
              <div
                key={key}
                style={{
                  background: "#2a2a2a",
                  border: "1px solid rgba(76,67,84,0.20)",
                  borderRadius: "12px",
                  padding: "1rem 1.25rem",
                }}
              >
                <h4
                  className="font-manrope"
                  style={{ fontWeight: 700, fontSize: "0.875rem", color, textTransform: "capitalize", marginBottom: "0.625rem" }}
                >
                  {emoji} {key}
                </h4>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                  {(personality?.swot?.[key] || ["Generate analysis to view this section."]).map((item) => (
                    <li key={item} style={{ fontSize: "0.8125rem", color: "#cfc2d7", lineHeight: 1.55 }}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Charts ── */}
      <section className="grid gap-5 lg:grid-cols-2 fade-up fade-up-2">
        <ChartCard title="Monthly Trend" subtitle="Spending over time">
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={monthData} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8a2be2" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#8a2be2" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(76,67,84,0.25)" strokeDasharray="3 3" />
              <XAxis dataKey="name" {...axisStyle} />
              <YAxis {...axisStyle} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: "rgba(220,184,255,0.3)" }} />
              <Area
                dataKey="value"
                stroke="#8a2be2"
                strokeWidth={2}
                fill="url(#areaGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Category Distribution" subtitle="Where your money flows">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={categoryData} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
              <CartesianGrid stroke="rgba(76,67,84,0.25)" strokeDasharray="3 3" />
              <XAxis dataKey="name" {...axisStyle} />
              <YAxis {...axisStyle} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(138,43,226,0.08)" }} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {categoryData.map((entry, index) => (
                  <Cell fill={CHART_COLORS[index % CHART_COLORS.length]} key={entry.name} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </section>

      {/* ── Insights + Actions ── */}
      <section className="grid gap-5 lg:grid-cols-2 fade-up fade-up-3">

        {/* AI Insights */}
        <div className="glass-card">
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem", marginBottom: "1.25rem" }}>
            <div>
              <p className="overline mb-1">Financial Constellations</p>
              <h2 className="font-manrope" style={{ fontSize: "1.375rem", fontWeight: 700, color: "#e5e2e1" }}>
                AI Behavioral Insights
              </h2>
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button className="btn-secondary" onClick={onGenerate} disabled={loading} style={{ padding: "0.65rem 1.25rem", fontSize: "0.875rem" }}>
                Generate
              </button>
              <button className="btn-primary" onClick={onRefine} disabled={loading} style={{ padding: "0.65rem 1.25rem", fontSize: "0.875rem" }}>
                Refine
              </button>
            </div>
          </div>
          <ul style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
            {(insights?.insights || ["Generate insights to see patterns, anomalies, and behavioral trends."]).map((item, i) => (
              <li key={item} className="insight-item" style={{ animationDelay: `${i * 0.05}s` }}>
                <span style={{ color: "#8a2be2", marginRight: "0.5rem" }}>◆</span>
                {item}
              </li>
            ))}
          </ul>
          {insights?.refined && (
            <p style={{ marginTop: "1rem", fontSize: "0.8125rem", color: "#dcb8ff" }}>
              ✦ Adaptive session refinement active.
            </p>
          )}
        </div>

        {/* Action Engine */}
        <div className="glass-card">
          <p className="overline mb-1">Action Engine</p>
          <h2 className="font-manrope" style={{ fontSize: "1.375rem", fontWeight: 700, color: "#e5e2e1", marginBottom: "1.25rem" }}>
            Refining Your Reflection
          </h2>
          <ol style={{ display: "flex", flexDirection: "column", gap: "0.625rem", listStyle: "none" }}>
            {(actions || ["Generate analysis to receive the three highest-impact actions."]).map((item, i) => (
              <li
                key={item}
                style={{
                  background: "#2a2a2a",
                  border: "1px solid rgba(76,67,84,0.18)",
                  borderRadius: "12px",
                  padding: "1rem 1.25rem",
                  display: "flex",
                  gap: "0.875rem",
                  alignItems: "flex-start",
                }}
              >
                <span
                  style={{
                    flexShrink: 0,
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #8a2be2, #080cff)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.6875rem",
                    fontWeight: 700,
                    color: "#dcb8ff",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  {i + 1}
                </span>
                <span style={{ fontSize: "0.9375rem", color: "#cfc2d7", lineHeight: 1.55 }}>{item}</span>
              </li>
            ))}
          </ol>

          <div style={{ marginTop: "1.5rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <button className="btn-secondary" onClick={onNudge} disabled={loading} style={{ alignSelf: "flex-start" }}>
              🔔 Send Test Alert
            </button>
            {nudge && (
              <div
                style={{
                  background: "rgba(138,43,226,0.08)",
                  border: "1px solid rgba(138,43,226,0.25)",
                  borderRadius: "10px",
                  padding: "1rem 1.25rem",
                }}
              >
                <p style={{ fontWeight: 700, fontSize: "0.8125rem", color: "#dcb8ff", textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: "Inter, sans-serif" }}>
                  {nudge.type}
                </p>
                <p style={{ color: "#e5e2e1", marginTop: "0.5rem", fontSize: "0.9375rem", lineHeight: 1.6 }}>
                  {nudge.whatsapp_ready}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Transaction Table ── */}
      <div className="fade-up fade-up-4">
        <TransactionTable transactions={transactions} onSave={onSaveTransactions} loading={loading} />
      </div>
    </div>
  );
}

function ChartCard({ title, subtitle, children }) {
  return (
    <div className="glass-card">
      <div style={{ marginBottom: "1.25rem" }}>
        <p className="overline mb-1">{subtitle}</p>
        <h3 className="font-manrope" style={{ fontSize: "1.25rem", fontWeight: 700, color: "#e5e2e1" }}>
          {title}
        </h3>
      </div>
      {children}
    </div>
  );
}
