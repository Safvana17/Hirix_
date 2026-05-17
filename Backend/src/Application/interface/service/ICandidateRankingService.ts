export interface ICandidateRankingService{
    rankCandidate(testId: string): Promise<void>
}