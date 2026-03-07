import userRole from "../enums/userRole.enum";
import UserEntity from "./user.entity";

export default class AdminEntity extends UserEntity {
    constructor(id: string, name: string, email: string, password: string,isVerified: boolean, isBlocked: boolean, googleId?: string, refreshTokens: string[] = [] ){
        super(id, name, email, password, isVerified, isBlocked, userRole.Admin, googleId, refreshTokens)
    }
}