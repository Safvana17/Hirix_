import { TemplateEntity } from "../entities/Template.entity";
import { IBaseRepository } from "./iBase.repository";

export interface ITemplateRepository extends IBaseRepository<TemplateEntity> {
    findByKey(key: string): Promise<TemplateEntity | null>
}