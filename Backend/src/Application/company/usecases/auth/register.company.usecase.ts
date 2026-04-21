import CompanyEntity from "../../../../Domain/entities/company.entity";
import { subscriptionStatus, TargetType } from "../../../../Domain/enums/subscription";
import { UserStatus } from "../../../../Domain/enums/userStatus.enum";
import { AppError } from "../../../../Domain/errors/app.error";
import ICompanyRepository from "../../../../Domain/repositoryInterface/iCompany.repository";
import { ISubscriptionRepository } from "../../../../Domain/repositoryInterface/iSubscription.repository";
import { ISubscriptionPlanRepository } from "../../../../Domain/repositoryInterface/iSubscriptionPlan.repository";
import { authMessages } from "../../../../Shared/constsnts/messages/authMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { IHashService } from "../../../interface/service/IHashService";
import { IMailService } from "../../../interface/service/IMailService";
import { IOtpService } from "../../../interface/service/IOtpService";
import { IOtpStore } from "../../../interface/service/IOtpStore";
import { RegisterCompanyInputDTO, RegisterCompanyOutputDTO } from "../../dtos/auth/register.company.dto";
import { ICompanyRegisterUsecase } from "../../interfaces/auth/ICompanyRegisterUsecase";

export class RegisterCompanyUsecase implements ICompanyRegisterUsecase {
    constructor(
        private companyRepository: ICompanyRepository,
        private hasheService: IHashService,
        private _otpService: IOtpService,
        private _otpStore: IOtpStore,
        private _mailService: IMailService,
        private _subscriptionPlanRepository: ISubscriptionPlanRepository,
        private _subscriptionRepository: ISubscriptionRepository
    ) {}

    /**
     * 
     * @param input company register request with company primary details
     */
    async execute(input: RegisterCompanyInputDTO): Promise<RegisterCompanyOutputDTO> {

        const companyExist = await this.companyRepository.findByEmail(input.email)
        if(companyExist){
            throw new AppError(authMessages.error.COMPANY_ALREADY_EXISTS, statusCode.CONFLICT)
        }

        const hashedPassword = await this.hasheService.hash(input.password)

        const company = new CompanyEntity("", input.name, input.email, hashedPassword,false, false, false, UserStatus.PENDING, false, false)

        const freePlan = await this._subscriptionPlanRepository.findFreePlan(TargetType.COMPANY)
        if(!freePlan){
            throw new AppError(authMessages.error.MISSING_FREE_PLAN, statusCode.SERVER_ERROR)
        }
        const savedCompany = await this.companyRepository.create(company)

        await this._subscriptionRepository.create({
            id: '',
            ownerType: TargetType.COMPANY,
            ownerId: savedCompany.id,
            planId: freePlan.id!,
            startDate: new Date(),
            endDate: null,
            status: subscriptionStatus.ACTIVE,
            isCurrent: true,
        })
        const otp = this._otpService.generate()
        const hashedOtp = await this._otpService.hash(otp)

        await this._otpStore.saveOtp(savedCompany.getId()!, hashedOtp, 120)
        // await this._mailService.sentOtp(savedCompany.getEmail(), otp)

        return {
            success: true
        }
    }
}