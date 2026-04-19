import { CandidateDownloadInvoiceInputDTO, CandidateDownloadInvoiceOutputDTO } from "../../dtos/subscription/candidate.getInvoice.dto";

export interface ICandidateGetInvoiceUsecase {
    execute(request: CandidateDownloadInvoiceInputDTO): Promise<CandidateDownloadInvoiceOutputDTO>
}