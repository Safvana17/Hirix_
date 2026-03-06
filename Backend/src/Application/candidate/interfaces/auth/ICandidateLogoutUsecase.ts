export interface ICandidateLogoutUsecase {
    execute(refreshToken: string): Promise<void>
}