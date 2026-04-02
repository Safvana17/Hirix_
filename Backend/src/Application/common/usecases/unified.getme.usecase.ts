import AdminEntity from "../../../Domain/entities/admin.entity";
import CandidateEntity from "../../../Domain/entities/candidate.entity";
import CompanyEntity from "../../../Domain/entities/company.entity";
import userRole from "../../../Domain/enums/userRole.enum";
import { AppError } from "../../../Domain/errors/app.error";
import { IBaseRepository } from "../../../Domain/repositoryInterface/iBase.repository";
import { authMessages } from "../../../Shared/constsnts/messages/authMessages";
import { statusCode } from "../../../Shared/Enumes/statusCode";
import { UnifiedGetMeInputDTO, UnifiedGetMeOutputDTO } from "../dtos/unified.getme.dto";
import { IUnifiedGetMeUsecase } from "../interfaces/IUnifiedGetMeUsecase";


export class UnifiedGetMeUsecase implements IUnifiedGetMeUsecase{
    constructor(
        private _repositoryRegistry: Map<userRole, IBaseRepository<CandidateEntity | CompanyEntity | AdminEntity>>
    ) {}

    /**
     * 
     * @param request id and role
     * @returns - id name, email and role
     */
    async execute(request: UnifiedGetMeInputDTO): Promise<UnifiedGetMeOutputDTO> {
        const repository = this._repositoryRegistry.get(request.role)

        if(!repository){
            throw new AppError(authMessages.error.UNAUTHORIZED, statusCode.UNAUTHORIZED)
        }

        const user = await repository.findById(request.id)
        if(!user){
            throw new AppError(authMessages.error.UNAUTHORIZED, statusCode.UNAUTHORIZED)
        }

        if(user.getIsBlocked()){
            throw new AppError(authMessages.error.COMPANY_BLOCKED, statusCode.FORBIDDEN)
        }
        const id = user.id
        const userId = id!
        return {
                id: userId,
                name: user.getName(),
                email: user.getEmail(),
                role: user.getRole()
        }
    }
}