import { NextFunction, Request, Response } from "express";
import { HouseholdModel, householdModelPaths } from "../models/Household";
import {
  HouseholdInputType,
  HouseholdType,
  HouseholdUpdateType,
  SurveyStatusEnum,
} from "../types/HouseholdTypes";
import asyncHandler from "../middleware/async";
import { ErrorResponse } from "../middleware/error";
import path from "path";
import { uploadPhotoToS3 } from "../utils/s3";
import { UploadedFile } from "../types/FilesTypes";

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
 * @route GET /api/v1/households
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
 * @route GET /api/v1/households/:id
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
 * @route POST /api/v1/households
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
 * @route PUT /api/v1/households/:id
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
 * @description Marks a household survey as completed
 * @route PUT /api/v1/households/:id/complete-survey
 * @access Private
 * @param {string} id - The household ID
 * @returns {Promise<void>} Sends response with updated household
 * @throws {ErrorResponse} If household not found or validation fails
 */
export const completeSurvey = asyncHandler<{ id: string }>(
  async (req: Request<{ id: string }>, res: Response<ApiResponse<HouseholdType>>) => {
    // First check if household exists
    const existingHousehold = await HouseholdModel.findById(req.params.id);
    if (!existingHousehold) {
      throw new ErrorResponse(`Household not found with id of ${req.params.id}`, 404);
    }

    // Use findOneAndUpdate to leverage pre-update hooks
    const household = await HouseholdModel.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          surveyStatus: SurveyStatusEnum.COMPLETED,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!household) {
      throw new ErrorResponse(`Household not found with id of ${req.params.id}`, 404);
    }

    res.status(200).json({ success: true, data: household });
  }
);

/**
 * Admin update household
 * @description Updates any household field, including protected fields like email
 * @route PUT /api/v1/households/:id/admin-update
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

/**
 * Admin Delete household
 * @description Deletes a household by its ID
 * @route DELETE /api/v1/households/:id
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
 * Upload a profile photo for a household's focal point
 * @description Handles file upload, validation, and storage in S3 for a household's focal point profile photo
 * @route PUT /api/v1/households/:id/focal-point-photo
 * @access Private
 * @param {string} id - The household ID
 * @param {File} file - The image file to upload
 * @returns {Promise<void>} Sends response with upload details
 * @throws {ErrorResponse}
 * - 404: If household not found
 * - 400: If no file uploaded, invalid file type, or file too large
 * - 500: If file upload to S3 fails
 */
export const focalPointProfilePhotoUpload = asyncHandler<{ id: string }>(
  async (req: Request, res: Response, next: NextFunction) => {
    let household = await HouseholdModel.findById(req.params.id);

    if (!household) {
      return next(new ErrorResponse(`User not found.`, 404));
    }

    if (!req.files) {
      return next(new ErrorResponse(`Please upload a file`, 400));
    }

    // Get the file from req.files
    const file = req.files.file as UploadedFile;

    if (!file) {
      return next(new ErrorResponse(`Please upload a file`, 400));
    }

    // Make sure that the image is a photo
    if (!file.mimetype.startsWith("image")) {
      return next(new ErrorResponse(`Please upload an image file`, 400));
    }

    const maxFileSizeToUpload = Number(process.env.MAX_FILE_SIZE_TO_UPLOAD) || 5000000;
    const maxFileSizeToUploadInMB = maxFileSizeToUpload / 1000000;

    // Check filesize
    if (file.size > maxFileSizeToUpload) {
      return next(
        new ErrorResponse(
          `You can upload an image with max size of ${maxFileSizeToUploadInMB} MB`,
          400
        )
      );
    }

    // Create custom filename
    file.name = `photo_${household.id}${path.parse(file.name || "").ext}`;

    try {
      const { data: s3ResData, s3Path } = await uploadPhotoToS3({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
        region: process.env.S3_REGION || "",
        s3PhotoUploadPath: process.env.S3_USER_PROFILE_PHOTO_UPLOAD_PATH || "",
        bucketName: process.env.S3_BUCKET || "",
        file,
        dbRecordInstance: household,
        imagePath: householdModelPaths.FOCAL_POINT_PICTURE_URL,
        next,
        doReduceImageQuality: true,
      });

      household.focalPoint.pictureUrl = s3Path;
      await household.save();

      res.status(201).json({
        success: true,
        data: { filename: file.name, s3ResData, s3Path, household: household.toObject() },
      });
    } catch (err) {
      console.log("Error", err);
      return next(new ErrorResponse(`File upload failed`, 500));
    }
  }
);
