import { z } from 'zod';
import { householdSchema, familyMemberSchema, focalPointSchema } from '../validations/householdSchema';

/**
 * Represents a family member in the household
 * @typedef {Object} FamilyMemberType
 * @property {string} firstName - First name of the family member (1-50 characters)
 * @property {string} lastName - Last name of the family member (1-50 characters)
 * @property {Date} birthDate - Date of birth of the family member
 * @example
 * {
 *   firstName: "John",
 *   lastName: "Doe",
 *   birthDate: new Date("1990-01-01")
 * }
 */
export type FamilyMemberType = z.infer<typeof familyMemberSchema>;

/**
 * Represents the focal point (main contact) of the household
 * @typedef {Object} FocalPointType
 * @property {string} firstName - First name of the focal point (1-50 characters)
 * @property {string} [pictureUrl] - Optional URL to the focal point's picture (max 500 characters)
 * @property {string} email - Email address of the focal point (max 100 characters)
 * @example
 * {
 *   firstName: "Jane",
 *   pictureUrl: "https://example.com/photo.jpg",
 *   email: "jane@example.com"
 * }
 */
export type FocalPointType = z.infer<typeof focalPointSchema>;

/**
 * Represents a household in the census survey
 * @typedef {Object} HouseholdType
 * @property {string} [_id] - Optional MongoDB document ID
 * @property {string} familyName - Family name (1-100 characters)
 * @property {string} address - Physical address (1-200 characters)
 * @property {'pending'|'completed'} surveyStatus - Current status of the survey
 * @property {Date} [dateSurveyed] - Optional date when the survey was completed
 * @property {FocalPointType} focalPoint - Main contact person for the household
 * @property {FamilyMemberType[]} familyMembers - Array of family members living in the household
 * @property {number} numberOfCars - Number of cars owned (0-10)
 * @property {boolean} hasPets - Whether the household has pets
 * @property {number} [numberOfPets] - Optional number of pets (required if hasPets is true)
 * @property {'Apartment'|'House'|'Condominium'|'Duplex'|'Mobile home'|'Other'} housingType - Type of housing
 * @property {Array<'Recycling'|'Composting food scraps'|'Conserving water'|'Reducing plastic use'|'Using reusable shopping bags'|'Participating in local environmental initiatives'>} [environmentalPractices] - Optional array of environmental practices
 * @property {Date} createdAt - Timestamp when the record was created
 * @property {Date} updatedAt - Timestamp when the record was last updated
 * @example
 * {
 *   familyName: "Smith Family",
 *   address: "123 Main St",
 *   surveyStatus: "pending",
 *   focalPoint: {
 *     firstName: "John",
 *     email: "john@example.com"
 *   },
 *   familyMembers: [
 *     {
 *       firstName: "John",
 *       lastName: "Smith",
 *       birthDate: new Date("1980-01-01")
 *     }
 *   ],
 *   numberOfCars: 2,
 *   hasPets: true,
 *   numberOfPets: 1,
 *   housingType: "House",
 *   environmentalPractices: ["Recycling", "Composting food scraps"]
 * }
 */
export type HouseholdType = z.infer<typeof householdSchema> & {
  _id?: string;
  createdAt: Date;
  updatedAt: Date;
};

/** Type for household data coming from API requests */
export type HouseholdInputType = z.infer<typeof householdSchema>; 