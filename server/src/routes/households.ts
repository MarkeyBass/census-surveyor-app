import express from "express";
import { householdController } from "../controllers/households";
import { validateRequest } from "../middleware/validateRequest";
import { householdSchema } from "../validations/householdSchema";

const router = express.Router();

// Routes
router.get("/", householdController.getAllHouseholds);
router.get("/:id", householdController.getHouseholdById);
router.post("/", validateRequest(householdSchema), householdController.createHousehold);
router.put("/:id", validateRequest(householdSchema), householdController.updateHousehold);
router.post(
  "/:id/complete-survey",
  validateRequest(householdSchema),
  householdController.completeSurvey
);
router.delete("/:id", householdController.deleteHousehold);

export default router;
