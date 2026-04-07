export interface IUnifiedLogoutUsecase {
    execute(refreshToken: string, accessToken: string): Promise<void>
}