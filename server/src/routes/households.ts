import express from "express";
import {
  getAllHouseholds,
  getHouseholdById,
  createHousehold,
  updateHousehold,
  completeSurvey,
  deleteHousehold,
  adminUpdateHousehold,
} from "../controllers/households";
import { validateRequest } from "../middleware/validateRequest";
import {
  householdUpdateSchema,
  completeSurveySchema,
  householdCreateSchema,
} from "../validations/householdSchema";

const router = express.Router();

router.get("/", getAllHouseholds);

router.get("/:id", getHouseholdById);

router.post("/", validateRequest(householdCreateSchema), createHousehold);

router.put("/:id", validateRequest(householdUpdateSchema), updateHousehold);

router.put("/:id/admin-update", validateRequest(householdUpdateSchema), adminUpdateHousehold);

router.post("/:id/complete-survey", validateRequest(completeSurveySchema), completeSurvey);

router.delete("/:id", deleteHousehold);

export default router;

// TODO: implement protect and auth middlewares (theoretically, not for now)
