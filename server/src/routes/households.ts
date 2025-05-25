import express from "express";
import {
  getAllHouseholds,
  getHouseholdById,
  createHousehold,
  updateHousehold,
  completeSurvey,
  deleteHousehold,
  adminUpdateHousehold,
  focalPointProfilePhotoUpload,
} from "../controllers/households";
import { validateRequest } from "../middleware/validateRequest";
import { householdUpdateSchema, householdCreateSchema } from "../validations/householdSchema";

const router = express.Router();

router
  .route("/")
  .get(getAllHouseholds)
  .post(validateRequest(householdCreateSchema), createHousehold);

router
  .route("/:id")
  .get(getHouseholdById)
  .put(validateRequest(householdUpdateSchema), updateHousehold)
  .delete(deleteHousehold);

router.put("/:id/admin-update", validateRequest(householdUpdateSchema), adminUpdateHousehold);

router.put("/:id/complete-survey", completeSurvey);

router.put("/:id/focal-point-photo", focalPointProfilePhotoUpload);

// TODO: implement protect and auth middlewares to support private routes (theoretically, not for now)

export default router;
