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
import HockeyTeams from "@/data/teams/hockey.json";
import SelectionBar from "./SelectionsBar";
import SportsBookTable from "./SportsBookTable";
import ArbitrageResults from "./ArbitrageResults";

// Define odds types with discriminated union
type MoneylineOrSpreadOdds = {
  name: string;
  type: "moneyline" | "spread";
  values: string[];
};

type OverUnderOdds = {
  name: string;
  type: "overunder";
  values: { label: "O" | "U"; total: string; odds: string }[];
};

type Odds = MoneylineOrSpreadOdds | OverUnderOdds;

type SportsBook = {
  name: string;
  odds: Odds[];
};

function Calculator() {
  const sports = [
    {
      name: "Hockey",
      teams: HockeyTeams,
    },
    {
      name: "Football",
      teams: [{ name: "Team A" }, { name: "Team B" }],
    },
    {
      name: "Basketball",
      teams: [{ name: "Team A" }, { name: "Team B" }],
    },
    {
      name: "Baseball",
      teams: [{ name: "Team A" }, { name: "Team B" }],
    },
  ];

  const defaultTeams = sports
    .find((s) => s.name === "Hockey")
    ?.teams.slice(0, 2)
    .map((t) => t.name) || ["Team A", "Team B"];

  const [sport, setSport] = React.useState<(typeof sports)[0] | undefined>(
    sports[0]
  );
  const [selectedTeams, setSelectedTeams] =
    React.useState<string[]>(defaultTeams);
  const [defaultBetAmount, setDefaultBetAmount] = React.useState(100);

  const [sportsBooks, setSportsBooks] = React.useState<SportsBook[]>([
    {
      name: "DraftKings",
      odds: [
        { name: "Puck Line", values: ["-1.5", "1.5"], type: "spread" },
        {
          name: "Total",
          values: [
            { label: "O", total: "5.5", odds: "-110" },
            { label: "U", total: "5.5", odds: "-110" },
          ],
          type: "overunder",
        },
        { name: "Moneyline", values: ["-118", "-102"], type: "moneyline" },
      ],
    },
    {
      name: "FanDuel",
      odds: [
        { name: "Puck Line", values: ["-1.5", "1.5"], type: "spread" },
        {
          name: "Total",
          values: [
            { label: "O", total: "5.5", odds: "-110" },
            { label: "U", total: "5.5", odds: "-110" },
          ],
          type: "overunder",
        },
        { name: "Moneyline", values: ["-113", "-106"], type: "moneyline" },
      ],
    },
  ]);

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
          { name: "Puck Line", values: ["0", "0"], type: "spread" },
          {
            name: "Total",
            values: [
              { label: "O", total: "0", odds: "0" },
              { label: "U", total: "0", odds: "0" },
            ],
            type: "overunder",
          },
          { name: "Moneyline", values: ["0", "0"], type: "moneyline" },
        ],
      },
    ]);
  };

  function handleBetAmountChange(value: number) {
    setDefaultBetAmount(value);
  }

  // Updated to handle the discriminated union
  const handleSportsBookChange = (
    sportsBookIndex: number,
    betTypeIndex: number,
    teamIndex: number,
    newValue: string
  ) => {
    setSportsBooks((prev) => {
      const newBooks = [...prev];
      const betType = newBooks[sportsBookIndex].odds[betTypeIndex];

      if (betType.type === "overunder") {
        const value = betType.values[teamIndex] as {
          label: "O" | "U";
          total: string;
          odds: string;
        };
        value.total = newValue; // only update total
      } else {
        betType.values[teamIndex] = newValue; // string value
      }

      return newBooks;
    });
  };

  return (
    <>
      <SelectionBar
        sports={sports}
        sport={sport}
        defaultTeams={selectedTeams.map((team) => ({ name: team }))}
        defaultBetAmount={defaultBetAmount}
        selectedTeams={selectedTeams}
        handleBetAmountChange={handleBetAmountChange}
        handleSportChange={handleSportChange}
        handleTeamChange={handleTeamChange}
      />
      Total Spent per Betting Type: {defaultBetAmount}
      <ArbitrageResults sportsBooks={sportsBooks} />
      {sportsBooks.map((sportsBook, sIndex) => (
        <SportsBookTable
          key={sportsBook.name}
          sportsBook={sportsBook}
          selectedTeams={selectedTeams}
          onOddsChange={(betTypeIndex, teamIndex, value) =>
            handleSportsBookChange(sIndex, betTypeIndex, teamIndex, value)
          }
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
