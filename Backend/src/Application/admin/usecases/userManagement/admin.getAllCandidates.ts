import { userStatus } from "../../../../Domain/enums/userStatus.enum";
import ICandidateRepository from "../../../../Domain/repositoryInterface/iCandidate.repository";
import { GetAllCandidatesOutputDTO } from "../../dtos/userManagement/getAllCandidate.admin.dto";
import { IAdminGetAllCandidates } from "../../interfaces/userManagement/iAdmin.getAllCandidates.usecase";

export class AdminGetAllCandidates implements IAdminGetAllCandidates {
    constructor(
        private _candidateRepository: ICandidateRepository
    ) {}

    async execute(): Promise<GetAllCandidatesOutputDTO[]> {
        const candidates = await this._candidateRepository.findAll()
        return candidates.map(c => ({
            id: c.getId(),
            name: c.getName(),
            email: c.getEmail(),
            status: c.getIsBlocked() ? userStatus.Blocked : userStatus.Active ,
            lastActive: new Date()
        }))
    }
}