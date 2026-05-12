import { QuestionEntity } from "../../../../Domain/entities/Question.entity";
import QuestionType from "../../../../Domain/enums/questionType";
import QuestionVisibility from "../../../../Domain/enums/questionVisibility";
import userRole from "../../../../Domain/enums/userRole.enum";
import { AppError } from "../../../../Domain/errors/app.error";
import { ICategoryRepository } from "../../../../Domain/repositoryInterface/iCategory.repository";
import { IQuestionRepository } from "../../../../Domain/repositoryInterface/iQuestion.repository";
import { questionMessages } from "../../../../Shared/constsnts/messages/questionMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { CandidateSubmitQuestionInputDTO, CandidateSubmitQuestionOutputDTO } from "../../dtos/test/candidate.submitQuestion.dto";
import { ICandidateSubmitQuestionUsecase } from "../../interfaces/test/ICandidate.submitQuestion.usecase";

export class CandidateSubmitQuestionUsecase implements ICandidateSubmitQuestionUsecase {
    constructor(
        private _questionRepository: IQuestionRepository,
        private _categoryRepository: ICategoryRepository
    ) {}

    async execute(request: CandidateSubmitQuestionInputDTO): Promise<CandidateSubmitQuestionOutputDTO> {
        if(request.isPremium){
            throw new AppError(questionMessages.error.COMPANY_CANNOT_CREATE_PREMIUM_QUESTION, statusCode.BAD_REQUEST)
        }

        const existing = await this._questionRepository.findByTitle(request.title)
        if(existing){
            throw new AppError(questionMessages.error.ALREADY_EXIST, statusCode.CONFLICT)
        }

        const categoryExists = await this._categoryRepository.exists(request.categoryId)
        if(!categoryExists){
            throw new AppError(questionMessages.error.CATEGORY_NOT_FOUND, statusCode.NOT_FOUND)
        }

        if(request.type === QuestionType.MCQ){
            if(!request.answer || request.answer.length === 0 ){
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
            const answers = request.answer.map(ans => ans.trim())
            if(answers.length === 0){
                throw new AppError(questionMessages.error.ANSWER_REQUIRED, statusCode.BAD_REQUEST)
            }
            if(answers.some(ans => ans === "")){
                throw new AppError(questionMessages.error.ANSWER_REQUIRED, statusCode.BAD_REQUEST)
            }
            const invalidAnswers = answers.filter(ans => !options.includes(ans))

            if(invalidAnswers.length > 0){
                throw new AppError(questionMessages.error.INCORRECT_ANSWER, statusCode.BAD_REQUEST)
            }
        }

        if(request.type === QuestionType.CODING) {
            if(!request.testCases || request.testCases.length === 0){
                throw new AppError(questionMessages.error.REQUIRED_TEST_CASES, statusCode.BAD_REQUEST)
            }
            request.testCases.forEach(tc => {
                if(!tc.input || !tc.expectedOutput) {
                    throw new AppError(questionMessages.error.INVALID_TESTCASE, statusCode.BAD_REQUEST)
                }
            })
        }

        // let visibility = request.isPremium ? QuestionVisibility.PRO : QuestionVisibility.FREE

        const question = new QuestionEntity(
            "",
            request.title,
            request.description,
            request.type,
            request.difficulty,
            request.categoryId,
            userRole.Candidate,
            QuestionVisibility.FREE,
            request.isPremium,
            true,
            false,
            request.answer,
            request.options,
            request.testCases
        )

        await this._questionRepository.create(question)
        return {
            success: true
        }
    }
}