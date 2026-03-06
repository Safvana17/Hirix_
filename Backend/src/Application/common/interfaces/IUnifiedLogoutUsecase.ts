export interface IUnifiedLogoutUsecase {
    execute(refreshToken: string): Promise<void>
}