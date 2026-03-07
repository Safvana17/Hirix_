import userRole from "../enums/userRole.enum";
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

    constructor(id: string, name: string, email: string, password: string, isVerified: boolean ,isBlocked: boolean, googleId?: string, refreshTokens: string[] = []){
        super(id, name, email, password, isVerified, isBlocked, userRole.Company, googleId, refreshTokens)
    }

}