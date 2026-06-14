import { CandidateType } from "../../../../Domain/enums/candidate"

export interface CandidateGetProfileInputDTO {
    candidateId: string
}

export interface CandidateGetProfileOutputDTO {
    id: string
    name: string
    email: string
    profilePicture?: string
    candidateType?: CandidateType
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