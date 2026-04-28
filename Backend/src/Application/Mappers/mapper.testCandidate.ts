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
            doc.testLink,
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
                    answer.marksObtained
                )
            }),
            doc.aiRank,
            doc.startedAt,
            doc.submittedAt
        )

        return testCandidate
    }

    static toPersistence(entity: TestCandidateEntity) {
        return {
            testId: new Types.ObjectId(entity.testId),
            email: entity.email,
            testLink: entity.testLink,
            candidateTestStatus: entity.candidateTestStatus,
            warningCount: entity.warningCount,
            candidateAnswers: entity.candidateAnswers.map((answer) => ({
                _id: new Types.ObjectId(answer.id),
                testQuestionId: new Types.ObjectId(answer.testQuestionId),
                questionType: answer.questionType,
                timeTakenInSeconds: answer.timeTakenInSeconds,
                selectedOptionIds: answer.selectedOptionIds,
                descriptiveAnswer: answer.descriptiveAnswer,
                codingAnswer: answer.codingAnswer,
                isCorrect: answer.isCorrect,
                marksObtained: answer.marksObtained
            })),
            aiRank: entity.aiRank,
            startedAt: entity.startedAt,
            submittedAt: entity.submittedAt

        }
    }
}