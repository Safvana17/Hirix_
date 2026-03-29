import { JobRoleMapper } from "../../Application/Mappers/mapper.jobRoles";
import { JobRolesEntity } from "../../Domain/entities/JobRoles.entity";
import { IJobRepository } from "../../Domain/repositoryInterface/iJobRoles.repository";
import { IJobRoles, JobRolesModel } from "../database/Model/JobRoles";
import { BaseRepository } from "./base.repository";

export class JobRolesRepository extends BaseRepository<JobRolesEntity, IJobRoles> implements IJobRepository {
    constructor(){
        super(JobRolesModel)
    }

    async findActiveByName(name: string): Promise<JobRolesEntity | null> {
        const jobRole = await this._model.findOne({
            name: {$regex: `^${name}$`, $options: "i"},
            isActive: true,
            isDeleted: false
        })
        if(!jobRole) return null
        return this.mapToEntity(jobRole)
    }

    async delete(id: string): Promise<void> {
        await this._model.findByIdAndUpdate(
            id,
            {$set: {isDeleted: true}}
        )
    }

    protected mapToEntity(doc: IJobRoles): JobRolesEntity {
        return JobRoleMapper.toEntity(doc)
    }

    protected mapToPersistance(entity: JobRolesEntity): Partial<IJobRoles> {
        return JobRoleMapper.toPersistence(entity)
    }

}