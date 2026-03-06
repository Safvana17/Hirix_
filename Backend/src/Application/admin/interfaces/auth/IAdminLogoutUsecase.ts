
export interface IAdminLogoutUsecase {
    execute(refreshToken: string): Promise<void>
}