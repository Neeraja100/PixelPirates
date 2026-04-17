// Simulates mockup-specific data structures using transaction data or basic defaults.

export function generatePortfolioSim(transactions) {
  // Mock logic: derive a fake portfolio from total transaction volume or random seed if empty
  const totalVolume = transactions?.reduce((sum, t) => sum + Math.abs(t.amount), 0) || 50000;
  
  // Create an arbitrary split to match the look
  const liquid = totalVolume * 1.5; // Faked 
  const investments = totalVolume * 4.2;
  const fixed = totalVolume * 2.8;

  return {
    valuation: liquid + investments + fixed,
    liquid,
    investments,
    fixed,
    sparkline: Array.from({ length: 14 }).map((_, i) => ({
      name: `Day ${i}`,
      value: (liquid + investments + fixed) * (1 - (Math.random() * 0.1 - 0.05)) // +/- 5% random walk
    }))
  };
}

export function generateSpendingDensity(transactions) {
  // Returns a 7x4 grid for a heatmap. 7 days, 4 weeks. (28 items)
  // Higher value -> brighter purple.
  const grid = [];
  for (let week = 0; week < 4; week++) {
    for (let day = 0; day < 7; day++) {
      grid.push({
        week,
        day,
        value: Math.random() * 100 // Simulate random frequency
      });
    }
  }
  return grid;
}

export function generatePaymentMethods(metrics) {
  // Doughnut chart breakdown
  return [
    { name: "Online Trans.", value: (metrics?.expenses || 1000) * 0.7, fill: "#080cff" },
    { name: "Physical Cash", value: (metrics?.expenses || 1000) * 0.3, fill: "#4c4354" }
  ];
}

export function generateMidnightImpulses(transactions) {
  // Golden bar chart of late night spending frequency
  return Array.from({ length: 7 }).map((_, i) => ({
    timeBox: `Box ${i}`,
    intensity: Math.random() * 100
  }));
}

export function generateGhostSubscriptions(transactions) {
  // Find recurring-looking small charges
  const subs = (transactions || []).filter(t => t.amount < 0 && Math.abs(t.amount) < 30).slice(0, 3);
  if (subs.length === 0) {
    return [
      { name: "Streaming Cloud+", amount: -14.99 },
      { name: "Vintage Filter Pro", amount: -4.99 },
    ];
  }
  return subs.map(s => ({
    name: s.description || "Unknown Subscription",
    amount: s.amount
  }));
}
