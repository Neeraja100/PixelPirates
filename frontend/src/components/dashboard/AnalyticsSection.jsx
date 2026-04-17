import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { TrendingUp, TrendingDown, AlertCircle, Coffee, ShoppingBag, Zap } from 'lucide-react';

const CATEGORY_COLORS = {
  "Food & Dining":        "#f97316",
  "Transport":            "#3b82f6",
  "Shopping":             "#8b5cf6",
  "Entertainment":        "#ec4899",
  "Bills & Utilities":    "#14b8a6",
  "Rent & Housing":       "#f59e0b",
  "Health":               "#22c55e",
  "Education":            "#06b6d4",
  "Savings & Investments":"#a855f7",
  "Income":               "#10b981",
  "Other":                "#6b7280",
};

const FALLBACK_COLORS = ["#8a2be2", "#080cff", "#f97316", "#3b82f6", "#ec4899", "#14b8a6"];

export default function AnalyticsSection({ metrics, transactions }) {
  const hasData = metrics && (metrics.expenses > 0 || metrics.income > 0);

  // Build category pie data from real metrics
  const categoryData = hasData
    ? Object.entries(metrics.by_category || {})
        .filter(([, v]) => v > 0)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 6)
        .map(([name, value], i) => ({
          name,
          value: Math.round(value),
          fill: CATEGORY_COLORS[name] || FALLBACK_COLORS[i % FALLBACK_COLORS.length],
        }))
    : [];

  // Monthly trend data
  const monthlyData = hasData
    ? Object.entries(metrics.by_month || {}).map(([month, amount]) => ({
        month: month.slice(5), // "MM" from "YYYY-MM"
        amount: Math.round(amount),
      }))
    : [];

  // Top category
  const topCategory = categoryData[0];
  const topCategoryColor = topCategory?.fill || "#8a2be2";

  // Weekend vs weekday
  const weekendPct = hasData && metrics.expenses > 0
    ? Math.round((metrics.weekend_spend / metrics.expenses) * 100)
    : 0;

  // Savings rate display
  const savingsRatePct = hasData ? Math.round((metrics.savings_rate || 0) * 100) : 0;
  const discretionaryPct = hasData ? Math.round((metrics.discretionary_ratio || 0) * 100) : 0;

  return (
    <div className="w-full relative z-10 flex flex-col items-center">
      <SectionHeader title="Analytics" subtitle="Deep dive into your financial reality" />

      {!hasData ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-32 gap-4 text-center max-w-md"
        >
          <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-2">
            <AlertCircle size={28} className="text-[#988ca0]" />
          </div>
          <h3 className="font-manrope font-bold text-2xl text-white">No data yet</h3>
          <p className="font-inter text-[#988ca0]">
            Upload a bank statement or add transactions to see your analytics come alive.
          </p>
        </motion.div>
      ) : (
        <>
          {/* Row 1: Summary KPI Cards */}
          <RevealBlock>
            <div className="w-full max-w-5xl px-6 grid grid-cols-2 md:grid-cols-4 gap-4 mb-24">
              <KpiCard label="Total Income" value={`₹${(metrics.income || 0).toLocaleString('en-IN')}`} color="#10b981" icon={<TrendingUp size={18}/>} />
              <KpiCard label="Total Expenses" value={`₹${(metrics.expenses || 0).toLocaleString('en-IN')}`} color="#f97316" icon={<TrendingDown size={18}/>} />
              <KpiCard label="Net Savings" value={`₹${(metrics.savings || 0).toLocaleString('en-IN')}`} color="#8a2be2" icon={<Zap size={18}/>} />
              <KpiCard label="Health Score" value={`${metrics.score || 0}/100`} color={metrics.score >= 70 ? "#22c55e" : metrics.score >= 40 ? "#f59e0b" : "#ef4444"} icon={<AlertCircle size={18}/>} />
            </div>
          </RevealBlock>

          {/* Row 2: Category Breakdown + Monthly Bar */}
          <RevealBlock>
            <div className="w-full max-w-5xl px-6 grid md:grid-cols-2 gap-8 mb-24">

              {/* Donut chart */}
              <div className="glass-card p-8">
                <p className="overline mb-6 text-orange-400">SPENDING BREAKDOWN</p>
                {categoryData.length > 0 ? (
                  <div className="flex gap-6 items-center">
                    <div className="w-48 h-48 shrink-0 relative">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={categoryData} innerRadius={55} outerRadius={72} paddingAngle={3} dataKey="value" animationDuration={1200} animationEasing="ease-out">
                            {categoryData.map((entry, i) => (
                              <Cell key={i} fill={entry.fill} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{ background: "rgba(10,10,12,0.95)", borderColor: "rgba(255,255,255,0.1)", borderRadius: "8px", fontFamily: "Inter" }}
                            formatter={(val) => [`₹${val.toLocaleString('en-IN')}`, ""]}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="font-manrope text-lg font-bold text-white">{categoryData.length}</span>
                        <span className="text-[10px] uppercase tracking-widest text-[#988ca0]">Categories</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 flex-1 min-w-0">
                      {categoryData.map((cat, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs font-inter">
                          <div className="w-2 h-2 rounded-full shrink-0" style={{ background: cat.fill }} />
                          <span className="text-[#cfc2d7] truncate flex-1">{cat.name}</span>
                          <span className="text-white font-semibold shrink-0">₹{cat.value.toLocaleString('en-IN')}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-[#988ca0] font-inter text-sm">No expense categories yet.</p>
                )}
              </div>

              {/* Monthly spend bar */}
              <div className="glass-card p-8">
                <p className="overline mb-6 text-blue-400">MONTHLY SPEND</p>
                {monthlyData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={monthlyData} barCategoryGap="30%">
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="month" tick={{ fill: "#988ca0", fontSize: 11, fontFamily: "Inter" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: "#988ca0", fontSize: 11, fontFamily: "Inter" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
                      <Tooltip
                        contentStyle={{ background: "rgba(10,10,12,0.95)", borderColor: "rgba(255,255,255,0.1)", borderRadius: "8px", fontFamily: "Inter" }}
                        formatter={(val) => [`₹${val.toLocaleString('en-IN')}`, "Spent"]}
                      />
                      <Bar dataKey="amount" fill="url(#barGrad)" radius={[4, 4, 0, 0]} />
                      <defs>
                        <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#8a2be2" />
                          <stop offset="100%" stopColor="#080cff" stopOpacity={0.6} />
                        </linearGradient>
                      </defs>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-[#988ca0] font-inter text-sm">Add data with dates to see monthly trends.</p>
                )}
              </div>
            </div>
          </RevealBlock>

          {/* Row 3: Top Category Story + Behavior */}
          <RevealBlock>
            <div className="w-full max-w-5xl px-6 grid md:grid-cols-2 gap-8 mb-24">

              {/* What you spend most on */}
              <div className="glass-card p-8 flex flex-col justify-between" style={{ borderColor: `${topCategoryColor}30` }}>
                <p className="overline mb-4" style={{ color: topCategoryColor }}>WHAT</p>
                <motion.h3
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  className="font-manrope font-bold text-3xl mb-3 text-[#e5e2e1]"
                >
                  <span style={{ color: topCategoryColor }}>{topCategory?.name || "No data"}</span>{" "}
                  is your biggest expense.
                </motion.h3>
                <p className="font-inter text-[#988ca0]">
                  ₹{(topCategory?.value || 0).toLocaleString('en-IN')} spent — that's{" "}
                  {metrics.expenses > 0 ? Math.round(((topCategory?.value || 0) / metrics.expenses) * 100) : 0}% of your total outflow.
                </p>
              </div>

              {/* Behavior flags */}
              <div className="flex flex-col gap-4">
                <p className="overline text-white/50">BEHAVIOR DETECTED</p>
                <BehaviorCard
                  icon={<TrendingUp size={18} />}
                  color="#8a2be2"
                  title={`Weekend spend: ${weekendPct}%`}
                  desc={weekendPct > 35
                    ? `${weekendPct}% of your budget goes on weekends — a high-leakage pattern.`
                    : "Your weekend spending is under control."}
                />
                <BehaviorCard
                  icon={<Zap size={18} />}
                  color={savingsRatePct >= 20 ? "#22c55e" : "#f97316"}
                  title={`Savings rate: ${savingsRatePct}%`}
                  desc={savingsRatePct >= 20
                    ? "Great! You're meeting the recommended 20% savings target."
                    : `You're saving ${savingsRatePct}% — below the 20% target. ${20 - savingsRatePct}% gap to close.`}
                />
                <BehaviorCard
                  icon={<ShoppingBag size={18} />}
                  color={discretionaryPct > 35 ? "#ef4444" : "#14b8a6"}
                  title={`Discretionary: ${discretionaryPct}%`}
                  desc={discretionaryPct > 35
                    ? `${discretionaryPct}% on wants (food/shopping/entertainment) — above the healthy 35% threshold.`
                    : `${discretionaryPct}% on discretionary spending — within healthy bounds.`}
                />
              </div>
            </div>
          </RevealBlock>
        </>
      )}
    </div>
  );
}

function SectionHeader({ title, subtitle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }}
      className="text-center mb-20"
    >
      <h2 className="font-manrope font-bold text-5xl mb-4 tracking-tight">{title}</h2>
      <p className="font-inter text-[#988ca0] text-lg tracking-wide">{subtitle}</p>
    </motion.div>
  );
}

function RevealBlock({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-150px" }} transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
}

function KpiCard({ label, value, color, icon }) {
  return (
    <div className="glass-card p-5 flex flex-col gap-2" style={{ borderColor: `${color}20` }}>
      <div className="flex items-center gap-2" style={{ color }}>
        {icon}
        <span className="font-inter text-xs uppercase tracking-widest text-[#988ca0]">{label}</span>
      </div>
      <span className="font-manrope font-bold text-2xl text-white">{value}</span>
    </div>
  );
}

function BehaviorCard({ icon, color, title, desc }) {
  return (
    <div className="glass-card p-5 flex items-start gap-4" style={{ borderColor: `${color}20` }}>
      <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: `${color}15`, color }}>
        {icon}
      </div>
      <div>
        <h4 className="font-manrope font-bold text-white mb-1">{title}</h4>
        <p className="text-sm font-inter text-[#988ca0]">{desc}</p>
      </div>
    </div>
  );
}
