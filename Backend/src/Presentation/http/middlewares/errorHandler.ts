import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { logger } from "../../../utils/logging/loger";
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
    logger.info('From error handler')


    if(error instanceof AppError){
        logger.error(error.stack)
        res.status(error.statusCode).json({
            success: false,
            message: error.message
        })
        return
    }else if(error instanceof ZodError){
        logger.error(error.stack)
        const errorMessage = error.issues.map((err) => err.message)[0]

        res.status(statusCode.BAD_REQUEST).json({
            success: false,
            message: errorMessage
        })
        return
    }else{
      logger.error(error)
      res.status(500).json({
        success: false,
        message: authMessages.error.INTERNAL_SERVER_ERROR
      })
    }
} 