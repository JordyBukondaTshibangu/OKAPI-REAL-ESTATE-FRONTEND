export function formatTotalValue(usd: number): string {
  if (usd >= 1e9) return `${(usd / 1e9).toFixed(1)}B$`;
  if (usd >= 1e6) return `${(usd / 1e6).toFixed(1)}M$`;
  return `${usd.toLocaleString("fr-FR")}$`;
}
