import React from "react";
import { Input } from "../ui/input";
import {
  moneylineToDecimal,
  moneylineToSpread,
  decimalToMoneyline,
  spreadToAmerican,
  overUnderToMoneyline,
} from "@/lib/oddsConverter";

type Props = {
  selectedTeams: string[];
  sportsBook: {
    name: string;
    odds: {
      name: string;
      values: (string | { label: "O" | "U"; total: string; odds: string })[];
      type: "moneyline" | "overunder" | "spread";
    }[];
  };
  onOddsChange: (
    betTypeIndex: number,
    teamIndex: number,
    value: string
  ) => void;
};

const SportsbookTable: React.FC<Props> = ({
  selectedTeams,
  sportsBook,
  onOddsChange,
}) => {
  return (
    <div className="flex flex-row bg-slate-100 items-center border shadow-slate-300 shadow-md border-slate-300 justify-center w-[90%] mx-25 my-2.5 px-5 rounded-lg gap-5">
      <div className="h-25 bg-slate-200 w-[20%] flex flex-col mx-auto my-5 justify-center items-center">
        <span className="rounded-lg">{sportsBook.name}</span>
      </div>

      <table
        data-testid="sportsbook-table"
        className="h-25 bg-slate-100 w-[80%] mx-auto my-5 rounded-lg"
      >
        <thead className="sportsbook-table__head">
          <tr>
            <th className="always-left column-header w-[20%]">Team</th>
            {sportsBook.odds.map((odd) => (
              <th
                key={odd.name}
                className="responsive-left column-header w-[20%] justify-center items-center text-center"
              >
                {odd.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="sportsbook-table__body">
          {selectedTeams.map((team, teamIndex) => (
            <tr key={team}>
              <td className="always-left column-header w-[25%] whitespace-nowrap items-center text-center">
                {team}
              </td>
              {sportsBook.odds.map((odd, betTypeIndex) => {
                const value =
                  odd.type === "overunder"
                    ? (odd.values[teamIndex] as any).odds
                    : (odd.values[teamIndex] as string);

                const display =
                  odd.type === "moneyline"
                    ? moneylineToDecimal(value)
                    : odd.type === "spread"
                    ? spreadToAmerican(value)
                    : odd.type === "overunder"
                    ? overUnderToMoneyline(value)
                    : null;

                return (
                  <td
                    key={`${odd.name}-${team}`}
                    className="responsive-left column-header w-[25%] border-l border-slate-300 text-center px-1"
                  >
                    <div className="flex flex-row justify-center items-center gap-2">
                      <Input
                        type="text"
                        className="w-full text-center"
                        value={value}
                        onChange={(e) =>
                          onOddsChange(betTypeIndex, teamIndex, e.target.value)
                        }
                      />
                      {display && (
                        <div className="text-xs border-l-orange-500 color-orange-500 w-10 rounded-sm p-1 border-l-2 ml-0.5 flex">
                          {display}
                        </div>
                      )}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SportsbookTable;
