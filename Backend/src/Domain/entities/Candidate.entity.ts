import userRole from "../enums/userRole.enum";
import { UserStatus } from "../enums/userStatus.enum";
import UserEntity from "./user.entity";

export default class CandidateEntity extends UserEntity{

    subscriptionId?: string
    status: UserStatus

    constructor(id: string, name: string, email: string, password: string, isVerified: boolean,isBlocked: boolean,status: UserStatus, googleId?: string, refreshToken?: string[]){
        super(id, name, email, password, isVerified, isBlocked, userRole.Candidate, googleId, refreshToken)
        this.status = status
    }

    public getStatus(): UserStatus {
        return this.status
    }
    public setStatus(status: UserStatus):void {
        this.status = status
    }
}