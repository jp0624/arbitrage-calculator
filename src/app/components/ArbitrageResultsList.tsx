// components/ArbitrageResultsList.tsx

import React from "react";
import { ArbitrageOpportunity } from "@/lib/findArbitrage";

type ArbitrageResultsListProps = {
  opportunities: ArbitrageOpportunity[];
};

const ArbitrageResultsList: React.FC<ArbitrageResultsListProps> = ({
  opportunities,
}) => {
  if (opportunities.length === 0) {
    return (
      <p className="text-gray-500 mt-4">No arbitrage opportunities found.</p>
    );
  }

  return (
    <div className="mt-6 space-y-4">
      {opportunities.map((arb, index) => (
        <div
          key={index}
          className="border border-gray-300 rounded-xl p-4 shadow bg-white"
        >
          <h3 className="text-lg font-bold mb-2 uppercase">{arb.betType}</h3>
          {arb.outcomes.map((outcome, i) => (
            <div key={i} className="text-sm">
              Bet on <strong>{outcome.team}</strong> at{" "}
              <strong>{outcome.sportsbook}</strong>: $
              {outcome.betAmount.toFixed(2)} @ {outcome.odds} → Payout: $
              {outcome.payout.toFixed(2)}
            </div>
          ))}
          <div className="text-sm mt-2">
            <strong>Total Bet:</strong> ${arb.totalBet.toFixed(2)}
            <br />
            <strong>Profit:</strong> ${arb.profit.toFixed(2)}
            <br />
            <strong>Margin:</strong> {arb.margin.toFixed(2)}%
          </div>
        </div>
      ))}
    </div>
  );
};

export default ArbitrageResultsList;
