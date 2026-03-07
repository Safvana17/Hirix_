import { GetAllCandidatesOutputDTO } from "../../dtos/userManagement/getAllCandidate.admin.dto";

export interface IAdminGetAllCandidates {
    execute(): Promise<GetAllCandidatesOutputDTO[]>
}