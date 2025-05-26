"use client";

import { Household } from "@/types/household";
import { HouseholdCard } from "@/components/household-card";
import { useRouter } from "next/navigation";

interface HouseholdListProps {
  households: Household[];
}

export function HouseholdList({ households }: HouseholdListProps) {
  const router = useRouter();

  const handleNavigateToHouseholdDetalsPage = (householdId: string) => {
    router.push(`/households/${householdId}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {households.map((household) => (
        <HouseholdCard
          key={household._id}
          household={household}
          onClick={() => handleNavigateToHouseholdDetalsPage(household._id)}
        />
      ))}
    </div>
  );
} 