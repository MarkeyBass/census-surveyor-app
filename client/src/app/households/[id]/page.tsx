import { Household, SurveyStatusEnum } from "@/types/household";
import { API_CONFIG } from "@/config/constants";
import { HouseholdDetails } from "@/components/household-details";

async function getHousehold(id: string): Promise<Household | null> {
  // Only return mock data during build time, not during runtime
  if (process.env.NEXT_PHASE === "phase-production-build") {
    return null;
  }

  try {
    const url =
      process.env.NODE_ENV === "development"
        ? `${API_CONFIG.SERVER_COMPONENTS_BASE_URL}${API_CONFIG.ENDPOINTS.HOUSEHOLDS}/${id}`
        : `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.HOUSEHOLDS}/${id}`;

    const response = await fetch(url, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.error || `Failed to fetch household: ${response.status}`);
    }

    const { data } = await response.json();
    if (!data || typeof data !== "object") {
      throw new Error("Invalid response format: expected a household object");
    }

    return data;
  } catch (error) {
    console.error("Error fetching household:", error);
    throw error;
  }
}

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function HouseholdPage({ params }: PageProps) {
  const resolvedParams = await params;
  const household = await getHousehold(resolvedParams.id);

  return household ? (
    <main className="container mx-auto px-4 py-8">
      <HouseholdDetails household={household} />
    </main>
  ) : null;
}
