import { CandidateGetQuestionInputDTO, CandidateGetQuestionOutputDTO } from "../../dtos/practiceLibrary/candidate.getQuestionById.dto";

export interface ICandidateGetQuestionByIdUsecase {
    execute(request: CandidateGetQuestionInputDTO): Promise<CandidateGetQuestionOutputDTO>
}