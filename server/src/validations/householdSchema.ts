import { z } from "zod";

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
export const focalPointSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name must be less than 50 characters"),
  pictureUrl: z.string().url("Invalid URL format").max(500, "URL is too long").optional(),
  email: z.string().email("Invalid email address").max(100, "Email is too long"),
});

/**
 * Validation schema for household data
 */
export const householdSchema = z.object({
  familyName: z
    .string()
    .min(1, "Family name is required")
    .max(100, "Family name must be less than 100 characters"),
  address: z
    .string()
    .min(1, "Address is required")
    .max(200, "Address must be less than 200 characters"),
  surveyStatus: z.enum(["pending", "completed"]).default("pending"),
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
  housingType: z.enum(["Apartment", "House", "Condominium", "Duplex", "Mobile home", "Other"], {
    errorMap: () => ({ message: "Invalid housing type - select from the list" }),
  }),
  environmentalPractices: z
    .array(
      z.enum([
        "Recycling",
        "Composting food scraps",
        "Conserving water",
        "Reducing plastic use",
        "Using reusable shopping bags",
        "Participating in local environmental initiatives",
      ])
    )
    .optional(),
});

// Validation middleware
export const validateHousehold = (data: unknown) => {
  return householdSchema.safeParse(data);
};
