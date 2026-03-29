import { GetDeletedAccountDetailsInputDTO, GetDeletedAccountDetailsOutputDTO } from "../../dtos/settings/deleteAccount.company.dto";

export interface IGetDeletedAccountDetailsUsecase{
    execute(request: GetDeletedAccountDetailsInputDTO): Promise<GetDeletedAccountDetailsOutputDTO>
}