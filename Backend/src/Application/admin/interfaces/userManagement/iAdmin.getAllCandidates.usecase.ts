import { AdminCandidateQueryDTO, AdminPaginatedCandidateDTO } from "../../dtos/userManagement/getAllCandidate.admin.dto";

export interface IAdminGetAllCandidates {
    execute(query: AdminCandidateQueryDTO): Promise<AdminPaginatedCandidateDTO>
}