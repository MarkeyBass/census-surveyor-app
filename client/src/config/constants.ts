/**
 * API Configuration
 * ----------------
 * NEXT_PUBLIC_API_URL: The base URL for the API
 * - Development: http://localhost:8000/api/v1
 * - Production: Set this in your deployment environment
 */
export const API_CONFIG = {
  ENDPOINTS: {
    HOUSEHOLDS: '/households',
    // Add other endpoints here
  }
} as const;


export const environmentTypes = {
  DEVELOPMENT: "development",
  PRODUCTION: "production",
} as const;