import { NotificationEvents } from "../../../../Domain/enums/notification";
import { TestStatus } from "../../../../Domain/enums/Test";
import userRole from "../../../../Domain/enums/userRole.enum";
import { AppError } from "../../../../Domain/errors/app.error";
import ICompanyRepository from "../../../../Domain/repositoryInterface/iCompany.repository";
import { ITestRepository } from "../../../../Domain/repositoryInterface/iTest.repository";
import { ITestCandidateRepository } from "../../../../Domain/repositoryInterface/iTestCandidate.repository";
import { authMessages } from "../../../../Shared/constsnts/messages/authMessages";
import { TestMessages } from "../../../../Shared/constsnts/messages/testMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { IAdminProcessNotificationUsecase } from "../../../admin/interfaces/settings/IAdmin.processNotification.usecase";
import { CompanyResheduleTestInputDTO, CompanyResheduleTestOutputDTO } from "../../dtos/test/company.resheduleTest.dto";
import { ICompanyResheduleTestUsecase } from "../../interfaces/test/ICompany.resheduleTest.usecase";

export class CompanyResheduleTestUsecase implements ICompanyResheduleTestUsecase {
    constructor(
        private _testRepository :ITestRepository,
        private _testCandidateRepository: ITestCandidateRepository,
        private _companyRepository: ICompanyRepository,
        private _processNotificationUsecase: IAdminProcessNotificationUsecase
    ) {}

    async execute(request: CompanyResheduleTestInputDTO): Promise<CompanyResheduleTestOutputDTO> {
        const company = await this._companyRepository.findById(request.companyId)
        if(!company){
            throw new AppError(authMessages.error.COMPANY_NOT_FOUND, statusCode.NOT_FOUND)
        }

        const test = await this._testRepository.findById(request.testId)
        if(!test){
            throw new AppError(TestMessages.error.TEST_NOT_FOUND, statusCode.NOT_FOUND)
        }

        if(test.companyId !== company.id) {
            throw new AppError(TestMessages.error.NOT_ALLOWED, statusCode.FORBIDDEN)
        }

        if(test.testStatus !== TestStatus.PUBLISHED){
            throw new AppError(TestMessages.error.CANNOT_CANCEL, statusCode.BAD_REQUEST)
        }

        const candidates = await this._testCandidateRepository.findByTestId(request.testId)
        if(!candidates || candidates.length === 0){
            throw new AppError(TestMessages.error.CANDIDATES_REQUIRED, statusCode.BAD_REQUEST)
        }

        if(request.startTime >= request.endTime) {
            throw new AppError(TestMessages.error.INVALID_END_TIME, statusCode.BAD_REQUEST)
        }

        if(request.startTime.getTime() <= Date.now()){
            throw new AppError(TestMessages.error.TEST_STARTED, statusCode.BAD_REQUEST)
        }

        test.startTime = request.startTime
        test.endTime = request.endTime
        await this._testRepository.update(test.id, test)
        await Promise.all(
            candidates.map (async (candidate) => {
               return this._processNotificationUsecase.execute({
                event: NotificationEvents.RESCHEDULE_TEST,
                recipients: [{
                    recipientType: userRole.Candidate,
                    recipientId: candidate.id,
                    email: candidate.email
                }],
                variables: {
                    platformName: 'Hirix',
                    companyName: company.getName(),
                    testName: test.name,
                    startTime: request.startTime.toLocaleString(),
                    endTime: request.endTime.toLocaleString()
                }
               })
            })
        )
        return {
            success: true
        }
    }
}