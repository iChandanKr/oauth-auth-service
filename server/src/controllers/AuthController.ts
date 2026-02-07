import { type Request, type Response, type NextFunction } from "express";
import AuthService from "../services/AuthService.js";
import { getLogger } from "../utils/logger.js";

const logger = getLogger('AuthController');

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;
    logger.info({ email }, 'Login attempt');
    const result = await AuthService.login(email);
    res.status(200).json(result);
  } catch (error: any) {
    next(error);
  }
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await AuthService.register(req.body);
    res.status(201).json(result);
  } catch (error: any) {
    next(error);
  }
};
