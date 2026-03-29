import { AppError } from "../../../../Domain/errors/app.error";
import ICompanyRepository from "../../../../Domain/repositoryInterface/iCompany.repository";
import { authMessages } from "../../../../Shared/constsnts/messages/authMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { ITokenService } from "../../../interface/service/ITokenService";
import { GetDeletedAccountDetailsInputDTO, GetDeletedAccountDetailsOutputDTO } from "../../dtos/settings/deleteAccount.company.dto";
import { IGetDeletedAccountDetailsUsecase } from "../../interfaces/settings/iCompany.getDeletedAccountDetails.usecase";

export class GetDeletedAccountDetailsUsecase implements IGetDeletedAccountDetailsUsecase {
    constructor (
        private _companyRepository: ICompanyRepository,
        private _tokenService: ITokenService
    ) {}
    
    async execute(request: GetDeletedAccountDetailsInputDTO): Promise<GetDeletedAccountDetailsOutputDTO> {
        const payload = await this._tokenService.verifyRestoreAccountToken(request.token)
        const company = await this._companyRepository.findByEmail(payload.email)
        if(!company){
            throw new AppError(authMessages.error.COMPANY_NOT_FOUND, statusCode.NOT_FOUND)
        }
        return {
            email: company.getEmail(),
            name: company.getName()
        }
    }
}