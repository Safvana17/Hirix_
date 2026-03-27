import { UpdateCompanyProfileOutputDTO, UploadProfileImageInputDTO } from "../../dtos/settings/settings.company.dto";

export interface IUploadCompanyProfileImage {
    execute(request: UploadProfileImageInputDTO): Promise<UpdateCompanyProfileOutputDTO>
}