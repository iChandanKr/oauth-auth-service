export class AppError extends Error {
    public static readonly StatusCode = {
        BAD_REQUEST: 400,
        UNAUTHORIZED: 401,
        FORBIDDEN: 403,
        NOT_FOUND: 404,
        CONFLICT: 409,
        INTERNAL_SERVER_ERROR: 500,
    } as const;

    public statusCode: number;
    public status: string;
    public isOperational: boolean;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }

    public static create(message: string, statusCode: number) {
        return new AppError(message, statusCode);
    }

    public static badRequest(message: string) {
        return AppError.create(message, AppError.StatusCode.BAD_REQUEST);
    }

    public static unauthorized(message: string) {
        return AppError.create(message, AppError.StatusCode.UNAUTHORIZED);
    }

    public static forbidden(message: string) {
        return AppError.create(message, AppError.StatusCode.FORBIDDEN);
    }

    public static notFound(message: string) {
        return AppError.create(message, AppError.StatusCode.NOT_FOUND);
    }

    public static conflict(message: string) {
        return AppError.create(message, AppError.StatusCode.CONFLICT);
    }

    public static internal(message = 'Internal Server Error') {
        return AppError.create(message, AppError.StatusCode.INTERNAL_SERVER_ERROR);
    }
}
