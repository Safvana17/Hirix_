export interface CompanyViewSnapshotInputDTO {
    testId: string
    candidateId: string
}


export interface SnapshotsDTO {
    url: string
    capturedAt: Date
}

export interface CompanyViewSnapshotOutputDTO {
    snapshots: SnapshotsDTO[]
}