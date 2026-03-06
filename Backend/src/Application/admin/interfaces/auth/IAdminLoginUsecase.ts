import { LoginAdminInputDto, LoginAdminOutputDTO } from "../../dtos/auth/login.admin.dto";

export interface IAdminLoginUsecase{
    execute(request: LoginAdminInputDto): Promise<LoginAdminOutputDTO>
}