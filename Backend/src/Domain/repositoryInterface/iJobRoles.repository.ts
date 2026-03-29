import { JobRolesEntity } from "../entities/JobRoles.entity";
import { IBaseRepository } from "./iBase.repository";

export interface IJobRepository extends IBaseRepository<JobRolesEntity> {
    findActiveByName(name: string): Promise< JobRolesEntity | null >
    delete(id: string): Promise<void>
}