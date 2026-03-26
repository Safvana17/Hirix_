import { AppError } from "../../../../Domain/errors/app.error";
import ICompanyRepository from "../../../../Domain/repositoryInterface/iCompany.repository";
import { authMessages } from "../../../../Shared/constsnts/messages/authMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { ITokenService } from "../../../interface/service/ITokenService";
import { VerifyCompanyInputDTO, VerifyCompanyOutputDTO } from "../../dtos/auth/verifyRegister.company.dto";
import { IVerifyRegisterCompanyUsecase } from "../../interfaces/auth/ICompanyVerifyRegisterUsecase";

export class VerifyRegisterCompanyUsecase implements IVerifyRegisterCompanyUsecase{
     constructor(
        private _companyRepository: ICompanyRepository,
        private _tokenService: ITokenService
     ) {}

     async execute(request: VerifyCompanyInputDTO): Promise<VerifyCompanyOutputDTO> {

        const payload = this._tokenService.verifyAccessToken(request.token)
        const company = await this._companyRepository.findById(payload.id)

        if(!company || !company.id){
            throw new AppError(authMessages.error.COMPANY_NOT_FOUND, statusCode.NOT_FOUND)
        }

        if(company.isUserVerified()){
            throw new AppError(authMessages.error.CONFLICT, statusCode.CONFLICT)
        }

        const id = company.id

        company.markAsVerified()
        await this._companyRepository.update(id, company)

        return {
            company: {
                id: id,
                name: company.getName(),
                email: company.getEmail(),
                role: company.getRole()
            }
        }
     }
}