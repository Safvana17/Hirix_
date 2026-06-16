export interface CandidateGenerateSnapshotUrlInputDTO {
    token: string
    fileName: string
    contentType: string
}

export interface CandidateGenerateSnapshotUrlOutputDTO {
    uploadUrl: string
    key: string
}