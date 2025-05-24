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

/**
 * Get all households
 * @description Retrieves all households from the database, sorted by creation date
 * @route GET /api/households
 * @access Public
 * @returns {Promise<void>} Sends response with array of households
 * @throws {ErrorResponse} If database query fails
 */
export const getAllHouseholds = asyncHandler(
  async (req: Request, res: Response<ApiResponse<HouseholdType[]>>) => {
    const households = await HouseholdModel.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: households });
  }
);

/**
 * Get household by ID
 * @description Retrieves a single household by its ID
 * @route GET /api/households/:id
 * @access Public
 * @param {string} id - The household ID
 * @returns {Promise<void>} Sends response with household data
 * @throws {ErrorResponse} If household not found or database query fails
 */
export const getHouseholdById = asyncHandler<{ id: string }>(
  async (req: Request<{ id: string }>, res: Response<ApiResponse<HouseholdType>>) => {
    const household = await HouseholdModel.findById(req.params.id);
    if (!household) {
      throw new ErrorResponse(`Household not found with id of ${req.params.id}`, 404);
    }
    res.status(200).json({ success: true, data: household });
  }
);

/**
 * Create new household
 * @description Creates a new household with initial data
 * @route POST /api/households
 * @access Private
 * @param {HouseholdInputType} body - The household data
 * @returns {Promise<void>} Sends response with created household
 * @throws {ErrorResponse} If validation fails or database operation fails
 */
export const createHousehold = asyncHandler<{}, {}, HouseholdInputType>(
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

/**
 * Update household
 * @description Updates an existing household's data
 * @route PUT /api/households/:id
 * @access Private
 * @param {string} id - The household ID
 * @param {Partial<HouseholdInputType>} body - The update data
 * @returns {Promise<void>} Sends response with updated household
 * @throws {ErrorResponse} If household not found or validation fails
 */
export const updateHousehold = asyncHandler<{ id: string }, {}, Partial<HouseholdInputType>>(
  async (
    req: Request<{ id: string }, {}, Partial<HouseholdInputType>>,
    res: Response<ApiResponse<HouseholdType>>
  ) => {
    const household = await HouseholdModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!household) {
      throw new ErrorResponse(`Household not found with id of ${req.params.id}`, 404);
    }
    res.status(200).json({ success: true, data: household });
  }
);

/**
 * Complete household survey
 * @description Marks a household survey as completed and sets the survey date
 * @route POST /api/households/:id/complete-survey
 * @access Private
 * @param {string} id - The household ID
 * @param {Partial<HouseholdInputType>} body - The survey completion data
 * @returns {Promise<void>} Sends response with updated household
 * @throws {ErrorResponse} If household not found or validation fails
 */
export const completeSurvey = asyncHandler<{ id: string }, {}, Partial<HouseholdInputType>>(
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
      { new: true }
    );
    if (!household) {
      throw new ErrorResponse(`Household not found with id of ${req.params.id}`, 404);
    }
    res.status(200).json({ success: true, data: household });
  }
);

/**
 * Admin Delete household
 * @description Deletes a household by its ID
 * @route DELETE /api/households/:id
 * @access Private (Admin)
 * @param {string} id - The household ID
 * @returns {Promise<void>} Sends success response
 * @throws {ErrorResponse} If household not found or deletion fails
 */
export const deleteHousehold = asyncHandler<{ id: string }>(
  async (req: Request<{ id: string }>, res: Response<ApiResponse<null>>) => {
    const household = await HouseholdModel.findByIdAndDelete(req.params.id);
    if (!household) {
      throw new ErrorResponse(`Household not found with id of ${req.params.id}`, 404);
    }
    res.status(200).json({ success: true, data: null });
  }
);

/**
 * Admin update household
 * @description Updates any household field, including protected fields like email
 * @route PUT /api/households/:id/admin-update
 * @access Private (Admin)
 * @param {string} id - The household ID
 * @param {HouseholdUpdateType} body - The update data
 * @returns {Promise<void>} Sends response with updated household
 * @throws {ErrorResponse} If household not found or validation fails
 */
export const adminUpdateHousehold = asyncHandler<{ id: string }, {}, HouseholdUpdateType>(
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
