import Image from "next/image";
import React from "react";
import { Input } from "@/components//ui/input";
import {
  moneylineToProbability,
  decimalToAmericanOdds,
} from "@/lib/oddsConverter";

type Props = {
  selectedTeams: string[];
  sportsBook: {
    logo?: any;
    name: string;
    odds: {
      name: string;
      values: { label?: "Over" | "Under"; total: string }[];
      type: "moneyline" | "overunder" | "spread" | "total" | "puckline";
    }[];
  };
  onOddsChange: (
    betTypeIndex: number,
    teamIndex: number,
    value: string,
    label?: "Over" | "Under"
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
        {sportsBook.logo ? (
          <Image
            src={
              sportsBook.logo.startsWith("http")
                ? sportsBook.logo
                : `${sportsBook.logo}`
            }
            alt={sportsBook.name}
            className="w-16 h-16 mt-2"
            width={64}
            height={64}
          />
        ) : (
          <span className="rounded-lg">{sportsBook.name}</span>
        )}
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
                className="responsive-left column-header w-[20%] text-center font-medium"
              >
                {odd.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="sportsbook-table__body">
          {selectedTeams.map((team, teamIndex) => (
            <tr key={team}>
              <td className="always-left column-header w-[25%] text-center whitespace-nowrap">
                {team}
              </td>
              {sportsBook.odds.map((odd, betTypeIndex) => {
                const value = odd.values[teamIndex];
                const rawTotal = value?.total || "";

                let displayOdds = "-";
                const parsed = parseFloat(rawTotal);
                if (!isNaN(parsed) && parsed > 1.0) {
                  try {
                    displayOdds = decimalToAmericanOdds(parsed).toString();
                  } catch {
                    displayOdds = "-";
                  }
                }

                if (odd.type === "moneyline" && !isNaN(parsed)) {
                  const americanOdds = decimalToAmericanOdds(parsed);
                  const impliedProb = moneylineToProbability(
                    americanOdds.toString()
                  );
                  displayOdds =
                    impliedProb !== null ? impliedProb.toFixed(0) + "%" : "-";
                }

                return (
                  <td
                    key={odd.name + teamIndex}
                    className="text-center w-[20%]"
                  >
                    <div className="flex flex-row items-center justify-center">
                      {odd.type === "overunder" && (
                        <span
                          onClick={() =>
                            onOddsChange(
                              betTypeIndex,
                              teamIndex,
                              rawTotal,
                              value?.label === "Over" ? "Under" : "Over"
                            )
                          }
                          className={`cursor-pointer text-sm w-10 h-5 block ml-2 rounded-sm text-center text-white ${
                            value?.label === "Over"
                              ? "bg-slate-600"
                              : "bg-red-600"
                          }`}
                        >
                          {value?.label === "Over" ? "O" : "U"}
                        </span>
                      )}
                      <Input
                        type="number"
                        className="w-full text-center"
                        value={rawTotal}
                        onChange={(e) =>
                          onOddsChange(
                            betTypeIndex,
                            teamIndex,
                            e.target.value,
                            value?.label
                          )
                        }
                      />
                      <div className="text-[.65rem] px-2 font-bold bg-slate-300 justify-center items-center mr-1 w-12 rounded-sm p-0.5 border-l-2 ml-0.5 flex text-slate-600">
                        {displayOdds}
                      </div>
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}

          {/* Probabilities row */}
          <tr className="bg-slate-200">
            <td className="font-semibold text-xs justify-center items-center text-center text-slate-600">
              Probabilities
            </td>
            {sportsBook.odds.map((odd, betTypeIndex) => {
              return (
                <td
                  key={`prob-${odd.name}`}
                  className="text-[0.65rem] p-1 text-center"
                >
                  <div className="flex flex-col text-blue-700 font-semibold">
                    {selectedTeams.map((team, teamIndex) => {
                      const value = odd.values[teamIndex];
                      const decimal = parseFloat(value?.total || "0");
                      let impliedProb = 0;
                      if (!isNaN(decimal) && decimal > 1) {
                        impliedProb = 1 / decimal;
                      }
                      return (
                        <div key={`${team}-prob`}>
                          {team}: {(impliedProb * 100).toFixed(1)}%
                        </div>
                      );
                    })}
                  </div>
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default SportsbookTable;
