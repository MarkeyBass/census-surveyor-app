import { z } from "zod";
import { HousingTypeEnum, EnvironmentalPracticeEnum, SurveyStatusEnum } from "../types/HouseholdTypes";

/**
 * Validation schema for family member data
 */
export const familyMemberSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name must be less than 50 characters"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name must be less than 50 characters"),
  birthDate: z
    .string()
    .transform((str) => new Date(str))
    .refine((date) => !isNaN(date.getTime()), {
      message: "Invalid date format",
    }),
});

/**
 * Validation schema for focal point data
 */
// TODO: do not allow to change email - make it immutable here 
// TODO: Create seperate endpoint for email change (admon only)
export const focalPointSchema = z.object({
  firstName: z
    .string()
    .max(50, "First name must be less than 50 characters")
    .optional(),
  pictureUrl: z.string().url("Invalid URL format").max(500, "URL is too long").optional(),
  email: z.string().email("Invalid email address").max(100, "Email is too long"),
});

/**
 * Validation schema for household data
 */

// TODO: make email immutable
export const householdSchema = z.object({
  familyName: z
    .string()
    .min(1, "Family name is required")
    .max(100, "Family name must be less than 100 characters"),
  address: z
    .string()
    .min(1, "Address is required")
    .max(200, "Address must be less than 200 characters"),
  surveyStatus: z.enum(Object.values(SurveyStatusEnum) as [string, ...string[]]).default(SurveyStatusEnum.PENDING),
  dateSurveyed: z
    .string()
    .transform((str) => new Date(str))
    .refine((date) => !isNaN(date.getTime()), {
      message: "Invalid date format",
    })
    .optional(),
  focalPoint: focalPointSchema,
  familyMembers: z.array(familyMemberSchema),
  numberOfCars: z.number().int().min(0, "Number of cars must be a non-negative integer"),
  hasPets: z.boolean(),
  numberOfPets: z
    .number()
    .int()
    .min(0, "Number of pets must be a non-negative integer")
    .optional()
    .refine(
      (val) => {
        // If hasPets is true, numberOfPets must be provided and greater than 0
        if (val === undefined) return true;
        return val > 0;
      },
      {
        message: "Number of pets must be greater than 0 if hasPets is true",
      }
    ),
  housingType: z.object({
    value: z.enum(Object.values(HousingTypeEnum) as [string, ...string[]], {
      errorMap: () => ({ message: "Invalid housing type - select from the list" }),
    }),
    customValue: z.string().optional(),
  }).superRefine((data, ctx) => {
    // If value is "Other", customValue is required
    if (data.value === HousingTypeEnum.OTHER) {
      if (!data.customValue || data.customValue.trim().length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Custom value is required when housing type is 'Other'",
          path: ["customValue"]
        });
      }
    }
  }),
  environmentalPractices: z
    .array(z.enum(Object.values(EnvironmentalPracticeEnum) as [string, ...string[]]))
    .optional(),
});

/**
 * Validation schema for household updates
 * Makes all fields optional while maintaining the same validation rules
 */
export const householdUpdateSchema = householdSchema.partial();

// TODO: move the date creation to mongoose custom hook
/**
 * Validation schema for completing a survey
 * Extends the base schema but enforces completed status and required date
 */
export const completeSurveySchema = householdSchema.extend({
  surveyStatus: z.literal(SurveyStatusEnum.COMPLETED),
  dateSurveyed: z
    .string()
    .transform((str) => new Date(str))
    .refine((date) => !isNaN(date.getTime()), {
      message: "Invalid date format",
    }),
});

/**
 * Validation schema for initial household creation (Admin only)
 * Only requires essential fields for initial setup
 */
export const householdCreateSchema = z.object({
  familyName: z
    .string()
    .min(1, "Family name is required")
    .max(100, "Family name must be less than 100 characters"),
  address: z
    .string()
    .min(1, "Address is required")
    .max(200, "Address must be less than 200 characters"),
  focalPoint: z.object({
    email: z.string().email("Invalid email address").max(100, "Email is too long"),
  }),
  surveyStatus: z.literal(SurveyStatusEnum.PENDING).default(SurveyStatusEnum.PENDING),
});

// Validation middleware
export const validateHousehold = (data: unknown) => {
  return householdSchema.safeParse(data);
};
