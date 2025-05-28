import React from "react";
import { Input } from "../ui/input";

type Props = {
  selectedTeams: string[];
  sportsBook: {
    name: string;
    odds: { name: string; values: string[] }[];
  };
  betTypes: { name: string }[];
  onOddsChange: (
    betTypeIndex: number,
    teamIndex: number,
    value: string
  ) => void;
};

const SportsbookTable: React.FC<Props> = ({
  selectedTeams,
  sportsBook,
  betTypes,
  onOddsChange,
}) => {
  return (
    <div className="flex flex-row bg-slate-100 items-center border shadow-slate-300 shadow-md border-slate-300 justify-center w-[90%] mx-25 my-2.5 px-5 rounded-lg gap-5">
      <div className="h-25 bg-slate-200 w-[25%] flex flex-col mx-auto my-5 justify-center items-center">
        <span className="rounded-lg">{sportsBook.name}</span>
      </div>

      <table
        data-testid="sportsbook-table"
        className="h-25 bg-slate-100 w-[75%] mx-auto my-5 rounded-lg"
      >
        <thead className="sportsbook-table__head">
          <tr>
            <th className="always-left column-header w-[40%]">Team</th>
            {sportsBook.odds.map((betType, betTypeIndex) => (
              <th
                key={betType.name}
                className="responsive-left column-header w-[20%] justify-center items-center text-center"
              >
                {betType.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="sportsbook-table__body">
          {selectedTeams.map((team, teamIndex) => (
            <tr key={team}>
              <td className="always-left column-header w-[40%] whitespace-nowrap items-center text-center">
                {team}
              </td>
              {sportsBook.odds.map((betType, betTypeIndex) => (
                <td
                  key={`${betType.name}-${team}`}
                  className="responsive-left column-header w-[20%]"
                >
                  <Input
                    type="number"
                    step="0.01"
                    className="w-full text-center"
                    value={betType.values[teamIndex] || ""}
                    onChange={(e) =>
                      onOddsChange(betTypeIndex, teamIndex, e.target.value)
                    }
                  />
                </td>
              ))}
            </tr>
          ))}
          {/* Removed extra "Best Arbitrage" row as requested */}
        </tbody>
      </table>
    </div>
  );
};

export default SportsbookTable;
