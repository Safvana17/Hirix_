export const ROLES = {
    ADMIN: 'Admin',
    CANDIDATE: 'Candidate',
    COMPANY: 'Company'
}

export type UserRole = typeof ROLES[keyof typeof ROLES]