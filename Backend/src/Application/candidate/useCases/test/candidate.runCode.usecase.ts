import { CandidateTestStatus } from "../../../../Domain/enums/Test";
import { AppError } from "../../../../Domain/errors/app.error";
import { ITestCandidateRepository } from "../../../../Domain/repositoryInterface/iTestCandidate.repository";
import { TestMessages } from "../../../../Shared/constsnts/messages/testMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { ICodeRunnerService } from "../../../interface/service/IcodeRunnerService";
import { CandidateRunCodeInputDTO, CanadidateRunCodeOutputDTO } from "../../dtos/test/candidate.runCode.dto";
import { ICandidateRunCodeUsecase } from "../../interfaces/test/ICandidate.runCode.usecase";

export class CandidateRunCodeUsecase implements ICandidateRunCodeUsecase {
    constructor(
        private _testCandidateRepository: ITestCandidateRepository,
        private _codeRunnerService: ICodeRunnerService
    ) {}
    
    async execute(request: CandidateRunCodeInputDTO): Promise<CanadidateRunCodeOutputDTO> {
        const candidate = await this._testCandidateRepository.findByToken(request.token)
        if(!candidate){
            throw new AppError(TestMessages.error.CANDIDATE_NOT_FOUND, statusCode.NOT_FOUND)
        }

        if(candidate.candidateTestStatus !== CandidateTestStatus.IN_PROGRESS){
            throw new AppError(TestMessages.error.CANNOT_RUN_CODE, statusCode.BAD_REQUEST)
        }

        return this._codeRunnerService.runCode({
            language: request.language,
            sourceCode: request.sourceCode,
            input: request.input
        })
    }
}