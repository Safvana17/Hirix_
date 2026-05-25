import { Types } from "mongoose";
import { InterviewEntity } from "../../Domain/entities/Interview";
import { IInterview } from "../../Infrastructure/database/Model/Interview";

export class InterviewMapper {
    static mapToEntity(doc: IInterview): InterviewEntity {
        const Interview = new InterviewEntity(
            doc._id.toString(),
            doc.name,
            doc.description,
            doc.interviewerEmail,
            doc.interviewerName,
            doc.candidateEmail,
            doc.candidateName,
            doc.testId.toString(),
            doc.jobRoleId.toString(),
            doc.companyId.toString(),
            doc.round,
            doc.scheduledStartTime,
            doc.scheduledEndTime,
            doc.interviewStatus,
            doc.interviewerToken,
            doc.candidateToken,
            doc.roomId,
            doc.result,
            doc.testCandidateId.toString(),
            doc.feedback
        )
        return Interview
    }

    static mapToPersistance(entity: InterviewEntity) {
        return {
            name: entity.name,
            description: entity.description,
            candidateName: entity.candidateName,
            candidateEmail: entity.candidateEmail,
            testId: new Types.ObjectId(entity.testId),
            jobRoleId: new Types.ObjectId(entity.jobRoleId),
            companyId: new Types.ObjectId(entity.companyId),
            interviewerName: entity.interviewerName,
            interviewerEmail: entity.interviewerEmail,
            scheduledStartTime: entity.scheduledStartTime,
            scheduledEndTime: entity.scheduledEndTime,
            round: entity.round,
            interviewStatus: entity.interviewStatus,
            result: entity.result,
            interviewerToken: entity.interviewerToken,
            candidateToken: entity.candidateToken,
            roomId: entity.roomId,
            testCandidateId: new Types.ObjectId(entity.testCandidateId),
            feedback: entity.feedback
        }
    }
}