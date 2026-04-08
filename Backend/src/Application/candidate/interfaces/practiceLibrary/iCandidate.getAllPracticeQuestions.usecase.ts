import { CandidateGetAllPracticeQuestionsInputDTO, CandidatePaginatedPracticeQuestionDTO } from "../../dtos/practiceLibrary/candidate.getAllPracticeQuestion.dto";

export interface ICandidateGetAllPracticeQuestionUsecase {
    execute(request: CandidateGetAllPracticeQuestionsInputDTO): Promise<CandidatePaginatedPracticeQuestionDTO>
}