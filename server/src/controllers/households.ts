// TODO implement async handler and error middleware

import { Request, Response } from "express";
import { HouseholdModel } from "../models/Household";
import { HouseholdInputType, HouseholdType } from "../types/HouseholdTypes";

//TODO: move to a separate file and change error responses accordingly
type ApiError = {
  message?: string;
  error?: Error | string;
  success?: boolean;
};

type ApiResponse<T> = T | ApiError;


const getAllHouseholds = async (req: Request, res: Response<ApiResponse<HouseholdType[]>>) => {
  try {
    const households = await HouseholdModel.find().sort({ createdAt: -1 });
    res.status(200).json(households);
  } catch (error) {
    res.status(500).json({ 
      message: "Error fetching households", 
      error: error instanceof Error ? error : String(error)
    });
  }
};

const getHouseholdById = async (req: Request, res: Response<ApiResponse<HouseholdType>>) => {
  try {
    const household = await HouseholdModel.findById(req.params.id);
    if (!household) {
      return res.status(404).json({ message: "Household not found" });
    }
    res.status(200).json(household);
  } catch (error) {
    res.status(500).json({ 
      message: "Error fetching household", 
      error: error instanceof Error ? error : String(error)
    });
  }
};

const createHousehold = async (
  req: Request<{}, {}, HouseholdInputType>,
  res: Response<ApiResponse<HouseholdType>>
) => {
  try {
    const householdData: HouseholdInputType = {
      ...req.body,
      surveyStatus: "pending",
    };
    const household = new HouseholdModel(householdData);
    await household.save();
    res.status(201).json(household);
  } catch (error) {
    res.status(400).json({ 
      message: "Error creating household", 
      error: error instanceof Error ? error : String(error)
    });
  }
};

const updateHousehold = async (
  req: Request<{ id: string }, {}, Partial<HouseholdInputType>>,
  res: Response<ApiResponse<HouseholdType>>
) => {
  try {
    const household = await HouseholdModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!household) {
      return res.status(404).json({ message: "Household not found" });
    }
    res.status(200).json(household);
  } catch (error) {
    // Send only the error message
    console.log(error);
    res.status(400).json({ 
      error: error instanceof Error ? error.message : "Error updating household",
      success: false,
    });
  }
};

const completeSurvey = async (
  req: Request<{ id: string }, {}, Partial<HouseholdInputType>>,
  res: Response<ApiResponse<HouseholdType>>
) => {
  try {
    const household = await HouseholdModel.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        surveyStatus: "completed",
        dateSurveyed: new Date(),
      },
      { new: true, runValidators: true }
    );
    if (!household) {
      return res.status(404).json({ message: "Household not found" });
    }
    res.status(200).json(household);
  } catch (error) {
    res.status(400).json({ 
      message: "Error completing survey", 
      error: error instanceof Error ? error : String(error)
    });
  }
};

const deleteHousehold = async (
  req: Request<{ id: string }>,
  res: Response<ApiResponse<{ message: string }>>
) => {
  try {
    const household = await HouseholdModel.findByIdAndDelete(req.params.id);
    if (!household) {
      return res.status(404).json({ message: "Household not found" });
    }
    res.status(200).json({ message: "Household deleted successfully" });
  } catch (error) {
    res.status(500).json({ 
      message: "Error deleting household", 
      error: error instanceof Error ? error : String(error)
    });
  }
};

const householdController = {
  getAllHouseholds,
  getHouseholdById,
  createHousehold,
  updateHousehold,
  completeSurvey,
  deleteHousehold,
};

export default householdController;
