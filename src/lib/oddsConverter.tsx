/**
 * Converts American (moneyline) odds to Decimal odds.
 */
export function moneylineToDecimal(moneyline: string): string | null {
  const ml = parseFloat(moneyline);
  if (isNaN(ml)) return null;

  const decimal = ml > 0 ? 1 + ml / 100 : 1 + 100 / Math.abs(ml);
  return decimal.toFixed(2);
}

/**
 * Converts Moneyline to an approximate point spread (very rough estimation).
 */
export function moneylineToSpread(moneyline: string): string | null {
  const ml = parseFloat(moneyline);
  if (isNaN(ml)) return null;

  const spread = ml > 0 ? -ml / 100 : ml / 100;
  return spread.toFixed(1);
}

/**
 * Converts point spread to an approximate American-style odds.
 */
export function spreadToAmerican(spread: string): string | null {
  const num = parseFloat(spread);
  if (isNaN(num)) return null;

  if (num < 0) {
    return (-100 / num).toFixed(0); // e.g. -1.5 => +66
  } else {
    return (num * 100).toFixed(0); // e.g. +1.5 => +150
  }
}

/**
 * Converts Decimal odds to Moneyline
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
 * Converts over/under total to placeholder moneyline odds.
 */
export function overUnderToMoneyline(total: string): string | null {
  const t = parseFloat(total);
  if (isNaN(t)) return null;

  return "-110"; // placeholder
}

/**
 * Converts moneyline to implied win probability.
 */
export function moneylineToProbability(moneyline: string): number | null {
  const ml = parseInt(moneyline);
  if (isNaN(ml)) return null;

  let result;
  if (ml > 0) {
    result = (100 / (ml + 100)) * 100;
  } else {
    result = (-ml / (-ml + 100)) * 100;
  }
  return Number(result.toFixed(0));
}

function isAmericanOdds(odds: string): boolean {
  return /^[-+]\d+$/.test(odds.trim());
}

export function decimalToAmericanOdds(decimalOdds: number | string): number {
  const dec = parseFloat(decimalOdds as string);
  if (dec >= 2.0) {
    return Math.round((dec - 1) * 100);
  } else {
    return Math.round(-100 / (dec - 1));
  }
}

export function americanToDecimalOdds(american: string): number {
  const value = parseInt(american, 10);
  if (value > 0) {
    return value / 100 + 1;
  } else {
    return 100 / Math.abs(value) + 1;
  }
}

export function normalizeOdds(odds: string): string {
  const trimmed = odds.trim();

  if (isAmericanOdds(trimmed)) {
    return trimmed;
  }

  const parsed = parseFloat(trimmed);
  if (isNaN(parsed)) return "Invalid";

  return decimalToAmericanOdds(parsed).toString();
}
