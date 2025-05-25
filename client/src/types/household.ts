// TODO: check!!!
export interface Household {
  _id: string;
  createdAt: string;
  updatedAt: string;
  // Add other fields based on your HouseholdType from the server
  // For now, I'll add some common fields
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  residents?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
} 