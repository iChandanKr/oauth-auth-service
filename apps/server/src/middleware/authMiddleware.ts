import { type Request, type Response, type NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { getLogger } from '../utils/logger.js';

const logger = getLogger('AuthMiddleware');

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    
    if (!token) {
        res.sendStatus(401);
        return;
    }

    const secret = process.env.JWT_SECRET || 'fallback_secret';

    jwt.verify(token, secret, (err, user) => {
      if (err) {
        logger.warn('Failed to verify JWT');
        res.sendStatus(403);
        return;
      }
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};
