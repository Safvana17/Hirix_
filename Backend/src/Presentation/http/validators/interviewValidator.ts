import z from "zod";
import { InterviewStatus } from "../../../Domain/enums/interview";

export const ScheduleInterviewSchema = z.object({
    testId: z.string().regex(/^[0-9a-fA-F]{24}$/),
    jobRoleId: z.string().regex(/^[0-9a-fA-F]{24}$/),
    testCandidateId: z.string().regex(/^[0-9a-fA-F]{24}$/),
    interviewerName: z.string().min(1, 'Interviwer name is required'),
    interviewerEmail: z.string().email().min(1, 'Interviewer email is required'),
    candidateName: z.string().min(1, 'Candidate name is required'),
    candidateEmail: z.string().email().min(1, 'Candidate email is required'),
    startTime: z.coerce.date(),
    endTime: z.coerce.date(),
    name: z.string().min(1, 'Name is required'),
    description: z.string().min(1, 'description is required'),
    round: z.coerce.number()
})

export const CompanyGetAllInterviewSchema = z.object({
  search: z.string().optional(),
  status: z.enum(InterviewStatus).optional(),
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(10)
})
export type GetAllInterviewQuery = z.infer<typeof CompanyGetAllInterviewSchema>

export const InterviewParamsSchema = z.object({
  interviewId: z.string().regex(/^[0-9a-fA-F]{24}$/),
})
export type InterviewParams = z.infer<typeof InterviewParamsSchema>

export const CancelInterviewSchema = z.object({
  reason: z.string()
})

export const RescheduleInterviewSchema = z.object({
    startTime: z.coerce.date(),
    endTime: z.coerce.date(),
})

export const EditInterviewSchema = z.object({
    interviewerName: z.string().min(1, 'Interviwer name is required'),
    interviewerEmail: z.string().email().min(1, 'Interviewer email is required'),
    candidateName: z.string().min(1, 'Candidate name is required'),
    candidateEmail: z.string().email().min(1, 'Candidate email is required'),
    name: z.string().min(1, 'Name is required'),
    description: z.string().min(1, 'description is required'),
})