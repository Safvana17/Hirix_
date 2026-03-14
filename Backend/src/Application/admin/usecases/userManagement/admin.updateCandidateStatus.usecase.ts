import { UserStatus } from "../../../../Domain/enums/userStatus.enum";
import { AppError } from "../../../../Domain/errors/app.error";
import ICandidateRepository from "../../../../Domain/repositoryInterface/iCandidate.repository";
import { authMessages } from "../../../../Shared/constsnts/messages/authMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { UpdataStatusInputDTO, UpdateStatusOutputDTO } from "../../dtos/userManagement/updateStatus.admin.dto";
import { IAdminUpdateCandidateStatus } from "../../interfaces/userManagement/iAdmin.updateCandidateSttaus.usecase";


export class AdminUpdateCandidateStatus implements IAdminUpdateCandidateStatus {
    constructor (
        private _candidateRepository: ICandidateRepository
    ) {}

    async execute(request: UpdataStatusInputDTO): Promise<UpdateStatusOutputDTO> {
        const candidate = await this._candidateRepository.findById(request.id)
        if(!candidate){
            throw new AppError(authMessages.error.COMPANY_NOT_FOUND, statusCode.NOT_FOUND)
        }

        const isBlocked = request.status === 'blocked'
        candidate.setBlocked(isBlocked)
        await this._candidateRepository.update(request.id, candidate)

        return {
                id: candidate.getId(),
                status: isBlocked ? UserStatus.BLOCKED : UserStatus.ACTIVE,
                role: candidate.getRole()
        }
    }
}