"use client";
import React, { useRef } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import HockeyTeams from "@/data/teams/hockey.json"; // Restore hockey teams import
import SelectionBar from "./SelectionsBar";
import SportsbookTable from "./SportsBookTable";
import ArbitrageResults from "./ArbitrageResults";

function Calculator() {
  type SportsBook = {
    name: string;
    odds: { name: string; values: string[] }[];
  };

  // Sports array with all sports & their teams & bet types restored
  const sports = [
    {
      name: "Hockey",
      teams: HockeyTeams,
      betTypes: ["Puck Line", "Total", "Moneyline"].map((bt) => ({ name: bt })),
    },
    {
      name: "Football",
      teams: [{ name: "Team A" }, { name: "Team B" }],
      betTypes: ["Spread", "Total", "Moneyline"].map((bt) => ({ name: bt })),
    },
    {
      name: "Basketball",
      teams: [{ name: "Team A" }, { name: "Team B" }],
      betTypes: ["Spread", "Total", "Moneyline"].map((bt) => ({ name: bt })),
    },
    {
      name: "Baseball",
      teams: [{ name: "Team A" }, { name: "Team B" }],
      betTypes: ["Spread", "Total", "Moneyline"].map((bt) => ({ name: bt })),
    },
  ];

  // defaultTeams for the SelectionBar (use first 2 hockey teams or fallback)
  const defaultTeams = sports
    .find((s) => s.name === "Hockey")
    ?.teams.slice(0, 2)
    .map((t) => t.name) || ["Team A", "Team B"];

  // State for selected sport, teams, bet amount
  const [sport, setSport] = React.useState<(typeof sports)[0] | undefined>(
    sports[0]
  );
  const [selectedTeams, setSelectedTeams] =
    React.useState<string[]>(defaultTeams);
  const [defaultBetAmount, setDefaultBetAmount] = React.useState(100);

  // Updated sportsBooks with odds for each bet type
  const [sportsBooks, setSportsBooks] = React.useState<SportsBook[]>([
    {
      name: "DraftKings",
      odds: [
        { name: "Puck Line", values: ["210", "-258"] },
        { name: "Total", values: ["110", "-130"] },
        { name: "Moneyline", values: ["-118", "-102"] },
      ],
    },
    {
      name: "FanDuel",
      odds: [
        { name: "Puck Line", values: ["220", "-280"] },
        { name: "Total", values: ["110", "-134"] },
        { name: "Moneyline", values: ["-113", "-106"] },
      ],
    },
  ]);

  // Handle sport change — reset selected teams to first 2 teams of new sport
  function handleSportChange(value: string) {
    const selectedSport = sports.find((s) => s.name === value);
    setSport(selectedSport);
    if (selectedSport?.teams) {
      setSelectedTeams(selectedSport.teams.slice(0, 2).map((t) => t.name));
    } else {
      setSelectedTeams(["Team A", "Team B"]);
    }
  }

  function handleTeamChange(index: number, value: string) {
    setSelectedTeams((prev) => {
      const newTeams = [...prev];
      newTeams[index] = value;
      return newTeams;
    });
  }
  const newSportsbookRef = useRef<HTMLInputElement>(null);

  const addSportsBook = () => {
    const name = newSportsbookRef.current?.value || "New Sportsbook";
    setSportsBooks((prevSportsBooks) => [
      ...prevSportsBooks,
      {
        name,
        odds: [
          { name: "Puck Line", values: ["0", "0"] },
          { name: "Total", values: ["0", "0"] },
          { name: "Moneyline", values: ["0", "0"] },
        ],
      },
    ]);
  };

  function handleBetAmountChange(value: number) {
    setDefaultBetAmount(value);
  }

  // Handle sportsbook odds change
  function handleSportsBookChange(
    sportsBookIndex: number,
    betTypeIndex: number,
    teamIndex: number,
    newValue: string
  ) {
    setSportsBooks((prevSportsBooks) => {
      const newSportsBooks = [...prevSportsBooks];
      newSportsBooks[sportsBookIndex] = {
        ...newSportsBooks[sportsBookIndex],
        odds: newSportsBooks[sportsBookIndex].odds.map((betType, idx) => {
          if (idx !== betTypeIndex) return betType;
          const newValues = [...betType.values];
          newValues[teamIndex] = newValue;
          return {
            ...betType,
            values: newValues,
          };
        }),
      };
      return newSportsBooks;
    });
  }

  return (
    <>
      <h1 className="text-3xl font-bold m-5">
        {sport?.name} Arbitrage Calculator
      </h1>
      <SelectionBar
        sports={sports}
        sport={sport}
        defaultTeams={selectedTeams.map((team) => ({ name: team }))} // <-- FIXED here
        defaultBetAmount={defaultBetAmount}
        selectedTeams={selectedTeams}
        handleBetAmountChange={handleBetAmountChange}
        handleSportChange={handleSportChange}
        handleTeamChange={handleTeamChange}
      />
      Total Spent per Betting Type: {defaultBetAmount}
      <ArbitrageResults
        sportsBooks={sportsBooks}
        selectedTeams={selectedTeams}
        betTypes={sport?.betTypes || []}
        defaultBetAmount={defaultBetAmount}
      />
      {sportsBooks.map((sportsBook, sIndex) => (
        <SportsbookTable
          key={sportsBook.name}
          sportsBook={sportsBook}
          selectedTeams={selectedTeams}
          onOddsChange={(betTypeIndex, teamIndex, value) =>
            handleSportsBookChange(sIndex, betTypeIndex, teamIndex, value)
          }
          betTypes={sport?.betTypes || []}
        />
      ))}
      <div className="flex flex-row items-center justify-center">
        <Input
          type="text"
          placeholder="New Sportsbook"
          ref={newSportsbookRef}
        />
        <Button className="m-5" onClick={addSportsBook}>
          Add Sports Book
        </Button>
      </div>
    </>
  );
}

export default Calculator;
