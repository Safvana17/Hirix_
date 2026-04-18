import { ResetPasswordInputDTO, ResetPasswordOutputDTO } from "../../dtos/auth/resetpassword.candidate.dto";

export interface IResetPasswordUsecase {
    execute(request: ResetPasswordInputDTO): Promise<ResetPasswordOutputDTO>
    
}