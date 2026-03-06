import CandidateEntity from "../../../../Domain/entities/candidate.entity";

export interface IAdminGetAllCandidates {
    execute(): Promise<CandidateEntity>
}