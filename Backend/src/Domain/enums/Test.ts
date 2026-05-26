import QuestionType from "./questionType"

export enum TestStatus {
    DRAFT = 'DRAFT',
    PUBLISHED = 'PUBLISHED',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
    DELETED = 'DELETED'
}

export enum QuestionSource {
    ADMIN_LIBRARY = 'ADMIN_LIBRARY',
    COMPANY_LIBRARY = 'COMPANY_LIBRARY',
    TEST_ONLY = 'TEST_ONLY'
}

export enum ValuationStatus {
    NOT_EVALUATED = "NOT_EVALUATED",
    EVALUATED = "EVALUATED",
    FAILED = "FAILED"
}

export enum CandidateTestStatus {
   DRAFT = 'DRAFT',
   VERIFIED = 'VERIFIED',
   INVITED = 'INVITED',
   IN_PROGRESS = 'IN_PROGRESS',
   SUBMITTED = 'SUBMITTED',
   EXPIRED = 'EXPIRED',
   TERMINATED = 'TERMINATED',
   REMOVED = 'REMOVED',
//    SHORTLISTED = 'SHORTLISTED',
//    REJECTED = 'REJECTED',
   RESCHEDULED = 'RESCHEDULED',
}

export enum CandidatePipelineStatus {
    PENDING = 'PENDING',
    SHORTLISTED = 'SHORTLISTED',
    TEST_REJECTED = 'TEST_REJECTED', 
    INTERVIEW_SCHEDULED = 'INTERVIEW_SCHEDULED',
    INTERVIEW_SELECTED = 'INTERVIEW_SELECTED',
    INTERVIEW_REJECTED = 'INTERVIEW_REJECTED',
    OFFER_SENT = 'OFFER_SENT',   
}

export enum CodingLanguage {
    JAVASCRIPT = 'javascript',
    PYTHON = 'python'
}

export const QuestionMarks: Record<QuestionType, number> = {
    [QuestionType.MCQ]: 2,
    [QuestionType.CODING]: 5,
    [QuestionType.DESCRIPTIVE]: 5,
}

export type ViolationType =
    | 'TAB_SWITCH'
    | 'FULLSCREEN_EXIT'
    | 'COPY_PASTE'
    | 'RIGHT_CLICK'
    | 'KEYBOARD_SHORTCUT'
    | 'NO_FACE'
    | 'MULTIPLE_FACE'