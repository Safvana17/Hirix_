import { InterviewResult } from "../../../../Domain/enums/interview";
import { CandidatePipelineStatus } from "../../../../Domain/enums/Test";
import { AppError } from "../../../../Domain/errors/app.error";
import ICompanyRepository from "../../../../Domain/repositoryInterface/iCompany.repository";
import { IInterviewRepository } from "../../../../Domain/repositoryInterface/iInterview.repository";
import { ITestCandidateRepository } from "../../../../Domain/repositoryInterface/iTestCandidate.repository";
import { authMessages } from "../../../../Shared/constsnts/messages/authMessages";
import { InterviewMessages } from "../../../../Shared/constsnts/messages/interviewMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { CompanyGetInterviewByIdInputDTO, CompanyGetInterviewByIdOutputDTO } from "../../dtos/interview/company.getInterviewById.dto";
import { ICompanyGetInterviewByIdUsecase } from "../../interfaces/interview/ICompany.getInterviewById.usecase";

export class CompanyGetInterviewByIdUsecase implements ICompanyGetInterviewByIdUsecase {
    constructor(
        private _interviewRepository: IInterviewRepository,
        private _companyRepository: ICompanyRepository,
        private _testCandidateRepository: ITestCandidateRepository,
    ) {}

    async execute(request: CompanyGetInterviewByIdInputDTO): Promise<CompanyGetInterviewByIdOutputDTO> {
        const company = await this._companyRepository.findById(request.companyId)
        if(!company) {
            throw new AppError(authMessages.error.COMPANY_NOT_FOUND, statusCode.NOT_FOUND)
        }

        const interview = await this._interviewRepository.findById(request.interviewId)
        if(!interview){
            throw new AppError(InterviewMessages.error.INTERVIEW_NOT_FOUND, statusCode.NOT_FOUND)
        }
        const candidate = await this._testCandidateRepository.findById(interview.testCandidateId!)
        return {
            interview: {
                id: interview.id,
                name: interview.name,
                description: interview.description,
                candidateEmail: interview.candidateEmail,
                candidateName: interview.candidateName,
                interviewerEmail: interview.interviewerEmail,
                interviewerName: interview.interviewerName,
                startTime: interview.scheduledStartTime.toISOString(),
                endTime: interview.scheduledEndTime.toISOString(),
                interviewResult: interview.result ?? InterviewResult.PENDING,
                interviewStatus: interview.interviewStatus,
                round: interview.round,
                candidateStatus: candidate?.selectionStatus ?? CandidatePipelineStatus.INTERVIEW_SCHEDULED
            }
        }
    }
}