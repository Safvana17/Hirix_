import { ForgotPasswordInputDTO, ForgotPasswordOutputDTO } from "../../dtos/forgotpassword.candidate.dto";

export interface IForgotPasswordUsecase {
    execute(request: ForgotPasswordInputDTO): Promise<ForgotPasswordOutputDTO>
}