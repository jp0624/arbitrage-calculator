import { findBestArbitrage } from "@/lib/arbitrage";
import React from "react";

type Team = { name: string };
type BetType = { name: string };
type Sport = {
  name: string;
  teams: { name: string }[];
  betTypes?: BetType[]; // make optional
};

type Props = {
  sport?: Sport;
  selectedTeams: string[];
  defaultBetAmount: number;
};

const SportsbookTable: React.FC<Props> = ({
  sport,
  selectedTeams,
  defaultBetAmount,
}) => {
  if (!sport || selectedTeams.length < 2) return null;
  console.log("Selected Teams:", selectedTeams);
  // Define a type for sportsbook objects with dynamic team odds
  type Sportsbook = {
    sportsbook: string;
    [team: string]: string | number;
  };

  // Dynamically build sportsbooks with dummy odds
  const sportsbooks: Sportsbook[] = [
    {
      sportsbook: "Bet365",
      ...Object.fromEntries(selectedTeams.map((team) => [team, 1.9])),
    },
    {
      sportsbook: "FanDuel",
      ...Object.fromEntries(selectedTeams.map((team) => [team, 2.0])),
    },
    {
      sportsbook: "DraftKings",
      ...Object.fromEntries(selectedTeams.map((team) => [team, 2.05])),
    },
  ];

  const result = findBestArbitrage(sportsbooks);

  if (result) {
    console.log("✅ Arbitrage Found:", result);
  } else {
    console.log("❌ No arbitrage opportunity.");
  }

  return (
    <div className="flex flex-col items-center justify-center w-[75%] mx-auto">
      <header className="h-25 bg-slate-600 w-full mx-auto my-5 rounded-lg" />

      <table className="sportsbook-table" data-testid="sportsbook-table">
        <thead className="sportsbook-table__head">
          <tr>
            <th className="always-left column-header w-[40%]">Team</th>
            {sport?.betTypes?.map((betType) => (
              <th
                key={betType.name}
                className="responsive-left column-header w-[20%]"
              >
                {betType.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="sportsbook-table__body">
          {selectedTeams.map((team) => (
            <tr key={team}>
              <td className="always-left column-header w-[40%]">{team}</td>
            </tr>
          ))}
          <tr>
            <td className="always-left column-header w-[40%]">
              Best Arbitrage
            </td>
            <td
              key={sport?.betTypes?.[0]?.name}
              className="responsive-left column-header w-[20%]"
            >
              {result ? `${result.margin.toFixed(2)}%` : "No arb"}
            </td>
            <td></td>
            <td></td>
            {/* {sport?.betTypes?.map((betType) => (
              <td
                key={betType.name}
                className="responsive-left column-header w-[20%]"
              >
                {result ? `${result.margin.toFixed(2)}%` : "No arb"}
              </td>
            ))} */}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default SportsbookTable;
