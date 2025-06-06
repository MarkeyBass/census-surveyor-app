import { Suspense } from "react";
import { Household } from "@/types/household";
import { HouseholdList } from "@/components/household-list";
import Loading from "./loading";
import { API_CONFIG } from "@/config/constants";
import HouseholdsHeader from "@/components/households-header";
import { getBaseUrl } from "@/lib/get-base-url";

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

  try {
    const url = getBaseUrl() + API_CONFIG.ENDPOINTS.HOUSEHOLDS;
    const response = await fetch(url, {
      cache: 'no-store',  // This ensures fresh data on every request
      // // The Authorization header will be automatically added by the middleware
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Handle unauthorized access
        throw new Error('Unauthorized access. Please log in.');
      }
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.error || `Failed to fetch households: ${response.status}`);
    }

    const { data } = await response.json();
    if (!Array.isArray(data)) {
      throw new Error("Invalid response format: expected an array of households");
    }

    return data;
  } catch (error) {
    console.error("Error fetching households:", error);
    throw error;
  }
}

async function Households() {
  const households = await getHouseholds();
  return <HouseholdList households={households} />;
}

export default function Home() {
  return (
    <main className="container mx-auto">
      <HouseholdsHeader />
      <div className="px-4 my-8">
        <Suspense fallback={<Loading />}>
          <Households />
        </Suspense>
      </div>
    </main>
  );
}
