import { AppError } from "../../../../Domain/errors/app.error";
import ICompanyRepository from "../../../../Domain/repositoryInterface/iCompany.repository";
import { authMessages } from "../../../../Shared/constsnts/messages/authMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { logger } from "../../../../utils/logging/loger";
import { getCompanyProfileInputDTO, getCompanyProfileOutputDTO } from "../../dtos/settings/settings.company.dto";
import { IGetCompanyProfileUsecase } from "../../interfaces/settings/iCompany.getCompany.usecase";

export class GetCompanyProfileUsecase implements IGetCompanyProfileUsecase{
    constructor(
        private _companyRepository: ICompanyRepository
    ) {}

    async execute(request: getCompanyProfileInputDTO): Promise<getCompanyProfileOutputDTO> {
        const company = await this._companyRepository.findById(request.id)
        logger.info({DATA: company}, 'from usecase')
        if(!company){
            throw new AppError(authMessages.error.COMPANY_NOT_FOUND, statusCode.NOT_FOUND)
        }

        return {company}
    }
}