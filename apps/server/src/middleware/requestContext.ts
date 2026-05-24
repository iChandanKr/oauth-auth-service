import { type Request, type Response, type NextFunction } from 'express';
import { asyncLocalStorage } from '../utils/logger.js';
import { randomUUID } from 'crypto';

export const requestContext = (req: Request, res: Response, next: NextFunction) => {
    const traceId = (req.headers['x-request-id'] as string) || randomUUID();

    // Set the traceId in the response header for client tracking
    res.setHeader('x-request-id', traceId);

    asyncLocalStorage.run({ traceId }, () => {
        next();
    });
};
