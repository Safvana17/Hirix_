import { AppError } from "../../../../Domain/errors/app.error";
import IAdminRepository from "../../../../Domain/repositoryInterface/iAdmin.repository";
import { authMessages } from "../../../../Shared/constsnts/messages/authMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { IHashService } from "../../../interface/service/IHashService";
import { ITokenService } from "../../../interface/service/ITokenService";
import { LoginAdminInputDto, LoginAdminOutputDTO } from "../../dtos/auth/login.admin.dto";
import { IAdminLoginUsecase } from "../../interfaces/auth/IAdminLoginUsecase";


export class AdminLoginUsecase implements IAdminLoginUsecase {
    constructor(
        private _adminRepository: IAdminRepository,
        private _hashService: IHashService,
        private _tokenService: ITokenService
    ) {}

    /**
     * 
     * @param request login request with credentials
     * @returns access token, refresh token and admin details
     */
    async execute(request: LoginAdminInputDto): Promise<LoginAdminOutputDTO> {
        const admin = await this._adminRepository.findByEmail(request.email)
        if(!admin){
            throw new AppError(authMessages.error.ADMIN_NOT_FOUND, statusCode.NOT_FOUND)
        }

        const iValidPassword = await this._hashService.compare(request.password, admin.getPassword())
        if(!iValidPassword){
            throw new AppError(authMessages.error.INVALID_PASSWORD, statusCode.BAD_REQUEST)
        } 

        const id = admin.id
        if(!id){
            throw new AppError(authMessages.error.ADMIN_NOT_FOUND, statusCode.NOT_FOUND)
        }

        const refreshToken = this._tokenService.generateRefreshToken({id: id, role: admin.getRole()})
        const accessToken = this._tokenService.generateAccessToken({id: id, email: admin.getEmail(), role: admin.getRole()})
        const csrfToken = this._tokenService.generateCsrfToken()

        const hashedRefreshToken = this._hashService.hashToken(refreshToken)
        await this._adminRepository.updateToken(id, hashedRefreshToken)

        return {
           accessToken,
           refreshToken,
           csrfToken,
           admin: {
            id,
            email: admin.getEmail(),
            name: admin.getName(),
            role: admin.getRole()
           }
        }
    }
}