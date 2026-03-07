import userRole from "../enums/userRole.enum";
import UserEntity from "./user.entity";

export default class CandidateEntity extends UserEntity{

    constructor(id: string, name: string, email: string, password: string, isVerified: boolean,isBlocked: boolean, googleId?: string, refreshToken?: string[]){
        super(id, name, email, password, isVerified, isBlocked, userRole.Candidate, googleId, refreshToken)
    }
}