"use client";

// TODO: check!!!
import { useEffect, useState } from "react";
import { Household } from "@/types/household";
import { householdService } from "@/services/householdService";
import { HouseholdCard } from "@/components/household-card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const [households, setHouseholds] = useState<Household[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHouseholds = async () => {
      try {
        const data = await householdService.getAllHouseholds();
        setHouseholds(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch households');
      } finally {
        setLoading(false);
      }
    };

    fetchHouseholds();
  }, []);

  const handleHouseholdClick = (householdId: string) => {
    // TODO: Implement navigation to household details
    console.log('Clicked household:', householdId);
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-destructive">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-15 px-4">
      <h1 className="text-3xl font-bold mb-8">Household Surveys</h1>
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-[200px] w-full" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {households.map((household) => (
            <HouseholdCard
              key={household._id}
              household={household}
              onClick={() => handleHouseholdClick(household._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
