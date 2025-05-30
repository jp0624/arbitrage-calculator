import React from "react";
import { ArbitrageResultData } from "./Calculator";

interface ArbitrageResultsProps {
  results: ArbitrageResultData;
}

const ArbitrageResults: React.FC<ArbitrageResultsProps> = ({ results }) => {
  return (
    <div className="mt-6">
      {Object.entries(results).map(([betType, data]) => (
        <div key={betType} className="mb-4">
          <h3 className="font-semibold text-lg capitalize">{betType}</h3>
          {data.map((item, index) => (
            <div
              key={index}
              className={`p-2 rounded border mt-2 ${
                item.isArbitrage ? "border-green-500" : "border-gray-300"
              }`}
            >
              <p className="font-medium">Sportsbook: {item.sportsbook}</p>
              <p>Odds: {item.odds.join(" / ")}</p>
              {item.isArbitrage ? (
                <>
                  <p>Arbitrage Margin: {item.arbitrageMargin.toFixed(2)}%</p>
                  <p>
                    Bet Amounts:{" "}
                    {item.betAmounts.map((amt, i) => (
                      <span key={i}>
                        {i > 0 && ", "}Team {i + 1}: ${amt.toFixed(2)}
                      </span>
                    ))}
                  </p>
                  <p>Profit: ${item.profit.toFixed(2)}</p>
                  <p>Payout: ${item.payout.toFixed(2)}</p>
                </>
              ) : (
                <p className="text-gray-500">No arbitrage opportunity</p>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ArbitrageResults;
