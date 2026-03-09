import { UpdataStatusInputDTO, UpdateStatusOutputDTO } from "../../dtos/userManagement/updateStatus.admin.dto";

export interface IAdminUpdateCandidateStatus {
    execute(request: UpdataStatusInputDTO): Promise<UpdateStatusOutputDTO>
}