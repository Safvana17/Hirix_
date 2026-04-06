import { QueryFilter } from "mongoose";
import { QuestionEntity } from "../../Domain/entities/Question.entity";
import QuestionDifficulty from "../../Domain/enums/questionDifficulty";
import QuestionType from "../../Domain/enums/questionType";
import { IQuestionRepository } from "../../Domain/repositoryInterface/iQuestion.repository";
import { IQuestion, QuestionModel } from "../database/Model/Question";
import { BaseRepository } from "./base.repository";
import { QuestionMapper } from "../../Application/Mappers/mapper.question";
import { logger } from "../../utils/logging/loger";
import userRole from "../../Domain/enums/userRole.enum";

export class QuestionRepository extends BaseRepository <QuestionEntity, IQuestion> implements IQuestionRepository{
    constructor(){
        super(QuestionModel)
    }

    async findByTitle(title: string): Promise<QuestionEntity | null> {
        const documents = await this._model.findOne({title: title})
        if(!documents) return null
        return this.mapToEntity(documents)
    }

    async findAllFiltered(query: { search?: string; difficulty?: QuestionDifficulty; type?: QuestionType; category?: string; role: userRole; userId?: string; page: number; limit: number; }): Promise<{ data: QuestionEntity[]; totalPages: number; totalCount: number; }> {
        const filter: QueryFilter<IQuestion> = {
            isDeleted: false
        }

        if(query.role === userRole.Admin){
            filter.createdBy = 'Admin'
        }

        if(query.role === userRole.Company){
            filter.createdBy = 'Company'
            filter.createdById = query.userId
        }
        if(query.search){
            filter.$or = [
                { title: { $regex: query.search, $options: "i" } },
                { description: {$regex: query.search, $options: 'i' } }
            ]
        }
        if(query.difficulty){
            filter.difficulty = query.difficulty
        }
        if(query.type){
            filter.type = query.type
        }
        if(query.category){
            filter.categoryId = query.category
        }

        const skip = (query.page - 1) * query.limit
        const totalCount = await this._model.countDocuments(filter)
        const totalPages = Math.ceil(totalCount / query.limit)

        const documents = await this._model  
            .find(filter)
            .populate('categoryId', 'name')
            .skip(skip)
            .limit(query.limit)
            .sort({createdAt: -1})

            logger.info(documents, 'from repository')
        return {
            data: documents.map(doc => this.mapToEntity(doc)),
            totalPages,
            totalCount
        }
    }

    protected mapToEntity(doc: IQuestion): QuestionEntity {
        return QuestionMapper.toEntity(doc)
    }

    protected mapToPersistance(entity: QuestionEntity): Partial<IQuestion> {
        return QuestionMapper.toPersistence(entity)
    }
}