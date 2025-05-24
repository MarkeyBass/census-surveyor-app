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

// TODO: implement protect and auth middlewares to support private routes (theoretically, not for now) - mau=ybe fetch the data from the db inside the schema or use the schema inside the controller...
// router.post("/:id/complete-survey", validateRequest(completeSurveySchema), completeSurvey);
router.put("/:id/complete-survey", completeSurvey);

router.delete("/:id", deleteHousehold);

export default router;


