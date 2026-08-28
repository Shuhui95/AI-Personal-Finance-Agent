export function formatCurrency(value) {
    const numericValue = Number(value);
  
    const safeValue = Number.isFinite(numericValue)
      ? numericValue
      : 0;
  
    return new Intl.NumberFormat("en-SG", {
      style: "currency",
      currency: "SGD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(safeValue);
  }