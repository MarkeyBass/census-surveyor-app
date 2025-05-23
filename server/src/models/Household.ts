import mongoose, { Schema, Document } from "mongoose";
import { HouseholdType } from "../types/HouseholdTypes";
import { HousingTypeEnum } from "../types/HouseholdTypes";
import { EnvironmentalPracticeEnum, SurveyStatusEnum } from "../types/HouseholdTypes";

/**
 * Indexed fields used throughout the Household model.
 */
const indexedFields = {
  SLUG: "slug",
  FOCAL_POINT_EMAIL: "email",
} as const;

const familyMemberSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  birthDate: { type: Date, required: true },
});

const focalPointSchema = new Schema(
  {
    firstName: { type: String, required: true },
    pictureUrl: { type: String },
    [indexedFields.FOCAL_POINT_EMAIL]: { type: String, required: true },
  },
  { _id: false }
);

const householdSchema = new Schema(
  {
    [indexedFields.SLUG]: { type: String, required: true },
    familyName: { type: String, required: true },
    address: { type: String, required: true },
    surveyStatus: {
      type: String,
      enum: Object.values(SurveyStatusEnum),
      default: SurveyStatusEnum.PENDING,
    },
    dateSurveyed: { type: Date },
    focalPoint: { type: focalPointSchema, required: true },
    familyMembers: [familyMemberSchema],
    numberOfCars: { type: Number, required: true, min: 0 },
    hasPets: { type: Boolean, required: true },
    numberOfPets: { type: Number, min: 0 },
    housingType: {
      type: {
        value: {
          type: String,
          required: true,
          enum: Object.values(HousingTypeEnum),
        },
        customValue: {
          type: String,
          validate: {
            validator: function (this: any, value: string) {
              // If value is "Other", customValue is required
              if (this.value === HousingTypeEnum.OTHER) {
                return value != null && value.trim().length > 0;
              }
              // If value is not "Other", customValue should be null/undefined
              return value == null;
            },
            message: "Custom value is required when housing type is 'Other'",
          },
        },
      },
      required: true,
    },
    environmentalPractices: [
      {
        type: String,
        enum: Object.values(EnvironmentalPracticeEnum),
      },
    ],
  },
  {
    timestamps: true,
  }
);

/**
 * Database indexes configuration
 * - SLUG: Unique index for fast lookups by slug
 * - FOCAL_POINT_EMAIL: Index for searching households by focal point's email
 */
householdSchema.index({ [indexedFields.SLUG]: 1 }, { unique: true });
householdSchema.index({ [indexedFields.FOCAL_POINT_EMAIL]: 1 });

/**
 * Pre-validate hook to generate a unique slug and clean up housing type data
 */
householdSchema.pre("validate", function (next) {
  // Generate slug if not exists
  if (!this.slug) {
    const familyNameSlug = this.familyName.toLowerCase().replace(/ /g, "-");
    const emailSlug = this.focalPoint[indexedFields.FOCAL_POINT_EMAIL]
      .toLowerCase()
      .split("@")[0]
      .replace(/[^a-z0-9]/g, "-");
    this.slug = `${familyNameSlug}-${emailSlug}`;
  }

  // Clean up housing type customValue
  if (this.housingType && this.housingType?.value !== HousingTypeEnum.OTHER) {
    // Remove customValue for non-Other types
    this.housingType.customValue = undefined;
  }

  next();
});

export const HouseholdModel = mongoose.model<HouseholdType & Document>(
  "Household",
  householdSchema
);
