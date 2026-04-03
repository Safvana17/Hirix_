import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { AppError } from "../../../Domain/errors/app.error";
import { ZodError } from "zod";
import { statusCode } from "../../../Shared/Enumes/statusCode";
import { authMessages } from "../../../Shared/constsnts/messages/authMessages";

export const errorHandler: ErrorRequestHandler = (
    error: unknown,
    req: Request,
    res: Response,
    next: NextFunction
): void =>{
    req.log.error(error, 'From error handler')


    if(error instanceof AppError){
        req.log.error({error: error.message}, 'AppError')
        res.status(error.statusCode).json({
            success: false,
            message: error.message
        })
        return
    }else if(error instanceof ZodError){
        const errorMessage = error.issues.map((err) => err.message)[0]

        res.status(statusCode.BAD_REQUEST).json({
            success: false,
            message: errorMessage
        })
        return
    }else {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : authMessages.error.INTERNAL_SERVER_ERROR
      })
    }
} 