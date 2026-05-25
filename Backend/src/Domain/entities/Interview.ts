import { InterviewResult, InterviewStatus } from "../enums/interview"

export class InterviewEntity {
    id: string
    name: string
    description: string
    testCandidateId?: string
    candidateName: string
    candidateEmail: string
    interviewerName: string
    interviewerEmail: string
    testId: string
    jobRoleId: string
    companyId: string
    round: number
    scheduledStartTime: Date
    scheduledEndTime: Date
    interviewStatus: InterviewStatus
    result?: InterviewResult
    feedback?: string
    candidateToken: string
    interviewerToken: string
    roomId: string

    constructor (
        id: string,
        name: string,
        description: string,
        interviewerEmail: string,
        interviewerName: string,
        candidateEmail: string,
        candidateName: string,
        testId: string,
        jobRoleId: string,
        companyId: string,
        round: number,
        scheduledStartTime: Date,
        scheduledEndTime: Date,
        interviewStatus: InterviewStatus,
        interviewerToken: string,
        candidateToken: string,
        roomId: string,
        result: InterviewResult,
        testCandidateId?: string,
        feedback?: string
    ) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.candidateName = candidateName;
        this.candidateEmail = candidateEmail;
        this.testId = testId;
        this.jobRoleId = jobRoleId;
        this.companyId = companyId;
        this.round = round;
        this.interviewerName = interviewerName;
        this.interviewerEmail = interviewerEmail;
        this.interviewerToken = interviewerToken;
        this.scheduledStartTime = scheduledStartTime;
        this.scheduledEndTime = scheduledEndTime;
        this.interviewStatus = interviewStatus;
        this.result = result;
        this.candidateToken = candidateToken;
        this.roomId = roomId;
        this.testCandidateId = testCandidateId;
        this.feedback = feedback
    }
}