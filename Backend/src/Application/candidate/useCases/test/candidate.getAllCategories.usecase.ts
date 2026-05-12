import { AppError } from "../../../../Domain/errors/app.error";
import { ICategoryRepository } from "../../../../Domain/repositoryInterface/iCategory.repository";
import { ITestCandidateRepository } from "../../../../Domain/repositoryInterface/iTestCandidate.repository";
import { TestMessages } from "../../../../Shared/constsnts/messages/testMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { CandidateGetAllCategoriesInputDTO, CandidateGetAllCategoriesOutputDTO } from "../../dtos/test/candidate.getAllCategories.dto";
import { ICandidateGetAllCategoriesUsecase } from "../../interfaces/test/ICandidate.getAllCategories.usecase";

export class CandidateGetAllCategoriesUsecase implements ICandidateGetAllCategoriesUsecase {
    constructor (
        private _testCandidateRepository: ITestCandidateRepository,
        private _categoryRepository: ICategoryRepository
    ) {}

    async execute(request: CandidateGetAllCategoriesInputDTO): Promise<CandidateGetAllCategoriesOutputDTO> {
        const candidate = await this._testCandidateRepository.findByToken(request.token)
        if(!candidate){
            throw new AppError(TestMessages.error.CANDIDATE_NOT_FOUND, statusCode.NOT_FOUND)
        }

        const categories = await this._categoryRepository.findAll()
        return {
            categories
        }
    }
}