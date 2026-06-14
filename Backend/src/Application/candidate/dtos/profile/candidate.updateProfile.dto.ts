import { CandidateType } from "../../../../Domain/enums/candidate"

export interface CandidateUpdateProfileInputDTO {
    candidateId: string
    profilePicture?: string
    canidateType?: CandidateType
    college?: string
    degree?: string
    greduationYear?: number
    company?: string
    designation?: string
    yearsOfExperience?: number
    skills?: string[]
    interestedRoles?: string[]
    linkedinUrl?: string
    githubUrl?: string
    portfolioUrl?: string
}

export interface CandidateUpdateProfileOutputDTO {
    success: boolean
}