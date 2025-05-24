import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import dotenv from "dotenv";
import path from "path";

// Load environment variables from the correct path
dotenv.config({ path: path.join(__dirname, "../config/config.env") });

class ErrorResponse extends Error {
  statusCode: number;
  errors?: Array<{ path: string; message: string }>;
  originalError?: Error;

  constructor(message: string, statusCode: number, errors?: Array<{ path: string; message: string }>, originalError?: Error) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.originalError = originalError;
  }
}

const errorHandler = (
  err: Error | ErrorResponse | ZodError,
  req: Request,
  res: Response,
  next: NextFunction
) => {


  // For other errors, create a copy and ensure message exists
  let error: ErrorResponse;

  if (err instanceof ErrorResponse) {
    error = err;
  } else {
    error = new ErrorResponse(err.message || "An error occurred", (err as any).statusCode || 500);
  }

  // Log to console for dev (development, dev, test, staging)
  if (
    process.env.NODE_ENV === "development" ||
    process.env.NODE_ENV === "dev" ||
    process.env.NODE_ENV === "test" ||
    process.env.NODE_ENV === "staging"
  ) {
    console.error("Error:", {
      name: err.name,
      message: err.message,
      stack: err.stack,
      statusCode: error.statusCode,
      originalError: error.originalError // Include the original error if it exists
    });
  }

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    const message = `Resource not found with id of ${err.message}`;
    error = new ErrorResponse(message, 404);
  }

  // Mongoose duplicate key
  if ((err as any).code === 11000) {
    const message = "Duplicate field value entered";
    error = new ErrorResponse(message, 400);
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const formattedErrors = Object.values((err as any).errors).map((val: any) => ({
      path: val.path,
      message: val.message,
    }));

    return res.status(400).json({
      success: false,
      error: "Validation failed",
      errors: formattedErrors,
    });
  }

  // Default error response
  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Server Error",
    ...(error.errors && { errors: error.errors })
  });
};

export { ErrorResponse, errorHandler };
