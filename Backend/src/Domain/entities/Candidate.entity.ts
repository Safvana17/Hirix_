import userRole from "../enums/userRole.enum";
import UserEntity from "./user.entity";

export default class CandidateEntity extends UserEntity{

    constructor(name: string, email: string, password: string, isVerified: boolean, id?: string, googleId?: string, refreshToken?: string[]){
        super(name, email, password,isVerified, id, userRole.Candidate, googleId, refreshToken)
    }
}