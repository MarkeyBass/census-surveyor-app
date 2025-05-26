import { z } from "zod";
import { HousingTypeEnum, SurveyStatusEnum } from "@/types/household";

export const focalPointSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  email: z.string().email("Invalid email address"),
  pictureUrl: z.string().optional(),
});

export const familyMemberSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  birthDate: z.date().or(z.string().min(1, "Birth date is required")),
});

export const housingTypeSchema = z.object({
  value: z.nativeEnum(HousingTypeEnum),
  customValue: z.string().optional(),
}).refine(
  (data) => {
    if (data.value === HousingTypeEnum.OTHER) {
      return data.customValue !== undefined && data.customValue.trim().length > 0;
    }
    return true;
  },
  {
    message: "Custom value is required when housing type is 'Other'",
    path: ["customValue"],
  }
);

export const householdSchema = z.object({
  familyName: z.string().min(1, "Family name is required"),
  address: z.string().min(1, "Address is required"),
  surveyStatus: z.nativeEnum(SurveyStatusEnum),
  focalPoint: focalPointSchema,
  familyMembers: z.array(familyMemberSchema).min(1, "At least one family member is required"),
  numberOfCars: z.number().min(0, "Number of cars must be 0 or greater"),
  hasPets: z.boolean(),
  numberOfPets: z.number().optional().refine(
    (val) => {
      if (val === undefined) return true;
      return val > 0;
    },
    { message: "Number of pets must be greater than 0 when has pets is true" }
  ),
  housingType: housingTypeSchema,
  environmentalPractices: z.array(z.string()).optional(),
});

// Schema specifically for survey completion
export const surveyCompletionSchema = householdSchema.refine(
  (data) => {
    if (data.hasPets) {
      return data.numberOfPets !== undefined && data.numberOfPets > 0;
    }
    return true;
  },
  {
    message: "Number of pets must be greater than 0 when has pets is true",
    path: ["numberOfPets"],
  }
).refine(
  (data) => {
    if (data.housingType.value === HousingTypeEnum.OTHER) {
      return data.housingType.customValue !== undefined && data.housingType.customValue.trim().length > 0;
    }
    return true;
  },
  {
    message: "Custom housing type value is required when type is 'Other'",
    path: ["housingType", "customValue"],
  }
);

// Schema for saving changes (less strict)
export const householdUpdateSchema = z.object({
  familyName: z.string().min(1, "Family name is required"),
  address: z.string().min(1, "Address is required"),
  surveyStatus: z.nativeEnum(SurveyStatusEnum),
  focalPoint: focalPointSchema,
  numberOfCars: z.number().min(0, "Number of cars must be 0 or greater"),
  hasPets: z.boolean(),
  numberOfPets: z.number().optional(),
  housingType: housingTypeSchema,
  environmentalPractices: z.array(z.string()).optional(),
}).refine(
  (data) => {
    if (data.surveyStatus === SurveyStatusEnum.COMPLETED) {
      return false; // Prevent saving with completed status
    }
    return true;
  },
  {
    message: "Cannot save with completed status",
    path: ["surveyStatus"],
  }
); 