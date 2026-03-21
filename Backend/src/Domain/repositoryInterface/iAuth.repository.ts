import { IBaseRepository } from "./iBase.repository";

export interface IAuthRepository<T> extends IBaseRepository<T>{
    updateToken(id: string, token: string): Promise<void>;
    revokeRefreshToken(hashedToken: string): Promise<void>
}