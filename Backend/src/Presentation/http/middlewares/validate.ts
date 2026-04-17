// import { NextFunction, Request, Response } from "express";
// import { ZodSchema } from "zod";


// export const validate = (schema: ZodSchema, property: 'body' | 'query' | 'params') => {
//    return (req: Request, res: Response, next: NextFunction) => {
//        const parsed = schema.parse(req[property]);
//        req[property] = parsed
//         next();
//     }
// };

// utils/validate.ts

// import { ZodSchema } from "zod";

// export const validate = <T>(schema: ZodSchema<T>, data: unknown): T => {
//   return schema.parse(data);
// };

import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodTypeAny, z } from "zod";

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
    if(property === 'query'){
      req.validatedQuery = parsed
    }else{
    req[property] = parsed;
    }
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


// import { Request, Response, NextFunction } from 'express';
// import { AnyZodObject } from 'zod';

// export const validateRequest = (schemas: { body?: ZodSchema, query?: ZodSchema, params?: ZodSchema }) => {
//   return async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       if (schemas.params) req.params = await schemas.params.parseAsync(req.params) as any;
//       if (schemas.query) req.query = await schemas.query.parseAsync(req.query);
//       if (schemas.body) req.body = await schemas.body.parseAsync(req.body);
      
//       next();
//     } catch (error) {
//       // Handle Zod validation error
//       return res.status(400).json({ error: error }); 
//     }
//   };
// };



// import { ZodObject } from 'zod';

// export const validateRequest = (schema: ZodObject) => {
//   return async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       // It's recommended to use parseAsync in case any schemas use async refinements
//       const parsed = await schema.parseAsync({
//         params: req.params,
//         query: req.query,
//         body: req.body
//       });

//       // Cast parsed to safely access optional properties
//       const { params, query, body } = parsed as {
//         params?: typeof req.params;
//         query?: typeof req.query;
//         body?: typeof req.body;
//       };

//       if (params) req.params = params;
//       if (query) req.query = query;
//       if (body) req.body = body;

//       next();
//     } catch (error) {
//       next(error);
//     }
//   };
// };
