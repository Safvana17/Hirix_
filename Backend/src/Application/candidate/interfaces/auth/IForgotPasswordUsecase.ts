import { ForgotPasswordInputDTO, ForgotPasswordOutputDTO } from "../../dtos/auth/forgotpassword.candidate.dto";

export interface IForgotPasswordUsecase {
    execute(request: ForgotPasswordInputDTO): Promise<ForgotPasswordOutputDTO>
}