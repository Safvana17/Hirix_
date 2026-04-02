// import { NextFunction, Request, Response } from "express";
// import { statusCode } from "../../../Shared/Enumes/statusCode";


// export const validate = (schema) => 
// (req: Request, res: Response, next: NextFunction) => {

//     const result = schema.safeParse({
//         body: req.body,
//         query: req.query,
//         params: req.params
//     });

//     if (!result.success) {
//         return res.status(statusCode.BAD_REQUEST).json({
//             message: "Validation failed",
//             errors: result.error.flatten()
//         });
//     }

//     req.body = result.data.body || {};
//     req.query = result.data.query || {};
//     req.params = result.data.params || {};

//     next();
// };