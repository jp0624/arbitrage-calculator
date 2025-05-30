// components/SelectionBar.tsx
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
import { Button } from "@/components/ui/button";

type Team = { name: string; city?: string };
type Sport = {
  name: string;
  teams?: Team[];
  betTypes?: { name: string }[];
};

interface SelectionBarProps {
  sports: Sport[];
  sport?: Sport;
  defaultTeams: { name: string }[];
  defaultBetAmount: number;
  selectedTeams: string[];
  handleSportChange: (value: string) => void;
  handleTeamChange: (index: number, value: string) => void;
  handleBetAmountChange: (value: number) => void;
}

const SelectionBar: React.FC<SelectionBarProps> = ({
  sports,
  sport,
  defaultTeams,
  defaultBetAmount,
  selectedTeams,
  handleSportChange,
  handleTeamChange,
  handleBetAmountChange,
}) => {
  const betAmmountRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    if (betAmmountRef.current) {
      const value = parseFloat(betAmmountRef.current.value);
      if (!isNaN(value)) {
        handleBetAmountChange(value);
      }
    }
  };
  return (
    <ul className="items-center justify-center flex flex-row w-full gap-5 p-5">
      <li className="flex flex-row items-center grow justify-center">
        <Select
          onValueChange={handleSportChange}
          value={sport?.name || "Hockey"} // Set default value to Hockey if sport is undefined
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Sport" />
          </SelectTrigger>
          <SelectContent>
            {sports.map((sport) => (
              <SelectItem key={sport.name} value={sport.name}>
                {sport.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </li>

      {defaultTeams.map((_, i) => (
        <li key={i} className="flex flex-row items-center justify-center">
          <label className="grow whitespace-nowrap pr-2.5">Team {i + 1}:</label>
          <Select
            value={selectedTeams[i] || ""}
            onValueChange={(value) => handleTeamChange(i, value)}
            disabled={!Array.isArray(sport?.teams)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={`Select Team ${i + 1}`} />
            </SelectTrigger>
            <SelectContent>
              {Array.isArray(sport?.teams) &&
                sport.teams.map((team, index) => (
                  <SelectItem
                    key={`${i}-${index}-${team.city ?? ""}-${team.name}`}
                    value={team.name}
                  >
                    {team.name || "Team"}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </li>
      ))}

      <li className="grow items-center justify-center">
        <div className="flex flex-row items-center justify-center">
          <label className="grow whitespace-nowrap mr-2.5">Bet:</label>
          <Input
            className="grow mr-2.5"
            type="number"
            placeholder={defaultBetAmount.toString()}
            ref={betAmmountRef}
          />
          <Button onClick={handleSubmit}>Apply Bet To All</Button>
        </div>
      </li>
    </ul>
  );
};

export default SelectionBar;
