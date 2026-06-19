import { NextFunction, Request, Response } from "express";
import { AppError } from "../../../Domain/errors/app.error";
import { authMessages } from "../../../Shared/constsnts/messages/authMessages";
import { statusCode } from "../../../Shared/Enumes/statusCode";

export const verifyCsrf = (req: Request, res: Response, next: NextFunction) => {
    const csrfCookie = req.cookies["XSRF-TOKEN"]
    const csrfHeaderRaw = req.headers["x-csrf-token"] || req.headers["X-CSRF-TOKEN"];
    const csrfHeader = Array.isArray(csrfHeaderRaw)
          ? csrfHeaderRaw[0]
          : csrfHeaderRaw;
    console.log('csrf cookies', csrfCookie)
    console.log('csrf header', csrfHeaderRaw)
    console.log('csrf cookies', csrfCookie)
    console.log("isEqual: ", csrfCookie === csrfHeader)
    if(!csrfCookie || !csrfHeader || csrfCookie !== csrfHeader){
        throw new AppError(authMessages.error.INVALID_CSRF_TOKEN, statusCode.FORBIDDEN)
    }

    console.log("CSRF PASSED");
    next()
}
