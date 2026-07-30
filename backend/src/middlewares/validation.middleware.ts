import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { ApiResponseHelper } from "../utils/api-response";

export const validationMiddleware =
  (schema: ZodSchema) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return ApiResponseHelper.error(
        res,
        result.error.issues[0]?.message ?? "Validation failed",
        400
      );
    }

    req.body = result.data;

    next();
  };