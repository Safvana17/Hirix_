// import { NextFunction, Request, Response } from "express";
// import { ZodSchema } from "zod";


// export const validate = (schema: ZodSchema, property: 'body' | 'query' | 'params') => {
//    return (req: Request, res: Response, next: NextFunction) => {
//        const parsed = schema.parse(req[property]);
//        req[property] = parsed
//         next();
//     }
// };

import { Request, Response, NextFunction } from "express";
import { ZodSchema, z } from "zod";

type RequestProperty = "body" | "query" | "params";

export const validate =
  <T extends ZodSchema>(schema: T, property: RequestProperty) =>
  (
    req: Request,
    res: Response,
    next: NextFunction
  ): asserts req is Request & {
    [K in typeof property]: z.infer<T>;
  } => {
    const parsed = schema.parse(req[property]);
    req[property] = parsed;
    next();
  };


// import { Request, Response, NextFunction } from "express";
// import { z, ZodType } from "zod";
// import { ParsedQs } from "qs";

// type RequestSchema = {
//   body: unknown;
//   query: ParsedQs;
//   params: Record<string, string>;
// };

// export const validate = <T extends ZodType<RequestSchema>>(schema: T) => {
//   return (req: Request, res: Response, next: NextFunction) => {

//     const result = schema.safeParse({
//       body: req.body,
//       query: req.query,
//       params: req.params
//     });

//     if (!result.success) {
//       return res.status(400).json({
//         message: "Validation failed",
//         errors: result.error.issues
//       });
//     }

//     const data = result.data;

//     req.body = data.body;
//     req.query = data.query;     // ✅ now matches ParsedQs
//     req.params = data.params;

//     next();
//   };
// };