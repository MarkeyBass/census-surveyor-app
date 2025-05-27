/**
 * API Configuration
 * ----------------
 * NEXT_PUBLIC_API_URL: The base URL for the API
 * - Development: http://localhost:8000/api/v1
 * - Production: Set this in your deployment environment
 */
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
  ENDPOINTS: {
    HOUSEHOLDS: '/households',
    // Add other endpoints here
  }
} as const;

// TODO: remove this
  console.log('===== API_CONFIG.BASE_URL ===== ', API_CONFIG.BASE_URL);
  console.log('===== process.env.NEXT_PUBLIC_API_URL ===== ', process.env.NEXT_PUBLIC_API_URL);
  console.log('===== NODE_ENV ===== ', process.env.NODE_ENV);
