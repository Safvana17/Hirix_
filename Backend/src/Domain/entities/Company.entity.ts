import userRole from "../enums/userRole.enum";
import { UserStatus } from "../enums/userStatus.enum";
import UserEntity from "./User.entity";


export interface CompanyCertificate {
    _id?: string
    type: 'GST' | 'COI'
    number: string
    url: string
    key: string
    fileName: string
    contentType: string
    uploadedAt?: Date
}

export default class CompanyEntity extends UserEntity{
    profileLogo?: string
    
    legalName?: string;
    domain?: string;
    website?: string;
    teamSize?: number;
    about?: string;

    certificates: CompanyCertificate[] = []

    phoneNumber?: string;
    streetName?: string;
    country?: string;
    state?: string;
    city?: string;
    pinCode?: string;
    primaryContactName?: string;
    billingEmail?: string;

    subscriptionId?: string;
    isAdminVerified: boolean;
    isDeleted: boolean;
    deleteReason?: string;
    deleteFeedback?: string;
    status: UserStatus;
    deletedAt?: Date | null;
    isProfileUpdated: boolean;

    constructor(id: string, name: string, email: string, password: string, isVerified: boolean ,isBlocked: boolean,isAdminVerified: boolean, status: UserStatus,isDeleted: boolean,isProfileUpdated: boolean, googleId?: string, refreshTokens: string[] = []){
        super(id, name, email, password, isVerified, isBlocked, userRole.Company, googleId, refreshTokens)
        this.isAdminVerified = isAdminVerified;
        this.status = status;
        this.isDeleted = isDeleted;
        this.isProfileUpdated = isProfileUpdated
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
    public getIsDeleted(): boolean {
        return this.isDeleted
    }

}