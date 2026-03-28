import { DeleteAccountInputDTO, DeleteAccountOutputDTO } from "../../dtos/settings/deleteAccount.company.dto";

export interface IDeleteAccountUsecase{
    execute(request: DeleteAccountInputDTO): Promise<DeleteAccountOutputDTO>
}