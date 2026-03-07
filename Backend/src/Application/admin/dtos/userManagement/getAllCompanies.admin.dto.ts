import { userStatus } from "../../../../Domain/enums/userStatus.enum";


export interface GetAllCompaniesOutputDTO {
    id: string;
    email: string;
    name: string;
    status: userStatus;
    lastActive: Date;
}