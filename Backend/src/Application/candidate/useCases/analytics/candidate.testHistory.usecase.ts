import { AppError } from "../../../../Domain/errors/app.error";
import ICandidateRepository from "../../../../Domain/repositoryInterface/iCandidate.repository";
import { ITestCandidateRepository } from "../../../../Domain/repositoryInterface/iTestCandidate.repository";
import { authMessages } from "../../../../Shared/constsnts/messages/authMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { CandidateTestHistoryInputDTO, CandidateTestHistoryOutputDTO } from "../../dtos/analytics/candidate.testHistory.dto";
import { ICandidateTestHistoryUsecase } from "../../interfaces/analytics/ICandidate.testHistory.usecase";

export class CandidateTestHistoryUsecase implements ICandidateTestHistoryUsecase {
    constructor (
        private _candidateRepository: ICandidateRepository,
        private _testCandidateRepositoy: ITestCandidateRepository,
    ) {}

    async execute(request: CandidateTestHistoryInputDTO): Promise<CandidateTestHistoryOutputDTO> {
        const candidate = await this._candidateRepository.findById(request.candidateId)
        if(!candidate){
            throw new AppError(authMessages.error.CANDIDATE_NOT_FOUND, statusCode.NOT_FOUND)
        }
        const {history, totalCount, totalPages} = await this._testCandidateRepositoy.getCandidateHistory({email: candidate.getEmail(), page: request.page, limit: request.limit})

        return {
            history,
            totalCount,
            totalPages
        }
    }
}