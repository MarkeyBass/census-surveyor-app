import { Household, SurveyStatusEnum } from "@/types/household";
import { API_CONFIG } from "@/config/constants";
import { HouseholdDetails } from "@/components/household-details";
import { getBaseUrl } from "@/lib/get-base-url";

async function getHousehold(id: string): Promise<Household> {
  try {
    let url = getBaseUrl() + API_CONFIG.ENDPOINTS.HOUSEHOLDS + "/" + id;
    const response = await fetch(url, {
      next: { revalidate: 0 },
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

  return (
    <main className="container mx-auto px-4 py-8">
      <HouseholdDetails household={household} />
    </main>
  );
}
