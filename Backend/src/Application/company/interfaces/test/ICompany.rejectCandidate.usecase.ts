import { CompanyRejectCandidateInputDTO, CompanyRejectCandidateOutputDTO } from "../../dtos/test/company.rejectCandidate.dto";

export interface ICompanyRejectCandidateUsecase{
    execute(request: CompanyRejectCandidateInputDTO): Promise<CompanyRejectCandidateOutputDTO>
}