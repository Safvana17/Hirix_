import userRole from "../enums/userRole.enum";
import { UserStatus } from "../enums/userStatus.enum";
import UserEntity from "./user.entity";

export default class CompanyEntity extends UserEntity{
    legalName?: string;
    domain?: string;
    teamSize?: number;
    about?: string;

    phoneNumber?: string;
    streetName?: string;
    country?: string;
    state?: string;
    city?: string;
    pinCode?: string;

    subscriptionId?: string;
    isAdminVerified: boolean;
    status: UserStatus

    constructor(id: string, name: string, email: string, password: string, isVerified: boolean ,isBlocked: boolean,isAdminVerified: boolean, status: UserStatus, googleId?: string, refreshTokens: string[] = []){
        super(id, name, email, password, isVerified, isBlocked, userRole.Company, googleId, refreshTokens)
        this.isAdminVerified = isAdminVerified;
        this.status = status;
    }

    public getIsAdminVerified(): boolean{
        return this.isAdminVerified
    }
    public setIsAdminVerified(value: boolean): void {
        this.isAdminVerified = value
    }
    public getStatus(): UserStatus {
        return this.status
    }
    public setStatus(status: UserStatus):void {
        this.status = status
    }

}