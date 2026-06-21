export interface CandidateGenerateSnapshotUrlInputDTO {
    token: string
    clientSessionToken?: string
    fileName: string
    contentType: string
}

export interface CandidateGenerateSnapshotUrlOutputDTO {
    uploadUrl: string
    key: string
}