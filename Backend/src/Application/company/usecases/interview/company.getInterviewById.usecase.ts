import { AppError } from "../../../../Domain/errors/app.error";
import ICompanyRepository from "../../../../Domain/repositoryInterface/iCompany.repository";
import { IInterviewRepository } from "../../../../Domain/repositoryInterface/iInterview.repository";
import { authMessages } from "../../../../Shared/constsnts/messages/authMessages";
import { InterviewMessages } from "../../../../Shared/constsnts/messages/interviewMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { CompanyGetInterviewByIdInputDTO, CompanyGetInterviewByIdOutputDTO } from "../../dtos/interview/company.getInterviewById.dto";
import { ICompanyGetInterviewByIdUsecase } from "../../interfaces/interview/ICompany.getInterviewById.usecase";

export class CompanyGetInterviewByIdUsecase implements ICompanyGetInterviewByIdUsecase {
    constructor(
        private _interviewRepository: IInterviewRepository,
        private _companyRepository: ICompanyRepository
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
        return {
            interview
        }
    }
}