"use client";

import React, { useState, useEffect } from "react";

// Convert American to decimal odds
const convertToDecimal = (american: number): number =>
  american > 0 ? (american / 100) + 1 : (100 / Math.abs(american)) + 1;

function ArbitrageCalculator() {
  const [odds, setOdds] = useState([
    {
      team: "Dallass",
      puckline: { odds: 1.5, payout: 2.1 },
      total: { type: "Over", line: 6.5, odds: 1.9 },
      moneyline: { american: 120 },
    },
    {
      team: "Edmonton",
      puckline: { odds: -1.5, payout: 1.8 },
      total: { type: "Under", line: 6.5, odds: 1.95 },
      moneyline: { american: -142 },
    },
  ]);

  const [betAmount, setBetAmount] = useState(100);
  const [arbitrageResults, setArbitrageResults] = useState<any[]>([]);

  useEffect(() => {
    calculateAllArbitrage();
  }, [odds, betAmount]);

  const calculateArbitrage = (
    type: string,
    odds1: number,
    odds2: number,
    team1: string,
    team2: string
  ) => {
    const implied = (1 / odds1) + (1 / odds2);
    if (implied < 1) {
      const stake1 = betAmount;
      const stake2 = (stake1 * odds1) / odds2;
      const totalStake = stake1 + stake2;
      const payout1 = stake1 * odds1;
      const payout2 = stake2 * odds2;

      return {
        type,
        margin: implied,
        bets: [
          {
            team: team1,
            odds: odds1.toFixed(2),
            stake: stake1.toFixed(2),
            payout: payout1.toFixed(2),
          },
          {
            team: team2,
            odds: odds2.toFixed(2),
            stake: stake2.toFixed(2),
            payout: payout2.toFixed(2),
          },
        ],
        totalStake: totalStake.toFixed(2),
        guaranteedPayout: Math.min(payout1, payout2).toFixed(2),
      };
    }
    return null;
  };

  const calculateAllArbitrage = () => {
    const team1 = odds[0];
    const team2 = odds[1];

    const results = [];

    const moneyline1 = convertToDecimal(team1.moneyline.american);
    const moneyline2 = convertToDecimal(team2.moneyline.american);
    const moneylineResult = calculateArbitrage("Moneyline", moneyline1, moneyline2, team1.team, team2.team);
    if (moneylineResult) results.push(moneylineResult);

    const pucklineResult = calculateArbitrage("Puckline", team1.puckline.payout, team2.puckline.payout, team1.team, team2.team);
    if (pucklineResult) results.push(pucklineResult);

    const totalResult = calculateArbitrage(
      "Total",
      team1.total.odds,
      team2.total.odds,
      `${team1.team} ${team1.total.type}`,
      `${team2.team} ${team2.total.type}`
    );
    if (totalResult) results.push(totalResult);

    setArbitrageResults(results);
  };

  const handleInputChange = (value: string, teamIndex: number, type: string, field: string) => {
    const newOdds = [...odds];
    const val = parseFloat(value);
    if (type === "moneyline") {
      newOdds[teamIndex][type][field] = isNaN(val) ? 0 : val;
    } else {
      newOdds[teamIndex][type][field] = isNaN(val) ? 0 : val;
    }
    setOdds(newOdds);
  };

  return (
    <div style={{ maxWidth: 800, margin: "auto", fontFamily: "Arial, sans-serif" }}>
      <h2>Arbitrage Betting Calculator</h2>

      <label>
        Bet Amount on Team 1 ($):
        <input
          type="number"
          value={betAmount}
          onChange={(e) => setBetAmount(parseFloat(e.target.value))}
          style={{ marginLeft: 10 }}
        />
      </label>

      <table border={1} cellPadding={10} style={{ width: "100%", marginTop: 30, textAlign: "center" }}>
        <thead>
          <tr>
            <th>Team</th>
            <th>Puckline</th>
            <th>Payout</th>
            <th>Total</th>
            <th>Total Odds</th>
            <th>Moneyline</th>
          </tr>
        </thead>
        <tbody>
          {odds.map((o, i) => (
            <tr key={i}>
              <td>{o.team}</td>
              <td>{o.puckline.odds}</td>
              <td>
                <input
                  type="number"
                  value={o.puckline.payout}
                  onChange={(e) => handleInputChange(e.target.value, i, "puckline", "payout")}
                  style={{ width: 60 }}
                />
              </td>
              <td>{o.total.type} {o.total.line}</td>
              <td>
                <input
                  type="number"
                  value={o.total.odds}
                  onChange={(e) => handleInputChange(e.target.value, i, "total", "odds")}
                  style={{ width: 60 }}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={o.moneyline.american}
                  onChange={(e) => handleInputChange(e.target.value, i, "moneyline", "american")}
                  style={{ width: 60 }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 style={{ marginTop: 30 }}>Arbitrage Opportunities</h3>
      {arbitrageResults.length > 0 ? (
        arbitrageResults.map((res, idx) => (
          <div key={idx} style={{ backgroundColor: "slategray", padding: 15, marginBottom: 20, borderRadius: 8 }}>
            <h4>{res.type} Arbitrage</h4>
            <p>Margin: {(res.margin * 100).toFixed(2)}%</p>
            <p>Total Stake: ${res.totalStake}</p>
            <p>Guaranteed Payout: ${res.guaranteedPayout}</p>
            <ul>
              {res.bets.map((bet: any, i: number) => (
                <li key={i}>
                  Bet ${bet.stake} on <strong>{bet.team}</strong> at odds {bet.odds} → Payout: ${bet.payout}
                </li>
              ))}
            </ul>
          </div>
        ))
      ) : (
        <p style={{ color: "darkred" }}>No arbitrage opportunity currently exists. Try adjusting odds.</p>
      )}
    </div>
  );
}

export default ArbitrageCalculator;
