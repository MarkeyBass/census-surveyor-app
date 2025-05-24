import { z } from "zod";
import {
  householdSchema,
  familyMemberSchema,
  focalPointSchema,
} from "../validations/householdSchema";

// ============================================================================
// Enums
// ============================================================================

/**
 * Available housing types
 */
export const HousingTypeEnum = {
  APARTMENT: "Apartment",
  HOUSE: "House",
  CONDOMINIUM: "Condominium",
  DUPLEX: "Duplex",
  MOBILE_HOME: "Mobile home",
  OTHER: "Other",
} as const;

export type HousingTypeUnion = (typeof HousingTypeEnum)[keyof typeof HousingTypeEnum];

/**
 * Available environmental practices
 */
export const EnvironmentalPracticeEnum = {
  RECYCLING: "Recycling",
  COMPOSTING: "Composting food scraps",
  WATER_CONSERVATION: "Conserving water",
  PLASTIC_REDUCTION: "Reducing plastic use",
  REUSABLE_BAGS: "Using reusable shopping bags",
  LOCAL_INITIATIVES: "Participating in local environmental initiatives",
} as const;

export type EnvironmentalPracticeUnion =
  (typeof EnvironmentalPracticeEnum)[keyof typeof EnvironmentalPracticeEnum];

/**
 * Available survey statuses
 */
export const SurveyStatusEnum = {
  PENDING: "pending",
  COMPLETED: "completed",
} as const;

export type SurveyStatusUnion = (typeof SurveyStatusEnum)[keyof typeof SurveyStatusEnum];

// ============================================================================
// Types
// ============================================================================

/**
 * Family member in the household
 */
export type FamilyMemberType = z.infer<typeof familyMemberSchema>;

/**
 * Main contact person for the household
 */
export type FocalPointType = z.infer<typeof focalPointSchema>;

/**
 * Housing type with optional custom value
 */
export type HousingTypeInput = {
  value: HousingTypeUnion;
  customValue?: string;
};

/**
 * Household record in the database
 */
export type HouseholdType = z.infer<typeof householdSchema> & {
  _id?: string;
  createdAt: Date;
  updatedAt: Date;
  dateSurveyed?: Date;
};

/**
 * Household data for API requests
 */
export type HouseholdInputType = z.infer<typeof householdSchema>;

export type HouseholdUpdateType = Partial<HouseholdType> & {
  isAdminUpdate?: boolean;
};
