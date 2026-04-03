import { QueryFilter } from "mongoose";
import { QuestionEntity } from "../../Domain/entities/Question.entity";
import QuestionDifficulty from "../../Domain/enums/questionDifficulty";
import QuestionType from "../../Domain/enums/questionType";
import { IQuestionRepository } from "../../Domain/repositoryInterface/iQuestion.repository";
import { IQuestion, QuestionModel } from "../database/Model/Question";
import { BaseRepository } from "./base.repository";
import { QuestionMapper } from "../../Application/Mappers/mapper.question";

export class QuestionRepository extends BaseRepository <QuestionEntity, IQuestion> implements IQuestionRepository{
    constructor(){
        super(QuestionModel)
    }

    async findByTitle(title: string): Promise<QuestionEntity | null> {
        const documents = await this._model.findOne({title: title})
        if(!documents) return null
        return this.mapToEntity(documents)
    }

    async findAllFiltered(query: { search?: string; difficulty?: QuestionDifficulty; type?: QuestionType; category?: string; page: number; limit: number; }): Promise<{ data: QuestionEntity[]; totalPages: number; totalCount: number; }> {
        const filter: QueryFilter<IQuestion> = {
            isDeleted: false
        }

        if(query.search){
            filter.$or = [
                { title: { $regex: query.search, $options: "i" } },
                { difficulty: { $regex: query.search, $options: "i" } },
                { type: { $regex: query.search, $options: "i" } },
                { categoryId: { $regex: query.search, $options: "i" } }
            ]
        }
        if(query.difficulty){
            if(query.difficulty === 'easy'){
                filter.difficulty = 'easy'
            }
            if(query.difficulty === 'medium'){
                filter.difficulty = 'medium'
            }
            if(query.difficulty === 'hard'){
                filter.difficulty = 'hard'
            }
        }
        if(query.type){
            if(query.type === 'mcq'){
                filter.type = 'mcq'
            }
            if(query.type === 'descriptive'){
                filter.type = 'descriptive'
            }
            if(query.type === 'coding'){
                filter.type = 'coding'
            }
        }
        if(query.category){
            filter.categoryId = query.category
        }

        const skip = (query.page - 1) * query.limit
        const totalCount = await this._model.countDocuments(filter)
        const totalPages = Math.ceil(totalCount / query.limit)

        const documents = await this._model  
            .find(filter)
            .skip(skip)
            .limit(query.limit)
            .sort({createdAt: -1})

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