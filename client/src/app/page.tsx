// TODO: check!!!
import { Suspense } from "react";
import { Household } from "@/types/household";
import { HouseholdList } from "@/components/household-list";
import Loading from "./loading";
import { API_CONFIG } from "@/config/constants";

async function getHouseholds(): Promise<Household[]> {
  /**
   * Test Utilities
   * --------------
   * Uncomment these lines to test different states:
   * 
   * 1. Loading State Test:
   *    - Adds a 2-second delay to simulate slow network
   *    - Useful for testing loading UI and transitions
   */
  // await new Promise(resolve => setTimeout(resolve, 2000));

  /**
   * 2. Error State Test:
   *    - Simulates a failed request
   *    - Useful for testing error boundaries and error UI
   */
  // throw new Error('test error');

  const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.HOUSEHOLDS}`, {
    // This ensures the request is not cached
    cache: 'no-store',
    // This ensures we get fresh data on each request
    next: { revalidate: 0 }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch households');
  }

  const data = await response.json();
  return data.data;
}

async function Households() {
  const households = await getHouseholds();
  return <HouseholdList households={households} />;
}

export default function Home() {
  return (
    <main className="container mx-auto">
      <div className="sticky top-5 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold py-8 pb-4 px-4">Household Surveys - Admin Panel</h1>
      </div>
      <div className="px-4 my-8">
        <Suspense fallback={<Loading />}>
          <Households />
        </Suspense>
      </div>
    </main>
  );
}
