import { AppError } from "../../../../Domain/errors/app.error";
import ICandidateRepository from "../../../../Domain/repositoryInterface/iCandidate.repository";
import { IInterviewRepository } from "../../../../Domain/repositoryInterface/iInterview.repository";
import { authMessages } from "../../../../Shared/constsnts/messages/authMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { CandidateInterviewHistoryInputDTO, CandidateTInterviewHistoryOutputDTO } from "../../dtos/profile/candidate.interviewHistory.dto";
import { ICandidateGetInterviewHistoryUsecase } from "../../interfaces/profile/ICandidate.getInterviewHistory.usecase";

export class CandidateGetInterviewHistoryUsecase implements ICandidateGetInterviewHistoryUsecase {
    constructor (
        private _interviewRepository: IInterviewRepository,
        private _candidateRepository: ICandidateRepository
    ) {}

    async execute(request: CandidateInterviewHistoryInputDTO): Promise<CandidateTInterviewHistoryOutputDTO> {
        const candidate = await this._candidateRepository.findById(request.candidateId)
        if(!candidate){
            throw new AppError(authMessages.error.CANDIDATE_NOT_FOUND, statusCode.NOT_FOUND)
        }
        const {history, totalCount, totalPages} = await this._interviewRepository.getInterviewHistory({email: candidate.getEmail(), page: request.page, limit: request.limit})

        console.log('history', history)
        return {
            history,
            totalCount,
            totalPages
        }
    }
}