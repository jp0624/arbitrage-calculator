export type Outcome = {
  sportsbook: string;
  team: string;
  odds: number; // American odds
};

export type ArbitrageResult = {
  exists: boolean;
  profitPercent: number;
  totalStake: number;
  profit: number;
  bets: {
    sportsbook: string;
    team: string;
    odds: number;
    stake: number;
    payout: number;
  }[];
};

function americanToDecimal(odds: number): number {
  return odds > 0 ? odds / 100 + 1 : 100 / Math.abs(odds) + 1;
}

export function calculateArbitrage(
  outcomes: Outcome[],
  totalStake = 100
): ArbitrageResult {
  if (outcomes.length < 2) {
    return {
      exists: false,
      profitPercent: 0,
      totalStake,
      profit: 0,
      bets: [],
    };
  }

  const decimalOdds = outcomes.map((o) => ({
    ...o,
    decimal: americanToDecimal(o.odds),
  }));

  const impliedProbSum = decimalOdds.reduce((sum, o) => sum + 1 / o.decimal, 0);
  const exists = impliedProbSum < 1;

  if (!exists) {
    return {
      exists: false,
      profitPercent: 0,
      totalStake,
      profit: 0,
      bets: decimalOdds.map((o) => ({
        sportsbook: o.sportsbook,
        team: o.team,
        odds: o.odds,
        stake: 0,
        payout: 0,
      })),
    };
  }

  // Calculate individual stakes for each outcome
  const bets = decimalOdds.map((o) => {
    const stake = totalStake / o.decimal / impliedProbSum;
    const payout = stake * o.decimal;
    return {
      sportsbook: o.sportsbook,
      team: o.team,
      odds: o.odds,
      stake: parseFloat(stake.toFixed(2)),
      payout: parseFloat(payout.toFixed(2)),
    };
  });

  const payout = bets[0].payout; // all payouts should be approx equal
  const profit = payout - totalStake;
  const profitPercent = (profit / totalStake) * 100;

  return {
    exists: true,
    profitPercent: parseFloat(profitPercent.toFixed(2)),
    totalStake,
    profit: parseFloat(profit.toFixed(2)),
    bets,
  };
}
