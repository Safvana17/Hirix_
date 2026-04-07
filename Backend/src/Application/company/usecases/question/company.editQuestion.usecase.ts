import QuestionType from "../../../../Domain/enums/questionType";
import QuestionVisibility from "../../../../Domain/enums/questionVisibility";
import userRole from "../../../../Domain/enums/userRole.enum";
import { AppError } from "../../../../Domain/errors/app.error";
import { ICategoryRepository } from "../../../../Domain/repositoryInterface/iCategory.repository";
import { IQuestionRepository } from "../../../../Domain/repositoryInterface/iQuestion.repository";
import { questionMessages } from "../../../../Shared/constsnts/messages/questionMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { CompanyEditQuestionInputDTO, CompanyEditQuestionOutputDTO } from "../../dtos/question/company.editQuestion.dto";
import { ICompanyEditQuestionUsecase } from "../../interfaces/question/iCompany.editQuestion.usecase";

export class CompanyEditQuestionUsecase implements ICompanyEditQuestionUsecase {
    constructor (
        private _questionRepository: IQuestionRepository,
        private _categoryRepository: ICategoryRepository
    ) {}

    async execute(request: CompanyEditQuestionInputDTO): Promise<CompanyEditQuestionOutputDTO> {
        const question = await this._questionRepository.findById(request.id)
        if(!question){
            throw new AppError(questionMessages.error.QUESTION_NOT_FOUND, statusCode.NOT_FOUND)
        }

        if(question.createdBy !== userRole.Company){
            throw new AppError(questionMessages.error.COMPANY_CANNOT_EDIT_ADMIN_QUESTIONS, statusCode.BAD_REQUEST)
        }

        const existing = await this._questionRepository.findByTitle(request.title)
        if(existing && existing.id !== request.id){
            throw new AppError(questionMessages.error.ALREADY_EXIST, statusCode.CONFLICT)
        }

        const categoryExists = await this._categoryRepository.exists(request.categoryId)
        if(!categoryExists){
            throw new AppError(questionMessages.error.CATEGORY_NOT_FOUND, statusCode.NOT_FOUND)
        }

        if(request.type === QuestionType.MCQ){
            if(request.answer === undefined || request.answer === null ){
                throw new AppError(questionMessages.error.ANSWER_REQUIRED, statusCode.BAD_REQUEST)
            }
            if(!request.options || request.options.length < 2){
                throw new AppError(questionMessages.error.INSUFFICIENT_OPTIONS, statusCode.BAD_REQUEST)
            }

            const options = request.options.map(opt => opt.trim())
            if(options.some(opt => opt === "")){
                throw new AppError(questionMessages.error.EMPTY_OPTION, statusCode.BAD_REQUEST)
            }

            const uniqueOptions = new Set(options)
            if(uniqueOptions.size !== options.length){
                throw new AppError(questionMessages.error.DUPLICATE_OPTION, statusCode.BAD_REQUEST)
            }

            if(!request.options.includes(request.answer)){
                throw new AppError(questionMessages.error.INCORRECT_ANSWER, statusCode.BAD_REQUEST)
            }
            question.testCases = undefined
        }

        if(request.type === QuestionType.CODING) {
            if(!request.testCases || request.testCases.length === 0){
                throw new AppError(questionMessages.error.REQUIRED_TEST_CASES, statusCode.BAD_REQUEST)
            }
            request.testCases.forEach(tc => {
                if(tc.input === undefined || tc.expectedOutput === undefined) {
                    throw new AppError(questionMessages.error.INVALID_TESTCASE, statusCode.BAD_REQUEST)
                }
            })
            question.answer = undefined
            question.options = undefined
        }

        if(request.isPremium){
            throw new AppError(questionMessages.error.COMPANY_CANNOT_CREATE_PREMIUM_QUESTION, statusCode.BAD_REQUEST)
        }

        
        question.title = request.title
        question.description = request.description
        question.type = request.type
        question.difficulty = request.difficulty
        question.categoryId = request.categoryId
        question.visibility = QuestionVisibility.FREE
        question.isPremium = request.isPremium
        question.isPractice = request.isPractice
        question.answer = request.answer
        question.options = request.options
        question.testCases = request.testCases


        const updatedQuestion = await this._questionRepository.update(question.id, question)
        if(!updatedQuestion){
            throw new AppError(questionMessages.error.EDIT_QUESTION_FAILED, statusCode.SERVER_ERROR)
        }
        return{
            id: updatedQuestion.id
        }
    }
}