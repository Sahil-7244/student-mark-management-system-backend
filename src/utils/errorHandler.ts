import { Request, Response, NextFunction,ErrorRequestHandler } from "express";
import { sendErrorResponse } from "./responseHelper";


export class AppError extends Error {
    public statusCode: number;

    constructor(statusCode: number, message: string) {
        super(message);
        this.statusCode = statusCode;
    }
}

/**
 * Global error handler middleware.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler: ErrorRequestHandler = (err: unknown, req: Request, res: Response, next: NextFunction): void => {
    if (err instanceof Error) {
        console.error("Error:", err.message);
    } else {
        console.error("Error:", err);
    }

    if (err instanceof AppError) {
        sendErrorResponse(res, err.statusCode, err.message);
        return;
    }

    sendErrorResponse(res, 500, err instanceof Error ? err.message : "Internal Server Error");
};
