import Joi from "joi";

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
});

export const registerSchema = Joi.object({
  firstName: Joi.string().trim().min(2).max(100).required(),
  lastName: Joi.string().trim().min(1).max(100).optional(),
  email: Joi.string().trim().email().required(),
  password: Joi.string().min(6).max(128).required(),
});

export const googleLoginSchema = Joi.object({
  idToken: Joi.string().trim().required(),
});
