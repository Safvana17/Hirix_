import { ConfirmRestoreAccountInputDto, ConfirmRestoreAccountOutputDto } from "../../dtos/settings/deleteAccount.company.dto";

export interface IConfirmRestoreAccountUsecase {
    execute(request: ConfirmRestoreAccountInputDto): Promise<ConfirmRestoreAccountOutputDto>
}