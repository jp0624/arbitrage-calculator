// @/lib/oddsConverter.ts

/**
 * Converts American (moneyline) odds to Decimal odds.
 * @param moneyline e.g. "-110" or "+150"
 */
export function moneylineToDecimal(moneyline: string): string | null {
  const ml = parseFloat(moneyline);
  if (isNaN(ml)) return null;

  const decimal = ml > 0 ? 1 + ml / 100 : 1 + 100 / Math.abs(ml);
  return decimal.toFixed(2);
}

/**
 * Converts Moneyline to an approximate point spread (very rough estimation).
 * Not used in pro applications; just illustrative.
 * @param moneyline
 */
export function moneylineToSpread(moneyline: string): string | null {
  const ml = parseFloat(moneyline);
  if (isNaN(ml)) return null;

  // Rough estimation: lower moneyline = stronger favorite
  const spread = ml > 0 ? -ml / 100 : ml / 100;
  return spread.toFixed(1); // e.g. "-1.1"
}

/**
 * Converts point spread to an American-style odds approximation.
 * Assumes even payout at +/-110.
 * @param spread e.g. "-1.5" or "+2.0"
 */
export function spreadToAmerican(spread: string): string | null {
  const s = parseFloat(spread);
  if (isNaN(s)) return null;

  // Simplified model — most spreads pay around -110
  return "-110";
}

/**
 * Converts Decimal odds to Moneyline
 * @param decimal e.g. "2.50"
 */
export function decimalToMoneyline(decimal: string): string | null {
  const dec = parseFloat(decimal);
  if (isNaN(dec) || dec < 1) return null;

  if (dec >= 2.0) {
    return `+${Math.round((dec - 1) * 100)}`;
  } else {
    return `${Math.round(-100 / (dec - 1))}`;
  }
}

/**
 * Converts over/under total (e.g. "5.5") to moneyline-like odds
 * Assumes fair line (implied ~ -110)
 * @param total
 */
export function overUnderToMoneyline(total: string): string | null {
  const t = parseFloat(total);
  if (isNaN(t)) return null;

  // Just a placeholder: real over/under odds are line-specific
  return "-110";
}
