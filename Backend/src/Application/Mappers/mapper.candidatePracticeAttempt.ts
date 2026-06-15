import { Types } from "mongoose";
import { CandidatePracticeAttemptEntity } from "../../Domain/entities/CandidatePracticeAttempt.entity";
import { ICandidatePracticeAttempt } from "../../Infrastructure/database/Model/CandidatePracticeAttempt";

export class CandidatePracticeAttemptMapper {
    static mapToEntity(doc: ICandidatePracticeAttempt): CandidatePracticeAttemptEntity {
        const attempt = new CandidatePracticeAttemptEntity (
            doc._id.toString(),
            doc.candidateId.toString(),
            doc.questionId.toString(),
            doc.isCorrect
        )
        return attempt
    }

    static mapToPersistence(entity: CandidatePracticeAttemptEntity){
        return {
            candidateId: new Types.ObjectId(entity.candidateId),
            questionId: new Types.ObjectId(entity.questionId),
            isCorrect: entity.isCorrect
        }
    }
}