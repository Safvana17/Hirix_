export interface CompanyDownloadInvoiceInputDTO {
    paymentId: string;
    companyId: string;
}

export interface CompanyDownloadInvoiceOutputDTO {
    fileName: string;
    mimeType: string;
    buffer: Buffer;
}