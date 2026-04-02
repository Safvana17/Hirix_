import { UserStatus } from "../../../../Domain/enums/userStatus.enum";
import ICandidateRepository from "../../../../Domain/repositoryInterface/iCandidate.repository";
import { AdminCandidateQueryDTO, AdminPaginatedCandidateDTO } from "../../dtos/userManagement/getAllCandidate.admin.dto";
import { IAdminGetAllCandidates } from "../../interfaces/userManagement/iAdmin.getAllCandidates.usecase";

export class AdminGetAllCandidates implements IAdminGetAllCandidates {
    constructor(
        private _candidateRepository: ICandidateRepository
    ) {}

    /**
     * 
     * @param query to fetch all candidates 
     * @returns - all candidates, total count and total pages
     */
    async execute(query: AdminCandidateQueryDTO): Promise<AdminPaginatedCandidateDTO> {
        // const candidates = await this._candidateRepository.findAll()

        const {data, totalPages, totalCount } = await this._candidateRepository.findAllFiltered(query)
        return {
            candidates:  data.map(c => ({
                id: c.getId(),
                name: c.getName(),
                email: c.getEmail(),
                status: c.getIsBlocked() ? UserStatus.BLOCKED : UserStatus.ACTIVE ,
            })),
            totalCount,
            totalPages
        }
    }
}