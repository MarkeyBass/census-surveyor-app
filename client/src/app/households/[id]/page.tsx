import { Household } from "@/types/household";
import { API_CONFIG } from "@/config/constants";
import { HouseholdDetails } from "@/components/household-details";

async function getHousehold(id: string): Promise<Household> {
  const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.HOUSEHOLDS}/${id}`, {
    cache: 'no-store',
    next: { revalidate: 0 }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch household');
  }

  const data = await response.json();
  return data.data;
}

export default async function HouseholdPage({ params }: { params: { id: string } }) {
  const household = await getHousehold(params.id);

  return (
    <main className="container mx-auto px-4 py-8 my-10">
      <HouseholdDetails household={household} />
    </main>
  );
} 