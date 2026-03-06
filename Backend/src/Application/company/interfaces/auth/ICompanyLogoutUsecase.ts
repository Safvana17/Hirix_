export interface ICompanyLogoutUsecase {
    execute(refreshToken: string): Promise<void>
}