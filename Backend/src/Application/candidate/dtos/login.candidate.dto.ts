import userRole from "../../../Domain/enums/userRole.enum"

export interface LoginCandidateInputDTO { 
    email: string
    password: string
}

export interface LoginCandidateOutputDTO {
    accessToken: string
    refreshToken: string
    csrfToken: string
    candidate: {
        id: string
        email: string
        name: string
        role: userRole
    }
}

export interface GoogleAuthDTO {
    isVerified: boolean;
    googleId: string;
    email: string;
    name: string
}