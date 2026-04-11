import { UserStatus } from "../../../../Domain/enums/userStatus.enum";
import { AppError } from "../../../../Domain/errors/app.error";
import ICompanyRepository from "../../../../Domain/repositoryInterface/iCompany.repository";
import { authMessages } from "../../../../Shared/constsnts/messages/authMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { IOtpService } from "../../../interface/service/IOtpService";
import { IOtpStore } from "../../../interface/service/IOtpStore";
import { verifyRegisterCompanyOtpInputDTO, verifyRegisterCompanyOtpOutputDTO } from "../../dtos/auth/company.verifyRegisterotp.dto";
import { IVerifyRegisterCompanyOtpUsecase } from "../../interfaces/auth/ICompany.verifyRegisterOtp.usecase";

export class CompanyVerifyRegisterOtpUsecase implements IVerifyRegisterCompanyOtpUsecase {
    constructor(
        private _companyRepository: ICompanyRepository,
        private _otpStore: IOtpStore,
        private _otpService: IOtpService
    ) {}

    async execute(request: verifyRegisterCompanyOtpInputDTO): Promise<verifyRegisterCompanyOtpOutputDTO> {
        const company = await this._companyRepository.findByEmail(request.email)
        if(!company || !company.getId()){
            throw new AppError(authMessages.error.CANDIDATE_NOT_FOUND, statusCode.NOT_FOUND)
        }

        if(company.isUserVerified()){
            throw new AppError(authMessages.error.ALREADY_VERIFIED, statusCode.BAD_REQUEST)
        }

        const Id = company.getId()
        const companyId = Id!;
        const storedOtp = await this._otpStore.getOtp(companyId)
        if(!storedOtp){
            throw new AppError(authMessages.error.OTP_EXPIRED, statusCode.BAD_REQUEST)
        }

        const isValid = await this._otpService.compare(request.otp, storedOtp)

        if(!isValid){
            throw new AppError(authMessages.error.INVALID_OTP, statusCode.BAD_REQUEST)
        }

        company.markAsVerified()
        company.isProfileUpdated = false
        company.setStatus(UserStatus.PENDING)
        
        await this._companyRepository.update(companyId, company)
        await this._otpStore.deleteOtp(companyId)


        // const refreshToken = this.tokenService.generateRefreshToken({candidateId})
        // const accessToken = this.tokenService.generateAccessToken({candidateId, email: candidate.getEmail(), role: candidate.getRole()})

        return {
            company: {
                id: companyId,
                name: company.getName(),
                email: company.getEmail(),
                role: company.getRole()

            }
        } 
    }
}