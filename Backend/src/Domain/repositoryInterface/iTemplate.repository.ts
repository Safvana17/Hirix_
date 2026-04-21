import { TemplateEntity } from "../entities/Template.entity";
import { IBaseRepository } from "./iBase.repository";

export interface ITemplateRepository extends IBaseRepository<TemplateEntity> {
    findByKey(key: string): Promise<TemplateEntity | null>
    findAllFiltered(params: {page?: number, limit?: number, isActive?: boolean}): Promise<{data: TemplateEntity[], totalPages: number, totalCount: number}>
}