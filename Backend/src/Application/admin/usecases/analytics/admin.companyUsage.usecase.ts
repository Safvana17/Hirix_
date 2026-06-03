import { IInterviewRepository } from "../../../../Domain/repositoryInterface/iInterview.repository";
import { ITestRepository } from "../../../../Domain/repositoryInterface/iTest.repository";
import { AdminCompanyUsegaeOutputDTO } from "../../dtos/analytics/admin.CompanyUsage.dto";
import { IAdminCompanyUsageUsecase } from "../../interfaces/analytics/IAdmin.companyUsage.usecase";

export class AdminCompanyUsageUsecase implements IAdminCompanyUsageUsecase{
    constructor (
        private _testRepository: ITestRepository,
        private _interviewRepository: IInterviewRepository
    ) {}
    async execute(): Promise<AdminCompanyUsegaeOutputDTO> {
        const totalInterviews  = await this._interviewRepository.getInterviewUsage()
        const totalTests = await this._testRepository.getTestUsage()

        const map = new Map()
        for(let interview of totalInterviews){
            map.set(interview.company, {
                company: interview.company,
                totalInterviews: interview.count,
                totalTests: 0
            })
        }
        for(let test of totalTests){
            if(!map.has(test.company)) {
                map.set(test.company, {
                    company: test.company,
                    totalTests: test.count,
                    totalInterviews: 0
                })
            }else{
                const existing = map.get(test.company)
                map.set(test.company, {
                    ...existing,
                    totalTests: test.count
                })
            }
        }
        return {
            usage: Array.from(map.values())
        }
    }
}