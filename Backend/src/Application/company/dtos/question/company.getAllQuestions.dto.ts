import { QuestionEntity } from "../../../../Domain/entities/Question.entity";
import QuestionDifficulty from "../../../../Domain/enums/questionDifficulty";
import QuestionType from "../../../../Domain/enums/questionType";
import userRole from "../../../../Domain/enums/userRole.enum";


export interface CompanyGetAllQuestionsInputDTO{
    search?: string;
    difficulty?: QuestionDifficulty;
    type?: QuestionType;
    category?: string;
    role: userRole;
    userId?: string;
    page: number;
    limit: number;
}

export interface CompanyPaginatedQuestionDTO {
    questions: QuestionEntity[];
    totalPages: number;
    totalCount: number
}

