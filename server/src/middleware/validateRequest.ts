import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';

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
        
        return res.status(400).json({
          status: 'error',
          message: 'Validation failed',
          errors: formattedErrors
        });
      }
      
      // Pass other errors to the central error handler
      next(error);
    }
  };
}; 