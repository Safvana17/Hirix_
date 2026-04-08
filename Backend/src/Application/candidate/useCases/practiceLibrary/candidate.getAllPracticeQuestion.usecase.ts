import { IQuestionRepository } from "../../../../Domain/repositoryInterface/iQuestion.repository";
import { CandidateGetAllPracticeQuestionsInputDTO, CandidatePaginatedPracticeQuestionDTO } from "../../dtos/practiceLibrary/candidate.getAllPracticeQuestion.dto";
import { ICandidateGetAllPracticeQuestionUsecase } from "../../interfaces/practiceLibrary/iCandidate.getAllPracticeQuestions.usecase";

export class CandidateGetAllPracticeQuestionsUsecase implements ICandidateGetAllPracticeQuestionUsecase{
    constructor(
        private _questionRepository: IQuestionRepository
    ) {}

    async execute(request: CandidateGetAllPracticeQuestionsInputDTO): Promise<CandidatePaginatedPracticeQuestionDTO> {
        const {data, totalCount, totalPages } = await this._questionRepository.findAllPracticeQuestions(request)
        return {
            practiceQuestions: data,
            totalCount,
            totalPages
        }
    }
}