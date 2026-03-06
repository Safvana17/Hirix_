import { AppError } from "../../../Domain/errors/app.error";
import ICompanyRepository from "../../../Domain/repositoryInterface/iCompany.repository";
import { authMessages } from "../../../Shared/constsnts/messages/authMessages";
import { statusCode } from "../../../Shared/Enumes/statusCode";
import { IHashService } from "../../interface/service/IHashService";
import { ITokenService } from "../../interface/service/ITokenService";
import { LoginCompanyInputDTO, LoginCompanyOutputDTO } from "../dtos/login.company.dto";
import { ILoginCompanyUsecase } from "../interfaces/auth/ILoginCompanyUsecase";

export class LoginCompanyUsecase implements ILoginCompanyUsecase{
    constructor(
        private _companyRepository: ICompanyRepository,
        private _tokenService: ITokenService,
        private _hashService: IHashService
    ) {}

    async execute(request: LoginCompanyInputDTO): Promise<LoginCompanyOutputDTO> {
        const company = await this._companyRepository.findByEmail(request.email)
        if(!company){
            throw new AppError(authMessages.error.COMPANY_NOT_FOUND, statusCode.NOT_FOUND)
        }

        const isValidPassword = await this._hashService.compare(request.password, company.getPassword())
        if(!isValidPassword){
            throw new AppError(authMessages.error.INVALID_PASSWORD, statusCode.BAD_REQUEST)
        }

        const id = company.id
        if(!id){
            throw new AppError(authMessages.error.COMPANY_ID_NOT_FOUND, statusCode.NOT_FOUND)
        }

        const refreshToken =  this._tokenService.generateRefreshToken({id: id, role: company.getRole()})
        const accessToken = this._tokenService.generateAccessToken({id: id, email: company.getEmail(), role: company.getRole()})

        const hashedRefreshToken = this._hashService.hashToken(refreshToken)
        await this._companyRepository.updateToken(id, hashedRefreshToken)

        return {
            accessToken,
            refreshToken,
            company: {
                id: id,
                name: company.getName(),
                email: company.getEmail(),
                role: company.getRole()
            }
        }
    }
}