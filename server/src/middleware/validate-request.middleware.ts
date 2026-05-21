import { type NextFunction, type Request, type Response } from "express";
import { type ObjectSchema } from "joi";
import { AppError } from "../utils/AppError.js";

type RequestValidationSource = "body" | "params" | "query";

export const validateRequest = (
  schema: ObjectSchema,
  source: RequestValidationSource = "body",
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const requestData = req[source] ?? {};
    const { error, value } = schema.validate(requestData, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const message = error.details.map((detail) => detail.message).join(", ");
      next(new AppError(message, 400));
      return;
    }

    req[source] = value;
    next();
  };
};

export const validateRequestBody = validateRequest;
