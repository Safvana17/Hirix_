import { userStatus } from "../../../../Domain/enums/userStatus.enum";
import ICandidateRepository from "../../../../Domain/repositoryInterface/iCandidate.repository";
import { AdminCandidateQueryDTO, AdminPaginatedCandidateDTO, GetAllCandidatesOutputDTO } from "../../dtos/userManagement/getAllCandidate.admin.dto";
import { IAdminGetAllCandidates } from "../../interfaces/userManagement/iAdmin.getAllCandidates.usecase";

export class AdminGetAllCandidates implements IAdminGetAllCandidates {
    constructor(
        private _candidateRepository: ICandidateRepository
    ) {}

    async execute(query: AdminCandidateQueryDTO): Promise<AdminPaginatedCandidateDTO> {
        // const candidates = await this._candidateRepository.findAll()

        const {data, totalPages, totalCount } = await this._candidateRepository.findAllFiltered(query)
        return {
            candidates:  data.map(c => ({
                id: c.getId(),
                name: c.getName(),
                email: c.getEmail(),
                status: c.getIsBlocked() ? userStatus.Blocked : userStatus.Active ,
            })),
            totalCount,
            totalPages
        }
    }
}