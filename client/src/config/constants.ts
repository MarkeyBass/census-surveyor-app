/**
 * API Configuration
 * ----------------
 * NEXT_PUBLIC_API_URL: The base URL for the API
 * - Development: http://localhost:8000/api/v1
 * - Production: Set this in your deployment environment
 */
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
  SERVER_COMPONENTS_BASE_URL: 'http://server:8000/api/v1',
  ENDPOINTS: {
    HOUSEHOLDS: '/households',
    // Add other endpoints here
  }
} as const;
