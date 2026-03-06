import { AppError } from "../../../Domain/errors/app.error";
import ICompanyRepository from "../../../Domain/repositoryInterface/iCompany.repository";
import { authMessages } from "../../../Shared/constsnts/messages/authMessages";
import { statusCode } from "../../../Shared/Enumes/statusCode";
import { IOtpService } from "../../interface/service/IOtpService";
import { IOtpStore } from "../../interface/service/IOtpStore";
import { VerifyCompanyInputDTO, VerifyCompanyOutputDTO } from "../dtos/verifyRegister.company.dto";
import { IVerifyRegisterCompanyUsecase } from "../interfaces/auth/ICompanyVerifyRegisterUsecase";

export class VerifyRegisterCompanyUsecase implements IVerifyRegisterCompanyUsecase{
     constructor(
        private companyRepository: ICompanyRepository,
        private otpService: IOtpService,
        private otpStore: IOtpStore
     ) {}

     async execute(request: VerifyCompanyInputDTO): Promise<VerifyCompanyOutputDTO> {
        const company = await this.companyRepository.findByEmail(request.email)
        if(!company || !company.id){
            throw new AppError(authMessages.error.COMPANY_NOT_FOUND, statusCode.NOT_FOUND)
        }

        if(company.isUserVerified()){
            throw new AppError(authMessages.error.CONFLICT, statusCode.CONFLICT)
        }

        const id = company.id
        const savedOtp = await this.otpStore.getOtp(id)
        if(!savedOtp){
            throw new AppError(authMessages.error.OTP_EXPIRED, statusCode.BAD_REQUEST)
        }

        const isValid = await this.otpService.compare(request.otp, savedOtp)
        if(!isValid){
            throw new AppError(authMessages.error.INVALID_OTP, statusCode.BAD_REQUEST)
        }

        company.markAsVerified()
        await this.companyRepository.update(id, company)
        await this.otpStore.deleteOtp(id)

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