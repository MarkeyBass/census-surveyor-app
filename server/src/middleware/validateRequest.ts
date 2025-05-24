import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { ErrorResponse } from './error';

/**
 * Middleware to validate request data against a Zod schema
 * @param schema Zod schema to validate against
 */
export const validateRequest = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate request body against schema
      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Format Zod errors
        const formattedErrors = error.errors.map((err) => ({
          path: err.path.join('.'),
          message: err.message
        }));
        
        // Pass to error handler with formatted errors and original error
        next(new ErrorResponse("Zod Validation failed", 400, formattedErrors, error));
      } else {
        // Pass other errors to the central error handler
        next(error);
      }
    }
  };
}; 