import { Model, Types, UpdateQuery } from "mongoose";
import { IBaseRepository } from "../../Domain/repositoryInterface/iBase.repository";

export abstract class BaseRepository <
T extends {id?: string},
D extends {_id: Types.ObjectId}
> implements IBaseRepository <T> {
    constructor(
        protected _model: Model<D>
    ) {}

    async create(entity: T): Promise<T> {
        // return this._model.create(entity)
        const data = this.mapToPersistance(entity)
        const newUser = await this._model.create(data)
        return this.mapToEntity(newUser)
    }

    async findById(id: string): Promise<T | null> {
        const user = await this._model.findById(id)
        if(!user) return null
        return this.mapToEntity(user)
    }

    async findAll(): Promise<T[]> {
        const users = await this._model.find()
        return users.map((user) => this.mapToEntity(user))
    }

    async update(id: string, data: Partial<T>): Promise<T | null> {
        // return this._model.findByIdAndUpdate(id, data, {new: true})
        const persisted = this.mapToPersistance(data)
        const updated =await this._model.findByIdAndUpdate(id, persisted as UpdateQuery<D>, {new: true})
        if(!updated) return null
        return this.mapToEntity(updated)
    }

    // async updateToken(id: string, token: string): Promise<void> {
    //     await this._model.findByIdAndUpdate(
    //         id,
    //         {$push: {refreshToken: token}}
    //     )
    // }

    // async revokeRefreshToken(hashedToken: string): Promise<void> {
    //     await this._model.findOneAndUpdate(
    //         {refreshToken: hashedToken},
    //         {$pull: {refreshToken: hashedToken}}
    //     )
    // }

    protected abstract mapToEntity(doc: D): T
    protected abstract mapToPersistance(entity: Partial<T>): Partial<D>

}