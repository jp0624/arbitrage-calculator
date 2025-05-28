// components/ArbitrageResults.tsx
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
  selectedTeams: string[];
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
          if (!oddsEntry) return;

          oddsEntry.values.forEach((oddStr, teamIndex) => {
            const odds = parseFloat(oddStr);
            if (!isNaN(odds) && odds !== 0) {
              // Convert American odds to Decimal
              const decimalOdds =
                odds > 0 ? 1 + odds / 100 : 1 + 100 / Math.abs(odds);
              oddsData.push({
                sportsbook: book.name,
                team: selectedTeams[teamIndex],
                odds: decimalOdds,
              });
            }
          });
        });

        // Find best odds for each team
        const bestOdds = selectedTeams.map(
          (team) =>
            oddsData
              .filter((o) => o.team === team)
              .sort((a, b) => b.odds - a.odds)[0]
        );

        if (bestOdds.some((o) => !o)) return null;

        const inverseSum = bestOdds.reduce(
          (acc, odd) => acc + 1 / (odd?.odds || 1),
          0
        );

        if (inverseSum >= 1) return null;

        const totalStake = defaultBetAmount;
        const opportunities = bestOdds.map((odd) => {
          const stake = (totalStake * (1 / odd.odds)) / inverseSum;
          return {
            ...odd,
            stake: parseFloat(stake.toFixed(2)),
            payout: parseFloat((stake * odd.odds).toFixed(2)),
          };
        });

        const guaranteedProfit = parseFloat(
          (opportunities[0].payout - totalStake).toFixed(2)
        );

        return {
          betType: betType.name,
          opportunities,
          totalStake,
          guaranteedProfit,
        };
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
