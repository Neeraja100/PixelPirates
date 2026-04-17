export function formatMoney(value) {
  return `Rs ${Number(value || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
}

export function percent(value) {
  return `${Math.round(Number(value || 0) * 100)}%`;
}
