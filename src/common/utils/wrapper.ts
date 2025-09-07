import { NextFunction, Request, RequestHandler, Response } from "express";
import createHttpError from "http-errors";

export const asyncWrapper = (requesthandler: RequestHandler) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(requesthandler(req, res, next)).catch((err) => {
            if (err instanceof Error) {
                return next(createHttpError(500, err.message));
            } else {
                return next(createHttpError(500, "Internal Server Error"));
            }
        });
    };
};
