import { type NextFunction, type Request, type Response } from "express";
import { type ObjectSchema } from "joi";
import { AppError } from "../utils/AppError.js";

type RequestValidationSource = "body" | "params" | "query";

const validatedRequestKey = {
  body: "validatedBody",
  params: "validatedParams",
  query: "validatedQuery",
} as const satisfies Record<RequestValidationSource, keyof Request>;

export const validateRequest = <TValidated>(
  schema: ObjectSchema<TValidated>,
  source: RequestValidationSource = "body",
) => (req: Request, res: Response, next: NextFunction) => {
  const requestData = req[source] ?? {};
  const { error, value } = schema.validate(requestData, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const message = error.details.map((detail) => detail.message).join(", ");
    next(AppError.badRequest(message));
    return;
  }

  req[validatedRequestKey[source]] = value;

  next();
};

export const validateRequestBody = validateRequest;
