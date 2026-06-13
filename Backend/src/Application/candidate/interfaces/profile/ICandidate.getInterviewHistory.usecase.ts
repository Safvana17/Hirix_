import { CandidateInterviewHistoryInputDTO, CandidateTInterviewHistoryOutputDTO } from "../../dtos/profile/candidate.interviewHistory.dto";

export interface ICandidateGetInterviewHistoryUsecase {
    execute(request: CandidateInterviewHistoryInputDTO): Promise<CandidateTInterviewHistoryOutputDTO>
}