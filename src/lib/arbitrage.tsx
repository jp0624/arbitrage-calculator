type DynamicOdds = {
  sportsbook: string;
  [teamName: string]: number | string;
};

type ArbitrageResult = {
  margin: number;
  combination: { sportsbook: string; team: string; odds: number }[];
};

export function findBestArbitrage(
  oddsData: DynamicOdds[]
): ArbitrageResult | null {
  if (!oddsData || oddsData.length === 0) return null;

  const teamNames = Object.keys(oddsData[0]).filter((k) => k !== "sportsbook");

  if (teamNames.length < 2) return null;

  // Generate all combinations of best odds for each team from different books
  const combinations: ArbitrageResult[] = [];

  for (const sb1 of oddsData) {
    for (const sb2 of oddsData) {
      if (sb1.sportsbook === sb2.sportsbook) continue;

      const combination = teamNames.map((team, idx) => {
        const source = idx === 0 ? sb1 : sb2;
        return {
          sportsbook: source.sportsbook,
          team,
          odds: Number(source[team]),
        };
      });

      const impliedProbabilitySum = combination.reduce(
        (sum, o) => sum + 1 / o.odds,
        0
      );

      if (impliedProbabilitySum < 1) {
        combinations.push({
          margin: (1 - impliedProbabilitySum) * 100,
          combination,
        });
      }
    }
  }

  if (combinations.length === 0) return null;

  return combinations.reduce((best, curr) =>
    curr.margin > best.margin ? curr : best
  );
}
