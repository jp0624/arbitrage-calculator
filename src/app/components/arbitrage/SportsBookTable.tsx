import React from "react";

const SportsbookTable = () => {
  const betTypes = [
    { name: "Moneyline" },
    { name: "Spread" },
    { name: "Over/Under" },
    { name: "Parlay" },
    { name: "Teaser" },
    { name: "Prop Bet" },
    { name: "Futures" },
    { name: "Live Betting" },
    { name: "Round Robin" },
    { name: "Puck Line" },
    { name: "Point Spread" },
    { name: "Total" },
  ];
  const sports = [
    {
      name: "Hockey",
      teams: [{ name: "Toronto Maple Leafs" }, { name: "Montreal Canadiens" }],
      betTypes: [
        betTypes.find((bt) => bt.name === "Puck Line"),
        betTypes.find((bt) => bt.name === "Total"),
        betTypes.find((bt) => bt.name === "Moneyline"),
      ].filter((bt): bt is { name: string } => Boolean(bt)),
    },
  ];
  const teams = ["Toronto Maple Leafs", "Montreal Canadiens"];
  const defaultBetAmount = 100;
  return (
    <div className="flex flex-col items-center justify-center w-[75%] mx-auto">
      <header className="h-25 bg-slate-600 w-full mx-auto my-5 rounded-lg" />

      <table className="sportsbook-table" data-testid="sportsbook-table">
        <thead className="sportsbook-table__head">
          <tr>
            <th className="always-left column-header w-[40%]">
              <div className="sportsbook-table-header__title"></div>
            </th>
            <th className="responsive-left column-header w-[20%]">
              <div className="sportsbook-table-header__title">Spread</div>
            </th>
            <th className="responsive-left column-header w-[20%]">
              <div className="sportsbook-table-header__title">Total</div>
            </th>
            <th className="responsive-left column-header w-[20%]">
              <div className="sportsbook-table-header__title">Moneyline</div>
            </th>
          </tr>
        </thead>
        <tbody className="sportsbook-table__body">
          {/* Map your dynamic rows here if needed */}
        </tbody>
      </table>
    </div>
  );
};

export default SportsbookTable;
