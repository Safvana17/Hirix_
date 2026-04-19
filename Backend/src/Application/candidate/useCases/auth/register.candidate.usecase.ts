import candidateEntity from "../../../../Domain/entities/candidate.entity";
import ICandidateRepository from "../../../../Domain/repositoryInterface/iCandidate.repository";
import { RegisterCandidateInputDTO, RegisterCandidateOutputDTO } from "../../dtos/auth/register.candidate.dto";
import { IOtpService } from "../../../interface/service/IOtpService"
import { IHashService } from "../../../interface/service/IHashService"
import { IMailService } from "../../../interface/service/IMailService";
import { IOtpStore } from "../../../interface/service/IOtpStore";
import { ICandidateRegisterUsecase } from "../../interfaces/auth/ICandidateRegisterUsecase";
import { AppError } from "../../../../Domain/errors/app.error";
import { authMessages } from "../../../../Shared/constsnts/messages/authMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { UserStatus } from "../../../../Domain/enums/userStatus.enum";
import { ISubscriptionRepository } from "../../../../Domain/repositoryInterface/iSubscription.repository";
import { ISubscriptionPlanRepository } from "../../../../Domain/repositoryInterface/iSubscriptionPlan.repository";
import { subscriptionStatus, TargetType } from "../../../../Domain/enums/subscription";

export class RegisterCandidateUsecase implements ICandidateRegisterUsecase{
    constructor(
        private candidateRepository : ICandidateRepository,
        private hashService: IHashService,
        private otpService: IOtpService,
        private otpStore: IOtpStore,
        private mailService: IMailService,
        private _subscriptionRepository: ISubscriptionRepository,
        private _subscriptionPlanRepository: ISubscriptionPlanRepository
    ) {}

    /**
     * 
     * @param request - name, email and password
     * @returns - true if sent otp
     */

    async execute(request: RegisterCandidateInputDTO): Promise<RegisterCandidateOutputDTO> {

        const userExist = await this.candidateRepository.findByEmail(request.email)

        if(userExist){
            throw new AppError(authMessages.error.CANDIDATE_ALREADY_EXISTS, statusCode.CONFLICT)
        }

        const hashedPassword = await this.hashService.hash(request.password)
        const candidate = new candidateEntity("",request.name, request.email, hashedPassword, false, false, UserStatus.PENDING)
        const freePlan = await this._subscriptionPlanRepository.findFreePlan(TargetType.CANDIDATE)
        if(!freePlan){
            throw new AppError(authMessages.error.MISSING_FREE_PLAN, statusCode.SERVER_ERROR)
        }

        const savedCandidate = await this.candidateRepository.create(candidate)
        await this._subscriptionRepository.create({
            id: '',
            ownerType: TargetType.CANDIDATE,
            ownerId: savedCandidate.id,
            planId: freePlan.id!,
            startDate: new Date(),
            endDate: null,
            status: subscriptionStatus.ACTIVE,
            isCurrent: true,
        })
        
        const otp = this.otpService.generate()
        const hashedOtp = await this.otpService.hash(otp)

        await this.otpStore.saveOtp(savedCandidate.getId()!, hashedOtp, 120)

        await this.mailService.sentOtp(savedCandidate.getEmail(), otp)

        return {
            success: true
        }
    }

}