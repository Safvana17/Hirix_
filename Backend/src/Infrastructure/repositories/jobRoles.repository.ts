import { QueryFilter } from "mongoose";
import { JobRoleMapper } from "../../Application/Mappers/mapper.jobRoles";
import { JobRolesEntity } from "../../Domain/entities/JobRoles.entity";
import { IJobRepository } from "../../Domain/repositoryInterface/iJobRoles.repository";
import { IJobRoles, JobRolesModel } from "../database/Model/JobRoles";
import { BaseRepository } from "./base.repository";

export class JobRolesRepository extends BaseRepository<JobRolesEntity, IJobRoles> implements IJobRepository {
    constructor(){
        super(JobRolesModel)
    }

    async findActiveByName(name: string, companyId: string): Promise<JobRolesEntity | null> {
        const jobRole = await this._model.findOne({
            name: {$regex: `^${name}$`, $options: "i"},
            createdById: companyId,
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

    async findAllFiltered(query: { search?: string; status?: string; userId: string; page: number; limit: number; }): Promise<{ data: JobRolesEntity[]; totalPages: number; totalCount: number; }> {
        const filter: QueryFilter<IJobRoles> = {
            createdById: query.userId
        }
        if(query.search){
            filter.$or = [
                {name: {$regex: query.search, $options: 'i'} },
                {email: {$regex: query.search, $options: 'i'} }
            ]
        }
        if (query.status) {
            if (query.status === "Active") {
            filter.status = "Active"
            }

            else if (query.status === "Closed") {
            filter.status = "Closed"
            }

            else if (query.status === "Deleted") {
            filter.status = "Deleted"
            }
        }

        const skip = (query.page - 1) * query.limit
        const totalCount = await this._model.countDocuments(filter)
        const totalPages =Math.ceil(totalCount / query.limit)

        const documents = await this._model.find(filter)
              .skip(skip)
              .limit(query.limit)
              .sort({createdAt: -1})

        return {
            data: documents.map(doc => this.mapToEntity(doc)),
            totalPages,
            totalCount
        }
    }

    async CountJobRoleInMonth(companyId: string, startOfMonth: Date, endOfMonth: Date): Promise<number> {

        return await this._model.countDocuments({
            createdById: companyId,
            isDeleted: false,
            createdAt: {
                $gt: startOfMonth,
                $lt: endOfMonth,
            }
        })
    }

    protected mapToEntity(doc: IJobRoles): JobRolesEntity {
        return JobRoleMapper.toEntity(doc)
    }

    protected mapToPersistance(entity: JobRolesEntity): Partial<IJobRoles> {
        return JobRoleMapper.toPersistence(entity)
    }

}