import { AdminMapper } from "../../Application/Mappers/mapper.admin";
import AdminEntity from "../../Domain/entities/admin.entity";
import IAdminRepository from "../../Domain/repositoryInterface/iAdmin.repository";
import { adminModel, IAdmin } from "../database/Model/admin";
import { BaseRepository } from "./base.repository";

export class AdminRepository extends BaseRepository <AdminEntity, IAdmin> implements IAdminRepository {
    constructor(){
        super(adminModel)
    }

    async findByEmail(email: string): Promise<AdminEntity | null> {
        const admin = await adminModel.findOne({email})
        if(!admin) return null
        return AdminMapper.toEntity(admin)
    }

    // async updateToken(id: string, token: string): Promise<void> {
    //     await adminModel.findByIdAndUpdate(
    //         id,
    //         {$push: {refreshTokens: token}}
    //     )
    // }

    // async revokeRefreshToken(token: string): Promise<void> {
    //     await adminModel.findOneAndUpdate(
    //         {
    //             refreshTokens: token
    //         },
    //         {
    //             $pull: {refreshTokens: token}
    //         }
    //     )
    // }
    
    protected mapToEntity(doc: IAdmin): AdminEntity {
        return AdminMapper.toEntity(doc)
    }

    protected mapToPersistance(entity: AdminEntity): Partial<IAdmin> {
        return AdminMapper.toDocument(entity)
    }
}