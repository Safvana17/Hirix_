import { QuestionEntity } from "../entities/Question.entity";
import QuestionDifficulty from "../enums/questionDifficulty";
import QuestionType from "../enums/questionType";
import { IBaseRepository } from "./iBase.repository";

export interface IQuestionRepository extends IBaseRepository<QuestionEntity> {
    findAllFiltered(query: {search?: string, difficulty?: QuestionDifficulty, type?: QuestionType, category?: string, page: number, limit: number}): Promise<{data: QuestionEntity[], totalPages: number, totalCount: number}>
    findByTitle(title: string): Promise<QuestionEntity | null>
}