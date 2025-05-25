// TODO: check!!!
import { ApiResponse, Household } from "@/types/household";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export const householdService = {
  async getAllHouseholds(): Promise<Household[]> {
    const response = await fetch(`${API_URL}/households`);
    if (!response.ok) {
      throw new Error('Failed to fetch households');
    }
    const data: ApiResponse<Household[]> = await response.json();
    return data.data;
  }
}; 