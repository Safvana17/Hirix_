import { CompanySendOfferLetterInputDTO, CompanySendOfferLetterOutputDTO } from "../../dtos/interview/company.sendOfferLetter.dto";

export interface ICompanySendOfferLetterUsecase {
    execute(request: CompanySendOfferLetterInputDTO): Promise<CompanySendOfferLetterOutputDTO>
}