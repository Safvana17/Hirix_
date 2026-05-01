import { TestStatus } from "../../../../Domain/enums/Test";
import { AppError } from "../../../../Domain/errors/app.error";
import ICompanyRepository from "../../../../Domain/repositoryInterface/iCompany.repository";
import { ITestRepository } from "../../../../Domain/repositoryInterface/iTest.repository";
import { authMessages } from "../../../../Shared/constsnts/messages/authMessages";
import { TestMessages } from "../../../../Shared/constsnts/messages/testMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { CompanyDeleteTestInputDTO, CompanyDeleteTestOutputDTO } from "../../dtos/test/company.deleteTest.dto";
import { ICompanyDeleteTestUsecase } from "../../interfaces/test/ICompany.deleteTest.usecase";

export class CompanyDeleteTestUsecase implements ICompanyDeleteTestUsecase {
    constructor(
        private _testRepository: ITestRepository,
        private _companyRepository: ICompanyRepository
    ) {}

    async execute(request: CompanyDeleteTestInputDTO): Promise<CompanyDeleteTestOutputDTO> {
        const comapny = await this._companyRepository.findById(request.companyId)
        if(!comapny){
            throw new AppError(authMessages.error.COMPANY_NOT_FOUND, statusCode.NOT_FOUND)
        }
        const test = await this._testRepository.findById(request.testId)
        if(!test){
            throw new AppError(TestMessages.error.TEST_NOT_FOUND, statusCode.NOT_FOUND)
        }
        if(test.testStatus !== TestStatus.DRAFT){
            throw new AppError(TestMessages.error.CANNOT_DELETE, statusCode.BAD_REQUEST)
        }
        test.testStatus = TestStatus.DELETED
        test.isDeleted = true
        await this._testRepository.update(test.id, test)

        return {
            id: test.id
        }
    }
}