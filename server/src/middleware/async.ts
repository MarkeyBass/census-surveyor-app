import { Request, Response, NextFunction } from "express";

/**
 * Type definition for async request handler functions
 * @template T - Type for URL parameters (e.g. { id: string })
 * @template U - Type for response body (e.g. { message: string })
 * @template V - Type for request body (e.g. { name: string })
 */
type AsyncFunction<T = any, U = any, V = any> = (
  req: Request<T, U, V>,
  res: Response,
  next: NextFunction
) => Promise<any>;

/**
 * Wrapper function to handle async errors in Express route handlers
 * 
 * @description
 * This middleware wraps async route handlers to automatically catch and forward errors
 * to Express's error handling middleware. It eliminates the need for try-catch blocks
 * in route handlers.
 * 
 * @template T - Type for URL parameters (e.g. { id: string })
 * @template U - Type for response body (e.g. { message: string })
 * @template V - Type for request body (e.g. { name: string })
 * 
 * @param fn - Async function to be wrapped
 * @returns Express middleware function
 */

const asyncHandler =
  <T = any, U = any, V = any>(fn: AsyncFunction<T, U, V>) =>
  (req: Request<T, U, V>, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

export default asyncHandler;
