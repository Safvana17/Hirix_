import { userStatus } from "../../../../Domain/enums/userStatus.enum";

export interface GetAllCandidatesOutputDTO {
    id: string;
    name: string;
    email: string;
    status: userStatus;
    lastActive: Date;
}