export interface CandidateSaveSnapshotInputDTO {
    token: string
    clientSessionToken?: string
    key: string
}

export interface CandidateSaveSnapshotOutputDTO {
    success: boolean
}