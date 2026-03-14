import { UserStatus } from "../../../../Domain/enums/userStatus.enum";


export interface GetAllCompaniesOutputDTO {
    id: string;
    email: string;
    name: string;
    status: UserStatus;
}

export interface AdminCompanyQueryDTO {
    search?: string;
    status?: string;
    page: number;
    limit: number
}

export interface AdminPaginatedCompanyDTO {
    companies: GetAllCompaniesOutputDTO[];
    totalPages: number;
    totalCount: number
}