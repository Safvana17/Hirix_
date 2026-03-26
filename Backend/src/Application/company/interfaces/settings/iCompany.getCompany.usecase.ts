import { getCompanyProfileInputDTO, getCompanyProfileOutputDTO } from "../../dtos/settings/settings.company.dto";

export interface IGetCompanyProfileUsecase {
    execute(request: getCompanyProfileInputDTO): Promise<getCompanyProfileOutputDTO>
}