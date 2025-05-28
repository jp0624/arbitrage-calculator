import React from "react";

function FindBestArbitrage() {
  type Odds = { sportsbook: string; team1: number; team2: number };
  function findBestArbitrage(oddsData: Odds[]) {
    let bestOpportunity = null;
    let lowestImpliedProb = Infinity;

    for (let i = 0; i < oddsData.length; i++) {
      for (let j = 0; j < oddsData.length; j++) {
        if (i === j) continue;

        const book1 = oddsData[i];
        const book2 = oddsData[j];

        const team1Odds = book1.team1;
        const team2Odds = book2.team2;

        const impliedProb = 1 / team1Odds + 1 / team2Odds;

        if (impliedProb < 1 && impliedProb < lowestImpliedProb) {
          lowestImpliedProb = impliedProb;
          bestOpportunity = {
            team1_sportsbook: book1.sportsbook,
            team1_odds: team1Odds,
            team2_sportsbook: book2.sportsbook,
            team2_odds: team2Odds,
            arbitrage_margin: Number(impliedProb.toFixed(4)),
          };
        }
      }
    }

    return bestOpportunity;
  }

  const oddsList = [
    { sportsbook: "Bet365", team1: 1.9, team2: 1.9 },
    { sportsbook: "FanDuel", team1: 2.0, team2: 1.8 },
    { sportsbook: "DraftKings", team1: 1.85, team2: 2.05 },
  ];

  const result = findBestArbitrage(oddsList);

  if (result) {
    console.log("Arbitrage Opportunity Found:", result);
  } else {
    console.log("No arbitrage opportunity.");
  }

  return (
    <div>
      {result ? (
        <div>
          <div>Team 1 Sportsbook: {result.team1_sportsbook}</div>
          <div>Team 1 Odds: {result.team1_odds}</div>
          <div>Team 2 Sportsbook: {result.team2_sportsbook}</div>
          <div>Team 2 Odds: {result.team2_odds}</div>
          <div>Arbitrage Margin: {result.arbitrage_margin}</div>
        </div>
      ) : (
        <div>No arbitrage opportunity.</div>
      )}
    </div>
  );
}

export default FindBestArbitrage;
