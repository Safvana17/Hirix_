import { CandidateGetRelatedQuestionsInputDTO, CandidateGetRelatedQuestionsOutputDTO } from "../../dtos/practiceLibrary/candidate.getRelatedQuestions.dto";

export interface ICandidateGetRelatedQuestionsUsecase {
    execute(request: CandidateGetRelatedQuestionsInputDTO): Promise<CandidateGetRelatedQuestionsOutputDTO>
}