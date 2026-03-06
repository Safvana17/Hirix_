import { AppError } from "../../../Domain/errors/app.error";
import ICompanyRepository from "../../../Domain/repositoryInterface/iCompany.repository";
import { authMessages } from "../../../Shared/constsnts/messages/authMessages";
import { statusCode } from "../../../Shared/Enumes/statusCode";
import { IHashService } from "../../interface/service/IHashService";
import { IOtpService } from "../../interface/service/IOtpService";
import { IOtpStore } from "../../interface/service/IOtpStore";
import { CompanyResetPasswordInputDTO, CompanyResetPasswordOutputDTO } from "../dtos/resetPassword.company.dto";
import { ICompanyResetPasswordUsecase } from "../interfaces/auth/ICompanyResetPasswordUsecase";

export class CompanyResetPasswordUsecase implements ICompanyResetPasswordUsecase{
    constructor(
        private companyRepository: ICompanyRepository,
        private otpStore: IOtpStore,
        private otpService: IOtpService,
        private hashService: IHashService
    ) {}

    async execute(request: CompanyResetPasswordInputDTO): Promise<CompanyResetPasswordOutputDTO> {
        const comapny = await this.companyRepository.findByEmail(request.email)
        if(!comapny || !comapny.id){
            throw new AppError(authMessages.error.COMPANY_NOT_FOUND, statusCode.NOT_FOUND)
        }

        const id = comapny.id
        const hashedOtp = await this.otpStore.getOtp(id)
        const isValid = await this.otpService.compare(request.otp, hashedOtp!)
        if(!isValid){
            throw new AppError(authMessages.error.INVALID_PASSWORD, statusCode.BAD_REQUEST)
        }

        const changedPassword = await this.hashService.hash(request.newPassword)
        await this.companyRepository.updatePassword(id,changedPassword)

        await this.otpStore.deleteOtp(id)

        return {success: true}
    }
}