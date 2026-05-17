import { ICandidateRankingService } from "../../Application/interface/service/ICandidateRankingService";
import { CandidateTestStatus, ValuationStatus } from "../../Domain/enums/Test";
import { ITestCandidateRepository } from "../../Domain/repositoryInterface/iTestCandidate.repository";

export class CandidateRankingService implements ICandidateRankingService {
    constructor(
        private _testCandidateRepository: ITestCandidateRepository
    ) {}

    async rankCandidate(testId: string): Promise<void> {
        const candidates = await this._testCandidateRepository.findByTestId(testId) ?? []
        const rankableCandidates = candidates
            .filter((candidate) => candidate.candidateTestStatus === CandidateTestStatus.SUBMITTED && candidate.evaluationStatus === ValuationStatus.EVALUATED)
            .map((candidate) => {
                const totalTimeTakenInSeconds = candidate.startedAt && candidate.submittedAt 
                   ? Math.floor((candidate.submittedAt.getTime() - candidate.startedAt.getTime()) / 1000)
                   : 0
                candidate.totalTimeTakenInSeconds = totalTimeTakenInSeconds
                return candidate
            }) 
        rankableCandidates?.sort((a, b) => {
            const marksA = a.marksObtained ?? 0
            const marksB = b.marksObtained ?? 0
            if(marksB !== marksA) {
                return marksB - marksA
            }
            const timeA = a.totalTimeTakenInSeconds ?? 0
            const timeB = b.totalTimeTakenInSeconds ?? 0
            return timeA - timeB
        })
        for(let i=0; i<rankableCandidates.length; i++) {
            const candidate = rankableCandidates[i]
            candidate.aiRank = i + 1
            await this._testCandidateRepository.update(candidate.id, candidate)
        }
    }    
}