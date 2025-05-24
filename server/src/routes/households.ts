import express from "express";
import householdController from "../controllers/households";
import { validateRequest } from "../middleware/validateRequest";
import {
  householdUpdateSchema,
  completeSurveySchema,
  householdCreateSchema,
} from "../validations/householdSchema";

const router = express.Router();

/**
 * @route   GET /api/households
 * @desc    Get all households
 * @access  Public
 */
router.get("/", householdController.getAllHouseholds);

/**
 * @route   GET /api/households/:id
 * @desc    Get household by ID
 * @access  Public
 */
router.get("/:id", householdController.getHouseholdById);

/**
 * @route   POST /api/households
 * @desc    Create a new household (Admin only)
 * @access  Private
 * @body    {
 *   familyName: string,
 *   address: string,
 *   focalPoint: {
 *     email: string
 *   }
 * }
 */
router.post("/", validateRequest(householdCreateSchema), householdController.createHousehold);

/**
 * @route   PUT /api/households/:id
 * @desc    Update household details
 * @access  Private (Surveyor or Admin)
 * @body    Partial household data
 */
router.put("/:id", validateRequest(householdUpdateSchema), householdController.updateHousehold);

/**
 * @route   POST /api/households/:id/complete-survey
 * @desc    Complete household survey
 * @access  Private (Surveyor or Admin)
 * @body    Complete household data with survey results
 */
router.post(
  "/:id/complete-survey",
  validateRequest(completeSurveySchema),
  householdController.completeSurvey
);

/**
 * @route   DELETE /api/households/:id
 * @desc    Delete household
 * @access  Private (Admin)
 */
router.delete("/:id", householdController.deleteHousehold);

export default router;

// TODO: implement protect and auth middlewares (theoretically, not for now)
