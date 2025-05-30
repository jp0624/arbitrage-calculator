// utils/findArbitrage.ts

export type OddsEntry = {
  sportsbook: string;
  odds: number;
};

export type TeamOdds = {
  [teamName: string]: OddsEntry[];
};

export type SportsbookOdds = {
  [betType: string]: TeamOdds;
};

export type ArbitrageOutcome = {
  team: string;
  sportsbook: string;
  odds: number;
  betAmount: number;
  payout: number;
};

export type ArbitrageOpportunity = {
  betType: string;
  outcomes: ArbitrageOutcome[];
  totalBet: number;
  profit: number;
  margin: number;
};

export const findArbitrage = (
  oddsData: SportsbookOdds,
  defaultBetAmount: number
): ArbitrageOpportunity[] => {
  const opportunities: ArbitrageOpportunity[] = [];

  Object.entries(oddsData).forEach(([betType, teamOdds]) => {
    const teams = Object.keys(teamOdds);
    if (teams.length !== 2) return;

    const [team1, team2] = teams;
    const team1Odds = teamOdds[team1];
    const team2Odds = teamOdds[team2];

    team1Odds.forEach((team1Entry) => {
      team2Odds.forEach((team2Entry) => {
        const outcome1Odds = team1Entry.odds;
        const outcome2Odds = team2Entry.odds;

        const margin = 1 / outcome1Odds + 1 / outcome2Odds;

        if (margin < 1) {
          const stake1 = defaultBetAmount / (1 + outcome1Odds / outcome2Odds);
          const stake2 = defaultBetAmount - stake1;
          const payout1 = stake1 * outcome1Odds;
          const payout2 = stake2 * outcome2Odds;
          const profit = Math.min(payout1, payout2) - defaultBetAmount;

          opportunities.push({
            betType,
            outcomes: [
              {
                team: team1,
                sportsbook: team1Entry.sportsbook,
                odds: outcome1Odds,
                betAmount: stake1,
                payout: payout1,
              },
              {
                team: team2,
                sportsbook: team2Entry.sportsbook,
                odds: outcome2Odds,
                betAmount: stake2,
                payout: payout2,
              },
            ],
            totalBet: defaultBetAmount,
            profit,
            margin: margin * 100,
          });
        }
      });
    });
  });

  return opportunities;
};
