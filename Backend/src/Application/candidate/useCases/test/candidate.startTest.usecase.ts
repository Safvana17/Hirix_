import { OptionOrder } from "../../../../Domain/entities/TestCandidate.entity";
import QuestionType from "../../../../Domain/enums/questionType";
import { CandidateTestStatus } from "../../../../Domain/enums/Test";
import { AppError } from "../../../../Domain/errors/app.error";
import ICompanyRepository from "../../../../Domain/repositoryInterface/iCompany.repository";
import { IJobRepository } from "../../../../Domain/repositoryInterface/iJobRoles.repository";
import { ITestRepository } from "../../../../Domain/repositoryInterface/iTest.repository";
import { ITestCandidateRepository } from "../../../../Domain/repositoryInterface/iTestCandidate.repository";
import { shuffleArray } from "../../../../Presentation/http/utils/shuffleOrder";
import { JobRoleMessages } from "../../../../Shared/constsnts/messages/jobRolesMessages";
import { TestMessages } from "../../../../Shared/constsnts/messages/testMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { CandidateStartTestInputDTO, CandidateStartTestOutputDTO } from "../../dtos/test/candidate.startTest.dto";
import { ICandidateStartTestUsecase } from "../../interfaces/test/ICandidate.startTest.usecase";

export class CandidateStartTestUsecase implements ICandidateStartTestUsecase{
    constructor(
        private _testCandidateRepository: ITestCandidateRepository,
        private _testRepository: ITestRepository,
        private _companyRepository: ICompanyRepository,
        private _jobRoleRepository: IJobRepository
    ) {}

    async execute(request: CandidateStartTestInputDTO): Promise<CandidateStartTestOutputDTO> {
        const candidate = await this._testCandidateRepository.findByToken(request.token)
        if(!candidate){
            throw new AppError(TestMessages.error.CANDIDATE_NOT_FOUND, statusCode.NOT_FOUND)
        }
        if(!request.clientSessionToken){
            throw new AppError(TestMessages.error.UNAUTHORIZED, statusCode.UNAUTHORIZED)
        }
        if(candidate.sessionToken !== request.clientSessionToken){
            throw new AppError(TestMessages.error.SESSION_TOKEN_MISMATCHING, statusCode.FORBIDDEN)
        }
        
        if(!candidate.canStart()){
            throw new AppError(TestMessages.error.TEST_HAS_ALREADY_STARTED, statusCode.FORBIDDEN)
        }
        
        const test = await this._testRepository.findById(candidate.testId)
        if(!test){
            throw new AppError(TestMessages.error.TEST_NOT_FOUND, statusCode.NOT_FOUND)
        }

        const company = await this._companyRepository.findById(test.companyId)
        if(!company){
            throw new AppError(TestMessages.error.COMPANY_NOT_FOUND, statusCode.NOT_FOUND)
        }
        const jobRole = await this._jobRoleRepository.findById(test.jobRoleId)
        if(!jobRole){
            throw new AppError(JobRoleMessages.error.JOBROLE_NOT_FOUND, statusCode.NOT_FOUND)
        }

        const baseQuestionOrder = [...test.questions].sort((a, b) => a.order - b.order).map((q) => q.id)
        const questionOrder = candidate.questionOrder?.length
        ? candidate.questionOrder
        :test.rules.navigation.shuffleQuestions 
           ? shuffleArray(baseQuestionOrder) 
           : baseQuestionOrder

        const optionOrder: OptionOrder[] = candidate.mcqOptionsOrder ?? []
        if(!optionOrder.length && test.rules.navigation.shuffleOptions) {
            for(const q of test.questions){
                if(q.type === QuestionType.MCQ && q.options?.length) {
                    optionOrder.push({
                        questionId: q.id,
                        order: shuffleArray(q.options.map((_, i) => i))
                    })
                }
            }
        }
        candidate.questionOrder = questionOrder
        candidate.mcqOptionsOrder = optionOrder
        candidate.candidateTestStatus = CandidateTestStatus.IN_PROGRESS
        if(!candidate.startedAt )
            candidate.startedAt = new Date()

        await this._testCandidateRepository.update(candidate.id, candidate)
        const orderedQuestions = candidate.questionOrder.map((questionId) => {
            const question = test.questions.find(
            (q) => q.id === questionId
            )!

            if (question.type !== QuestionType.MCQ) {
            return question
            }

            const optionOrder =
            candidate.mcqOptionsOrder?.find(
                (o) => o.questionId === question.id
            )

            if (!optionOrder) {
            return question
            }

            return {
            ...question,
            options: optionOrder.order
                .map((index) => question.options![index])!
                .filter(Boolean)
            }
        })
        return {
            test: {
                id: test.id,
                name: test.name,
                description: test.description,
                startTime: test.startTime,
                endTime: test.endTime,
                companyName: company.getName(),
                jobrole: jobRole.name,
                questions: orderedQuestions,
                rules: test.rules,
                testStatus: test.testStatus
            },
            candidate
        }
    }
}