import { UpdateCompanyProfileInputDTO, UpdateCompanyProfileOutputDTO } from "../../dtos/settings/settings.company.dto";

export interface ICompanyUpdateProfileUsecase{
    execute(request: UpdateCompanyProfileInputDTO): Promise<UpdateCompanyProfileOutputDTO>
}