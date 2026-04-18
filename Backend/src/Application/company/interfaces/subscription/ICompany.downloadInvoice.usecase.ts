import { CompanyDownloadInvoiceInputDTO, CompanyDownloadInvoiceOutputDTO } from "../../dtos/subscription/company.downloadInvoice.dto";

export interface ICompanyDownloadInvoiceUsecase {
    execute(request: CompanyDownloadInvoiceInputDTO): Promise<CompanyDownloadInvoiceOutputDTO>
}