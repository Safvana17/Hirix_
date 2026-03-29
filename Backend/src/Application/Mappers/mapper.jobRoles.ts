import { JobRolesEntity } from "../../Domain/entities/JobRoles.entity";
import { IJobRoles } from "../../Infrastructure/database/Model/JobRoles";

export class JobRoleMapper {
    static toEntity(doc: IJobRoles): JobRolesEntity {
        const jobRole = new JobRolesEntity(
            doc._id.toString(),
            doc.name,
            doc.skills,
            doc.experienceMin,
            doc.experienceMax,
            doc.openings,
            doc.isActive,
            doc.isDeleted
        )
        return jobRole
    }

    static toPersistence(entity: JobRolesEntity){
        return {
            name: entity.name,
            skills: entity.skills,
            experienceMin: entity.experienceMin,
            experienceMax: entity.experienceMax,
            openings: entity.openings,
            isActive: entity.isActive,
            isDeleted: entity.isDeleted
        }
    }
}