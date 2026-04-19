export interface CandidateDownloadInvoiceInputDTO {
    paymentId: string;
    candidateId: string;
}

export interface CandidateDownloadInvoiceOutputDTO {
    fileName: string;
    mimeType: string;
    buffer: Buffer;
}