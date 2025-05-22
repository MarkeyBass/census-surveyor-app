import mongoose, { Schema, Document } from "mongoose";
import { HouseholdType } from "../types";

/**
 * Indexed fields used throughout the Household model.
 */
const indexes = {
  SLUG: "slug",
  FOCAL_POINT_EMAIL: "focalPoint.email",
} as const;

const familyMemberSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  birthDate: { type: Date, required: true },
});

const focalPointSchema = new Schema({
  firstName: { type: String, required: true },
  pictureUrl: { type: String },
  [indexes.FOCAL_POINT_EMAIL]: { type: String, required: true },
}, { _id: false });

const householdSchema = new Schema(
  {
    [indexes.SLUG]: { type: String, required: true },
    familyName: { type: String, required: true },
    address: { type: String, required: true },
    surveyStatus: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
    dateSurveyed: { type: Date },
    focalPoint: { type: focalPointSchema, required: true },
    familyMembers: [familyMemberSchema],
    numberOfCars: { type: Number, required: true, min: 0 },
    hasPets: { type: Boolean, required: true },
    numberOfPets: { type: Number, min: 0 },
    housingType: {
      type: String,
      enum: ["Apartment", "House", "Condominium", "Duplex", "Mobile home", "Other"],
      required: true,
    },
    environmentalPractices: [
      {
        type: String,
        enum: [
          "Recycling",
          "Composting food scraps",
          "Conserving water",
          "Reducing plastic use",
          "Using reusable shopping bags",
          "Participating in local environmental initiatives",
        ],
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
householdSchema.index({ [indexes.SLUG]: 1 }, { unique: true });
householdSchema.index({ [indexes.FOCAL_POINT_EMAIL]: 1 });

/**
 * Pre-save hook to generate a unique slug if not exists
 * Combines family name and email to create a URL-friendly identifier
 */
householdSchema.pre("save", async function (next) {
  if (!this.slug) {
    const familyNameSlug = this.familyName.toLowerCase().replace(/ /g, "-");
    const emailSlug = this.focalPoint[indexes.FOCAL_POINT_EMAIL].toLowerCase().split("@")[0].replace(/[^a-z0-9]/g, "-");
    this.slug = `${familyNameSlug}-${emailSlug}`;
  }
  next();
});

export const HouseholdModel = mongoose.model<HouseholdType & Document>("Household", householdSchema);
