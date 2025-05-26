"use client";

import { Household } from "@/types/household";
import { HouseholdCard } from "@/components/household-card";

interface HouseholdListProps {
  households: Household[];
}

export function HouseholdList({ households }: HouseholdListProps) {
  const handleHouseholdClick = (householdId: string) => {
    // TODO: Implement navigation to household details
    console.log('Clicked household:', householdId);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {households.map((household) => (
        <HouseholdCard
          key={household._id}
          household={household}
          onClick={() => handleHouseholdClick(household._id)}
        />
      ))}
    </div>
  );
} 