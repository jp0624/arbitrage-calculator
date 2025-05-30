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
 * Converts moneyline to implied win probability (percentage).
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

/**
 * Converts Decimal odds to American moneyline odds.
 */
export function decimalToAmericanOdds(decimalOdds: number | string): number {
  const dec = parseFloat(decimalOdds as string);
  if (dec >= 2.0) {
    return Math.round((dec - 1) * 100);
  } else {
    return Math.round(-100 / (dec - 1));
  }
}

/**
 * Converts American moneyline odds to Decimal odds.
 */
export function americanToDecimalOdds(american: string): number {
  const value = parseInt(american, 10);
  if (value > 0) {
    return value / 100 + 1;
  } else {
    return 100 / Math.abs(value) + 1;
  }
}
