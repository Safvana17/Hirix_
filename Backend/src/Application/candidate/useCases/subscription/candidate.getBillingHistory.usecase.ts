import { AppError } from "../../../../Domain/errors/app.error";
import ICandidateRepository from "../../../../Domain/repositoryInterface/iCandidate.repository";
import { IPaymentRepository } from "../../../../Domain/repositoryInterface/iPayment.repository";
import { authMessages } from "../../../../Shared/constsnts/messages/authMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { CandidateGetBillingHistoryInputDTO, CandidateGetBillingHistoryOutputDTO } from "../../dtos/subscription/candidate.getBillingHistory.dto";
import { ICandidateGetBillingHistoryUsecase } from "../../interfaces/subscription/ICandidate.getBillingHistory.usecase";

export class CandidateGetBillingHistoryUsecase implements ICandidateGetBillingHistoryUsecase {
    constructor(
        private _candidateRepository: ICandidateRepository,
        private _paymentRepository: IPaymentRepository
    ){}
    async execute(request: CandidateGetBillingHistoryInputDTO): Promise<CandidateGetBillingHistoryOutputDTO> {
        const candidate = await this._candidateRepository.findById(request.userId)
        if(!candidate){
            throw new AppError(authMessages.error.CANDIDATE_NOT_FOUND, statusCode.NOT_FOUND)
        }

        const { data, totalCount, totalPages } = await this._paymentRepository.findAllFiltered(request)
        return {
            payments: data,
            totalCount,
            totalPages
        }       
    }
}