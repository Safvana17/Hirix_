import { Types } from "mongoose";
import { CandidateAnswerEntity } from "../../Domain/entities/CandidateAnswer.entity";
import { TestCandidateEntity } from "../../Domain/entities/TestCandidate.entity";
import { ITestCandidate } from "../../Infrastructure/database/Model/TestCandidate";

export class TestCandidateMapper {
    static toEntity(doc: ITestCandidate): TestCandidateEntity{
        const testCandidate = new TestCandidateEntity(
            doc._id.toString(),
            doc.testId.toString(),
            doc.email,
            doc.testToken,
            doc.candidateTestStatus,
            doc.warningCount,
            doc.candidateAnswers.map((answer) => {
                return new CandidateAnswerEntity(
                    answer._id.toString(),
                    answer.testQuestionId.toString(),
                    answer.questionType,
                    answer.timeTakenInSeconds,
                    answer.selectedOptionIds,
                    answer.descriptiveAnswer,
                    answer.codingAnswer,
                    answer.isCorrect,
                    answer.marksObtained,
                    answer.totalMarks,
                    answer.evaluationStatus,
                    answer.aiFeedback
                )
            }),
            doc.totalMarks,
            doc.totalQuestionsCount,
            doc.aiRank,
            doc.marksObtained,
            doc.correctAnswerCount,
            doc.selectionStatus,
            doc.evaluationStatus,
            doc.totalTimeTakenInSeconds,
            doc.startedAt,
            doc.submittedAt,
            doc.evaluatedAt
        )
        testCandidate.name = doc.name
        testCandidate.currentInterviewRound = doc.currentInterviewRound
        testCandidate.lastInterviewId = doc.lastInterviewId ?  doc.lastInterviewId.toString() : undefined
        testCandidate.snapshots = doc.snapshots
        testCandidate.mcqOptionsOrder = doc.mcqOptionOrder.map((option) => ({
            questionId: option.questionId.toString(),
            order: option.order
        }))
        testCandidate.questionOrder = doc.questionOrder
        testCandidate.sessionToken = doc.sessionToken

        return testCandidate
    }

    static toPersistence(entity: TestCandidateEntity) {
        return {
            testId: new Types.ObjectId(entity.testId),
            email: entity.email,
            testToken: entity.testToken,
            candidateTestStatus: entity.candidateTestStatus,
            selectionStatus: entity.selectionStatus,
            evaluationStatus: entity.evaluationStatus,
            warningCount: entity.warningCount,
            candidateAnswers: entity.candidateAnswers.map((answer) => ({
                _id: Types.ObjectId.isValid(answer.id)
                   ? new Types.ObjectId(answer.id)
                   : new Types.ObjectId(),
                testQuestionId: new Types.ObjectId(answer.testQuestionId),
                questionType: answer.questionType,
                timeTakenInSeconds: answer.timeTakenInSeconds,
                selectedOptionIds: answer.selectedOptionIds,
                descriptiveAnswer: answer.descriptiveAnswer,
                codingAnswer: answer.codingAnswer,
                isCorrect: answer.isCorrect,
                marksObtained: answer.marksObtained,
                totalMarks: answer.totalMarks,
                evaluationStatus: answer.evaluationStatus,
                aiFeedback: answer.aiFeedback
            })),
            aiRank: entity.aiRank,
            totalMarks: entity.totalMarks,
            marksObtained: entity.marksObtained,
            correctAnswerCount: entity.correctAnswerCount,
            totalQuestionsCount: entity.totalQuestionsCount,
            name: entity.name,
            totalTimeTakenInSeconds: entity.totalTimeTakenInSeconds,
            startedAt: entity.startedAt,
            submittedAt: entity.submittedAt,
            evaluatedAt: entity.evaluatedAt,
            currentInterviewRound: entity.currentInterviewRound,
            lastInterviewId: entity.lastInterviewId ? new Types.ObjectId(entity.lastInterviewId) : undefined,
            questionOrder: entity.questionOrder,
            snapshots: entity.snapshots,
            mcqOptionOrder: entity.mcqOptionsOrder?.map((option) => ({
                questionId: new Types.ObjectId(option.questionId),
                order: option.order
            })),
            sessionToken: entity.sessionToken

        }
    }
}