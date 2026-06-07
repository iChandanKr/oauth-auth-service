import { type Request, type Response, type NextFunction } from "express";
import AuthService from "../services/auth.service.js";
import { getLogger } from "../utils/logger.js";
import type { GoogleLoginDto, LoginDto, RegisterDto } from "../dtos/auth.dto.js";

const logger = getLogger('AuthController');

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.validatedBody as LoginDto;
    logger.info({ email }, 'Login attempt');
    const result = await AuthService.login(email);
    res.status(200).json(result);
  } catch (error: unknown) {
    next(error);
  }
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await AuthService.register(req.validatedBody as RegisterDto);
    res.status(201).json(result);
  } catch (error: unknown) {
    next(error);
  }
};

export const googleLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idToken } = req.validatedBody as GoogleLoginDto;
    logger.info('Google login attempt');
    const result = await AuthService.verifyGoogleToken(idToken);
    res.status(200).json(result);
  } catch (error: unknown) {
    next(error);
  }
};
