import candidateEntity from "../../../../Domain/entities/candidate.entity";
import ICandidateRepository from "../../../../Domain/repositoryInterface/iCandidate.repository";
import { RegisterCandidateInputDTO, RegisterCandidateOutputDTO } from "../../dtos/register.candidate.dto";
import { IOtpService } from "../../../interface/service/IOtpService"
import { IHashService } from "../../../interface/service/IHashService"
import { IMailService } from "../../../interface/service/IMailService";
import { IOtpStore } from "../../../interface/service/IOtpStore";
import { ICandidateRegisterUsecase } from "../../interfaces/auth/ICandidateRegisterUsecase";
import { AppError } from "../../../../Domain/errors/app.error";
import { authMessages } from "../../../../Shared/constsnts/messages/authMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";

export class RegisterCandidateUsecase implements ICandidateRegisterUsecase{
    constructor(
        private candidateRepository : ICandidateRepository,
        private hashService: IHashService,
        private otpService: IOtpService,
        private otpStore: IOtpStore,
        private mailService: IMailService
    ) {}

    async execute(request: RegisterCandidateInputDTO): Promise<RegisterCandidateOutputDTO> {

        const userExist = await this.candidateRepository.findByEmail(request.email)

        if(userExist){
            throw new AppError(authMessages.error.CANDIDATE_ALREADY_EXISTS, statusCode.CONFLICT)
        }

        const hashedPassword = await this.hashService.hash(request.password)
        const candidate = new candidateEntity("",request.name, request.email, hashedPassword, false, false)

        const savedCandidate = await this.candidateRepository.create(candidate)

        const otp = this.otpService.generate()
        const hashedOtp = await this.otpService.hash(otp)

        await this.otpStore.saveOtp(savedCandidate.getId()!, hashedOtp, 120)

        await this.mailService.sentOtp(savedCandidate.getEmail(), otp)

        return {
            success: true
        }
    }

}