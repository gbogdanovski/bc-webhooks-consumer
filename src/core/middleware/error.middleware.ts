import HttpException from "../models/http-exception.model";
import { Request, Response, NextFunction } from "express";

export const errorHandlerMiddleware = (
    error: HttpException,
    request: Request,
    response: Response,
    next: NextFunction
) => {
    const status = error.statusCode || error.status || 500;
    response.status(status).send(error);
};