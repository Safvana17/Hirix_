import { SendRestoreAccountEmailInputDTO, SendRestoreAccountEmailOutputDTO } from "../../dtos/settings/deleteAccount.company.dto";

export interface ISendRestoreAccountEmailUsecase {
    execute(request: SendRestoreAccountEmailInputDTO): Promise<SendRestoreAccountEmailOutputDTO>
}