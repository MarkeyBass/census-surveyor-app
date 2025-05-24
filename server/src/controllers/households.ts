import { Request, Response } from "express";
import { HouseholdModel } from "../models/Household";
import { HouseholdInputType, HouseholdType, HouseholdUpdateType } from "../types/HouseholdTypes";
import asyncHandler from "../middleware/async";
import { ErrorResponse } from "../middleware/error";

/**
 * Standard API response structure
 * @template T - Type of the successful response data
 */
type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
  errors?: Array<{ path: string; message: string }>;
};

const getAllHouseholds = asyncHandler(
  async (req: Request, res: Response<ApiResponse<HouseholdType[]>>) => {
    const households = await HouseholdModel.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: households });
  }
);

const getHouseholdById = asyncHandler<{ id: string }>(
  async (req: Request<{ id: string }>, res: Response<ApiResponse<HouseholdType>>) => {
    const household = await HouseholdModel.findById(req.params.id);
    if (!household) {
      throw new ErrorResponse(`Household not found with id of ${req.params.id}`, 404);
    }
    res.status(200).json({ success: true, data: household });
  }
);

const createHousehold = asyncHandler<{}, {}, HouseholdInputType>(
  async (req: Request<{}, {}, HouseholdInputType>, res: Response<ApiResponse<HouseholdType>>) => {
    const householdData: HouseholdInputType = {
      ...req.body,
      surveyStatus: "pending",
    };
    const household = new HouseholdModel(householdData);
    await household.save();
    res.status(201).json({ success: true, data: household });
  }
);

const updateHousehold = asyncHandler<{ id: string }, {}, Partial<HouseholdInputType>>(
  async (
    req: Request<{ id: string }, {}, Partial<HouseholdInputType>>,
    res: Response<ApiResponse<HouseholdType>>
  ) => {
    const household = await HouseholdModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!household) {
      throw new ErrorResponse(`Household not found with id of ${req.params.id}`, 404);
    }
    res.status(200).json({ success: true, data: household });
  }
);

const completeSurvey = asyncHandler<{ id: string }, {}, Partial<HouseholdInputType>>(
  async (
    req: Request<{ id: string }, {}, Partial<HouseholdInputType>>,
    res: Response<ApiResponse<HouseholdType>>
  ) => {
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
      throw new ErrorResponse(`Household not found with id of ${req.params.id}`, 404);
    }
    res.status(200).json({ success: true, data: household });
  }
);

const deleteHousehold = asyncHandler<{ id: string }>(
  async (req: Request<{ id: string }>, res: Response<ApiResponse<null>>) => {
    const household = await HouseholdModel.findByIdAndDelete(req.params.id);
    if (!household) {
      throw new ErrorResponse(`Household not found with id of ${req.params.id}`, 404);
    }
    res.status(200).json({ success: true, data: null });
  }
);

const adminUpdateHousehold = asyncHandler<{ id: string }, {}, HouseholdUpdateType>(
  async (
    req: Request<{ id: string }, {}, HouseholdUpdateType>,
    res: Response<ApiResponse<HouseholdType>>
  ) => {
    const household = await HouseholdModel.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        isAdminUpdate: true,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!household) {
      throw new ErrorResponse(`Household not found with id of ${req.params.id}`, 404);
    }

    res.status(200).json({
      success: true,
      data: household,
    });
  }
);

const householdController = {
  getAllHouseholds,
  getHouseholdById,
  createHousehold,
  updateHousehold,
  completeSurvey,
  deleteHousehold,
  adminUpdateHousehold,
};

export default householdController;
