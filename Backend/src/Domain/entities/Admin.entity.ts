import userRole from "../enums/userRole.enum";
import UserEntity from "./user.entity";

export default class AdminEntity extends UserEntity {
    constructor(name: string, email: string, password: string,isVerified: boolean, id?: string, googleId?: string, refreshTokens: string[] = [] ){
        super(name, email, password, isVerified, id, userRole.Admin, googleId, refreshTokens)
    }
}