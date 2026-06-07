import Joi from "joi";
import type { GoogleLoginDto, LoginDto, RegisterDto } from "../dtos/auth.dto.js";

export const loginSchema = Joi.object<LoginDto>({
  email: Joi.string().email().required(),
});

export const registerSchema = Joi.object<RegisterDto>({
  firstName: Joi.string().trim().min(2).max(100).required(),
  lastName: Joi.string().trim().min(1).max(100).optional(),
  email: Joi.string().trim().email().required(),
  password: Joi.string().min(6).max(128).required(),
});

export const googleLoginSchema = Joi.object<GoogleLoginDto>({
  idToken: Joi.string().trim().required(),
});
