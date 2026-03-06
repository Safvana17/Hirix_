import userRole from "../../../../Domain/enums/userRole.enum";
import { LoginCompanyOutputDTO } from "../../dtos/login.company.dto";

export interface ICompanyGoogleLoginUsecase {
    execute(token: string, role: userRole): Promise<LoginCompanyOutputDTO>
}