import { AppError } from "../../../../Domain/errors/app.error";
import ICandidateRepository from "../../../../Domain/repositoryInterface/iCandidate.repository";
import { authMessages } from "../../../../Shared/constsnts/messages/authMessages";
import { settingsMessages } from "../../../../Shared/constsnts/messages/settingsMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { IHashService } from "../../../interface/service/IHashService";
import { CandidateChangePasswordInputDTO, CandidateChangePasswordOutputDTO } from "../../dtos/profile/candidate.changePassword.dto";
import { ICandidateChangePasswordUsecase } from "../../interfaces/profile/ICandidate.changePassword.usecase";

export class CandidateChangePasswordUsecase implements ICandidateChangePasswordUsecase {
    constructor (
        private _candidateRepository: ICandidateRepository,
        private _hashService:   IHashService,
    ) {}

    async execute(request: CandidateChangePasswordInputDTO): Promise<CandidateChangePasswordOutputDTO> {
        const candidate = await this._candidateRepository.findById(request.candidateId)
        if(!candidate){
            throw new AppError(authMessages.error.COMPANY_NOT_FOUND, statusCode.NOT_FOUND)
        }

        const isMatch = await this._hashService.compare(request.oldPassword, candidate.getPassword())
        if(!isMatch){
            throw new AppError(settingsMessages.error.INCORRECT_PASSWORD, statusCode.BAD_REQUEST)
        }

        const hashedPassword = await this._hashService.hash(request.newPassword)
        await this._candidateRepository.updatePassword(candidate.id, hashedPassword)

        return {success: true}
    }
}