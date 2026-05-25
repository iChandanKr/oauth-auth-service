import { type Request, type Response, type NextFunction } from 'express';
import { AppError } from '../utils/AppError.js';
import { getLogger } from '../utils/logger.js';

const logger = getLogger('ErrorHandler');

const errorHandler = (
    err: Error | AppError,
    req: Request,
    res: Response,
    _next: NextFunction
) => {
    let statusCode = 500;
    let message = 'Internal Server Error';

    if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
    }

    logger.error({
        message: err.message,
        stack: err.stack,
        statusCode,
        path: req.path,
        method: req.method,
    });

    res.status(statusCode).json({
        status: statusCode.toString().startsWith('4') ? 'fail' : 'error',
        message,
    });
};

export default errorHandler;
