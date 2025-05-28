"use client";
import React from "react";

type ArbitrageOpportunity = {
  betType: string;
  opportunities: {
    sportsbook: string;
    team: string;
    odds: number;
    stake: number;
    payout: number;
  }[];
  totalStake: number;
  guaranteedProfit: number;
};

interface Props {
  sportsBooks: {
    name: string;
    odds: { name: string; values: string[] }[];
  }[];
  selectedTeams: string[]; // exactly two for two-way market
  betTypes: { name: string }[];
  defaultBetAmount: number;
}

function ArbitrageResults({
  sportsBooks,
  selectedTeams,
  betTypes,
  defaultBetAmount,
}: Props) {
  const calculateArbitrage = (): ArbitrageOpportunity[] => {
    return betTypes
      .map((betType) => {
        const oddsData: {
          sportsbook: string;
          team: string;
          odds: number;
        }[] = [];

        sportsBooks.forEach((book) => {
          const oddsEntry = book.odds.find((o) => o.name === betType.name);
          if (!oddsEntry || oddsEntry.values.length < 2) return;

          oddsEntry.values.forEach((oddStr, teamIndex) => {
            const odds = parseFloat(oddStr);
            if (!isNaN(odds) && odds !== 0) {
              const decimalOdds = odds;
              // odds > 0 ? 1 + odds / 100 : 1 + 100 / Math.abs(odds);
              oddsData.push({
                sportsbook: book.name,
                team: selectedTeams[teamIndex],
                odds: decimalOdds,
              });
            }
          });
        });

        if (selectedTeams.length !== 2) return null;

        let bestCombo: ArbitrageOpportunity | null = null;
        let lowestImpliedProb = Infinity;

        // Try all combinations where each team is from a different sportsbook
        for (const team1Odds of oddsData.filter(
          (o) => o.team === selectedTeams[0]
        )) {
          for (const team2Odds of oddsData.filter(
            (o) => o.team === selectedTeams[1]
          )) {
            if (team1Odds.sportsbook === team2Odds.sportsbook) continue;

            const implied = 1 / team1Odds.odds + 1 / team2Odds.odds;

            if (implied < 1 && implied < lowestImpliedProb) {
              const stake1 =
                (defaultBetAmount * (1 / team1Odds.odds)) / implied;
              const stake2 =
                (defaultBetAmount * (1 / team2Odds.odds)) / implied;
              const totalStake = stake1 + stake2;
              const payout = stake1 * team1Odds.odds;
              const guaranteedProfit = payout - totalStake;

              if (
                guaranteedProfit > 0 &&
                isFinite(stake1) &&
                isFinite(stake2) &&
                stake1 >= 0 &&
                stake2 >= 0
              ) {
                lowestImpliedProb = implied;

                bestCombo = {
                  betType: betType.name,
                  opportunities: [
                    {
                      ...team1Odds,
                      stake: parseFloat(stake1.toFixed(2)),
                      payout: parseFloat((stake1 * team1Odds.odds).toFixed(2)),
                    },
                    {
                      ...team2Odds,
                      stake: parseFloat(stake2.toFixed(2)),
                      payout: parseFloat((stake2 * team2Odds.odds).toFixed(2)),
                    },
                  ],
                  totalStake: parseFloat(totalStake.toFixed(2)),
                  guaranteedProfit: parseFloat(guaranteedProfit.toFixed(2)),
                };
              }
            }
          }
        }

        return bestCombo;
      })
      .filter(Boolean) as ArbitrageOpportunity[];
  };

  const results = calculateArbitrage();

  return (
    <div className="w-[90%] mx-auto mb-4">
      {results.length === 0 && (
        <p className="text-center text-red-500 my-4">
          No arbitrage opportunities found.
        </p>
      )}

      {results.map((result) => (
        <div
          key={result.betType}
          className="bg-green-50 border border-green-400 p-4 rounded-lg shadow-md my-4"
        >
          <h2 className="text-xl font-semibold mb-2">
            {result.betType} Arbitrage Opportunity
          </h2>
          <ul>
            {result.opportunities.map((o, i) => (
              <li key={i} className="mb-1">
                <strong>Bet</strong> ${o.stake} on <strong>{o.team}</strong> at{" "}
                <strong>{o.sportsbook}</strong> ({o.odds.toFixed(2)} odds) →
                Payout: ${o.payout}
              </li>
            ))}
          </ul>
          <p className="mt-2 font-medium">
            Total Investment: ${result.totalStake}
          </p>
          <p className="text-green-700 font-bold">
            Guaranteed Profit: ${result.guaranteedProfit}
          </p>
        </div>
      ))}
    </div>
  );
}

export default ArbitrageResults;
