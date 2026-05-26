import z from "zod";

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