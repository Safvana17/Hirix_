import { IInterviewRepository } from "../../../../Domain/repositoryInterface/iInterview.repository";
import { CompanyGetAllInterviewsInputDTO, CompanyGetAllInterviewsOutputDTO } from "../../dtos/interview/company.getAllInterviews.dto";
import { ICompanyGetAllInterviewsUsecase } from "../../interfaces/interview/ICompany.getAllInterview.usecase";

export class CompanyGetAllInterviewsUsecase implements ICompanyGetAllInterviewsUsecase {
    constructor (
        private _interviewRepository: IInterviewRepository
    ) {}
    
    async execute(request: CompanyGetAllInterviewsInputDTO): Promise<CompanyGetAllInterviewsOutputDTO> {
        const {data, totalPages, totalCount} = await this._interviewRepository.findAllFiltered(request)
        return {
            interviews: data,
            totalCount,
            totalPages
        }
    }
}