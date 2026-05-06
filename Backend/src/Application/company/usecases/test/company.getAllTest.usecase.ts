import { AppError } from "../../../../Domain/errors/app.error";
import ICompanyRepository from "../../../../Domain/repositoryInterface/iCompany.repository";
import { ISubscriptionRepository } from "../../../../Domain/repositoryInterface/iSubscription.repository";
import { ISubscriptionPlanRepository } from "../../../../Domain/repositoryInterface/iSubscriptionPlan.repository";
import { ITestRepository } from "../../../../Domain/repositoryInterface/iTest.repository";
import { ITestCandidateRepository } from "../../../../Domain/repositoryInterface/iTestCandidate.repository";
import { authMessages } from "../../../../Shared/constsnts/messages/authMessages";
import { subscriptionPlanMessages } from "../../../../Shared/constsnts/messages/subscriptionPlanMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { CompanyGetAllTestInputDTO, CompanyGetAllTestOututDTO } from "../../dtos/test/company.getAllTest.dto";
import { ICompanyGetAllTestUsecase } from "../../interfaces/test/ICompany.getAllTest.usecase";

export class CompanyGetAllTestUsecase implements ICompanyGetAllTestUsecase {
    constructor(
        private _testRepository: ITestRepository,
        private _companyRepository: ICompanyRepository,
        private _testCandidateRepository: ITestCandidateRepository,
        private _subscriptionRepository: ISubscriptionRepository,
        private _subscriptionPlanRepository: ISubscriptionPlanRepository
    ) {}

    async execute(request: CompanyGetAllTestInputDTO): Promise<CompanyGetAllTestOututDTO> {
        const company = await this._companyRepository.findById(request.companyId)
        if(!company){
            throw new AppError(authMessages.error.COMPANY_NOT_FOUND, statusCode.NOT_FOUND)
        }

        const currentSubscription = await this._subscriptionRepository.findCurrentByUserId(company.id)
        if(!currentSubscription){
            throw new AppError(subscriptionPlanMessages.error.CANNOT_FIND_SUBCRIPTION_DETAILS, statusCode.NOT_FOUND)
        }

        const plan = await this._subscriptionPlanRepository.findById(currentSubscription.planId)
        if(!plan){
            throw new AppError(subscriptionPlanMessages.error.NOT_FOUND, statusCode.NOT_FOUND)
        }

        const now = new Date()
        const testLimit = plan.maxTestsPerMonth
        let isLocked = false
        if(testLimit != null){
            const startOfMonth = new Date( now.getFullYear() ,now.getMonth(), 1)
            const endOfMonth = new Date(now.getFullYear(), now.getMonth()+1, 0, 23, 59, 59)
            const currentCount = await this._testRepository.CountTestInMonth(company.id, startOfMonth, endOfMonth)
            isLocked = currentCount >= testLimit
        }
        const { data, totalPages, totalCount } = await this._testRepository.findAllFiltered(request)
        const tests = await Promise.all(
            data.map(async (d) => ({
                id: d.id,
                name: d.name,
                jobRole: d.jobRole.name,
                startTime: d.startTime,
                endTime: d.endTime,
                durationInMinutes: Math.round((d.endTime.getTime() - d.startTime.getTime()) / 60000 ),
                testStatus: d.testStatus,
                candidatesCount: await this._testCandidateRepository.countByTestIds(d.id),
                isDeleted: d.isDeleted
            }))
        )
        return{
            tests,
            totalCount,
            totalPages,
            featureLocked: isLocked
        }
    }
}