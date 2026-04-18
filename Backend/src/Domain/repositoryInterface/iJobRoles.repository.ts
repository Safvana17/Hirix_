import { JobRolesEntity } from "../entities/JobRoles.entity";
import { IBaseRepository } from "./iBase.repository";

export interface IJobRepository extends IBaseRepository<JobRolesEntity> {
    findActiveByName(name: string, companyId: string): Promise< JobRolesEntity | null >
    findAllFiltered(query: {search?: string, status?: string, page: number, limit: number}): Promise<{data: JobRolesEntity[], totalPages: number, totalCount: number}>   
    CountJobRoleInMonth(companyId: string, startOfMonth: Date, endOfMonth: Date): Promise<number>
}