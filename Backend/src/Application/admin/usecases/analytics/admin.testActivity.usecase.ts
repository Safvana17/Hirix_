import { ITestRepository } from "../../../../Domain/repositoryInterface/iTest.repository";
import { ITestCandidateRepository } from "../../../../Domain/repositoryInterface/iTestCandidate.repository";
import { AdminTestActivityInputDTO, AdminTestActivityOutputDTO } from "../../dtos/analytics/admin.testActivity.dto";
import { IAdminGetTestActivityUsecase } from "../../interfaces/analytics/IAdmin.testActivity.usecase";

export class AdminGetTestActivityUsecase implements IAdminGetTestActivityUsecase {
    constructor(
        private _testRepository: ITestRepository,
        private _testCandidateRepository: ITestCandidateRepository
    ) {}

    async execute(request: AdminTestActivityInputDTO): Promise<AdminTestActivityOutputDTO> {
        const startDate = new Date()
        startDate.setMonth(startDate.getMonth() - (request.month -1))
        startDate.setDate(1)
        startDate.setHours(0, 0, 0, 0)
        const map = new Map()

        const candidateTrend = await this._testCandidateRepository.getCandidateActivity(startDate)
        const testTrend = await this._testRepository.getTestActivity(startDate)
        for(let item of candidateTrend){
            map.set(item.month, {
                month: item.month,
                attendedCandidates: item.attendedCandidates ?? 0,
                notAttendedCandidates: item.notAttendedCandidates ?? 0,
                testCount: 0
            })
        }
        for(let item of testTrend){
            if(!map.has(item.month)){
                map.set(item.month, {
                    month: item.month,
                    attendedCandidates: 0,
                    notAttendedCandidates: 0,
                    testCount: item.testTrend
                })
            }else{
                const existing = map.get(item.month)
                map.set(item.month, {
                   ...existing,
                   testCount: item.testTrend
                })
            }
        }
        return {
            activity: Array.from(map.values()).sort((a, b) => a.month.localeCompare(b.month))
        }
       
    }
}