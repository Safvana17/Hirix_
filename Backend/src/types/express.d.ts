import 'express-serve-static-core'
import { AccessTokenPayload } from "../../Application/candidate/interfaces/service/ITokenService";

declare module 'express-serve-static-core' {
        interface Request {
            user? : AccessTokenPayload,
            cookies: {
               accessToken?: string,
               refreshToken?: string
            },
            validatedQuery?: unknown,
            validatedParams?: unknown
        }
}
 
export {}