import { ResetPasswordInputDTO, ResetPasswordOutputDTO } from "../../dtos/resetpassword.candidate.dto";

export interface IResetPasswordUsecase {
    execute(request: ResetPasswordInputDTO): Promise<ResetPasswordOutputDTO>
    
}