"use client";
import React, { useEffect } from "react";
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
import SportsbookTable from "./SportsBookTable";

function Calculator() {
  const defaultTeams = [{ name: "Team A" }, { name: "Team B" }];
  const sportsBooks = [{ name: "DraftKings" }, { name: "FanDuel" }];
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
      teams: HockeyTeams,
      betTypes: [
        betTypes.find((bt) => bt.name === "Puck Line"),
        betTypes.find((bt) => bt.name === "Total"),
        betTypes.find((bt) => bt.name === "Moneyline"),
      ].filter((bt): bt is { name: string } => Boolean(bt)),
    },
    {
      name: "Football",
      teams: [
        { name: "Team A", city: "City A" },
        { name: "Team B", city: "City B" },
      ],
    },
    {
      name: "Basketball",
      teams: [
        { name: "Team A", city: "City A" },
        { name: "Team B", city: "City B" },
      ],
      betTypes: [
        betTypes.find((bt) => bt.name === "Spread"),
        betTypes.find((bt) => bt.name === "Total"),
        betTypes.find((bt) => bt.name === "Moneyline"),
      ].filter((bt): bt is { name: string } => Boolean(bt)),
    },
    {
      name: "Baseball",
      teams: [
        { name: "Team A", city: "City A" },
        { name: "Team B", city: "City B" },
      ],
    },
  ];
  type SportType = {
    name: string;
    teams?: { name: string; city: string }[];
    betTypes?: { name: string }[];
  };

  const [sport, setSport] = React.useState<SportType | undefined>();
  const [selectedTeams, setSelectedTeams] = React.useState<string[]>(["", ""]);
  const [defaultBetAmount, setdefaultBetAmount] = React.useState(100);
  function handleSportChange(value: string) {
    const selectedSport = sports.find((s) => s.name === value);
    setSport(selectedSport);

    // Reset selected teams based on new sport's teams length or default 2
    if (selectedSport?.teams) {
      setSelectedTeams(Array(selectedSport.teams.length).fill(""));
    } else {
      setSelectedTeams(["", ""]); // fallback default
    }
  }

  function handleBetAmountChange(value: number) {
    setdefaultBetAmount(value);
  }
  function handleTeamChange(index: number, value: string) {
    setSelectedTeams((prev) => {
      const newTeams = [...prev];
      newTeams[index] = value;
      return newTeams;
    });
  }
  return (
    <>
      <pre>{JSON.stringify(sport?.teams)}</pre>
      <h1 className="text-3xl font-bold m-5">
        Arbitrage Calculator {sport?.name}
      </h1>
      import SelectionBar from "@/components/SelectionBar"; // Inside your
      Calculator component's return:
      <SelectionBar
        sports={sports}
        sport={sport}
        defaultTeams={defaultTeams}
        defaultBetAmount={defaultBetAmount}
        selectedTeams={selectedTeams}
        handleBetAmountChange={handleBetAmountChange}
        handleSportChange={handleSportChange}
        handleTeamChange={handleTeamChange}
      />
      {defaultBetAmount}
      <SportsbookTable />
    </>
  );
}

export default Calculator;
