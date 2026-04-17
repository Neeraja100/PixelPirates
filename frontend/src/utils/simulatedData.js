// Real-time derivation of mockup-specific data structures using pure transaction arrays.

export function generatePortfolioSim(transactions) {
  if (!transactions || transactions.length === 0) {
    return {
      valuation: 0,
      liquid: 0,
      investments: 0,
      fixed: 0,
      sparkline: Array.from({ length: 14 }).map((_, i) => ({ name: `Tx ${i}`, value: 0 }))
    };
  }

  const transactionsArray = transactions || [];
  
  const investments = transactionsArray
    .filter(t => ["investment", "saving", "stocks", "crypto", "mutual funds", "deposit"].includes(t.category?.toLowerCase() || ""))
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    
  const fixed = transactionsArray
    .filter(t => ["rent", "mortgage", "subscription", "insurance", "loan", "emi", "utilities"].includes(t.category?.toLowerCase() || ""))
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    
  const totalVolume = transactionsArray.reduce((sum, t) => sum + Math.abs(t.amount), 0);
  
  let liquid = totalVolume - investments - fixed;
  if (liquid < 0) liquid = 0;

  const valuation = liquid + investments + fixed;

  let runningVal = 0;
  const sparkline = transactionsArray.slice(-14).map((t, i) => {
      runningVal += Math.abs(t.amount);
      return { name: `Tx ${i}`, value: runningVal };
  });

  return {
    valuation,
    liquid,
    investments,
    fixed,
    sparkline: sparkline.length > 0 ? sparkline : Array.from({ length: 14 }).map((_, i) => ({ name: `Tx ${i}`, value: 0 }))
  };
}

export function generateSpendingDensity(transactions) {
  if (!transactions || transactions.length === 0) {
    return Array.from({ length: 28 }).map((_, i) => ({ week: Math.floor(i / 7), day: i % 7, value: 0 }));
  }
  
  const grid = Array.from({ length: 28 }).map((_, i) => ({ week: Math.floor(i / 7), day: i % 7, value: 0 }));
  
  transactions.forEach((t) => {
      const timeVal = new Date(t.date || new Date()).getTime();
      const pos = Math.abs(Math.floor(timeVal / (1000 * 60 * 60 * 24))) % 28;
      grid[pos].value += Math.abs(t.amount);
  });
  
  const max = Math.max(...grid.map(g => g.value), 1);
  return grid.map(g => ({ ...g, value: (g.value / max) * 100 }));
}

export function generatePaymentMethods(metrics, transactions = []) {
  if (!metrics || metrics.expenses === 0) {
    return [
      { name: "Digital", value: 0, fill: "#080cff" },
      { name: "Cash", value: 0, fill: "#4c4354" }
    ];
  }
  const expenses = metrics.expenses;
  return [
    { name: "Digital", value: expenses, fill: "#080cff" },
  ];
}

export function generateMidnightImpulses(transactions) {
  if (!transactions || transactions.length === 0) {
      return Array.from({ length: 7 }).map((_, i) => ({ timeBox: `Box ${i}`, intensity: 0 }));
  }
  
  const chunks = Array.from({ length: 7 }).map((_, i) => ({ timeBox: `Phase ${i}`, intensity: 0 }));
  transactions.forEach((t, i) => {
      const idx = i % 7;
      chunks[idx].intensity += Math.abs(t.amount);
  });
  
  const max = Math.max(...chunks.map(c => c.intensity), 1);
  return chunks.map(c => ({ ...c, intensity: (c.intensity / max) * 100 }));
}

export function generateGhostSubscriptions(transactions) {
  if (!transactions || transactions.length === 0) return [];
  
  return transactions
    .filter(t => t.type === "expense" && Math.abs(t.amount) < 30)
    .slice(0, 3)
    .map(s => ({
      name: s.description || s.category || "Unknown Subscription",
      amount: s.amount
    }));
}
