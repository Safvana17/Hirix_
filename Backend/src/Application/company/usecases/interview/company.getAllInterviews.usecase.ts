import { IInterviewRepository } from "../../../../Domain/repositoryInterface/iInterview.repository";
import { CompanyGetAllInterviewsInputDTO, CompanyGetAllInterviewsOutputDTO } from "../../dtos/interview/company.getAllInterviews.dto";
import { ICompanyGetAllInterviewsUsecase } from "../../interfaces/interview/ICompany.getAllInterview.usecase";

export class CompanyGetAllInterviewsUsecase implements ICompanyGetAllInterviewsUsecase {
    constructor (
        private _interviewRepository: IInterviewRepository
    ) {}
    
    async execute(request: CompanyGetAllInterviewsInputDTO): Promise<CompanyGetAllInterviewsOutputDTO> {
        const {data, totalPages, totalCount} = await this._interviewRepository.findAllFiltered(request)
        console.log('data from usecase :', data)
        return {
            interviews: data.map((d) => ({
                _id: d._id.toString(),
                name: d.name,
                description: d.description,
                round: d.round,
                candidateName: d.candidateName,
                candidateStatus: d.candidateStatus,
                interviewerName: d.interviewerName,
                result: d.result,
                interviewerEmail: d.interviewerEmail,
                interviewStatus: d.interviewStatus,
                scheduledStartTime: d.scheduledStartTime,
                hasNextRound: d.hasNextRound,
                scheduledEndTime: d.scheduledEndTime,
                candidateEmail: d.candidateEmail,
                testCandidateId: d.testCandidateId,
                testId: d.testId,
                jobRoleId: d.jobRoleId,
                roomId: d.roomId,
                interviewerToken: d.interviewerToken,
                selectionStatus: d.selectionStatus
            })),
            totalCount,
            totalPages
        }
    }
}