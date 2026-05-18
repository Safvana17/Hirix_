import { CompanyShortlistCandidateInputDTO, CompanyShortlistCandidateOutputDTO } from "../../dtos/test/company.shortlistCandidate.dto";

export interface ICompanyShortlistCandidateUsecase {
    execute(request: CompanyShortlistCandidateInputDTO): Promise<CompanyShortlistCandidateOutputDTO>
}