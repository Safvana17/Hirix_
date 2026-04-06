import { QuestionEntity } from "../../../../Domain/entities/Question.entity";
import QuestionDifficulty from "../../../../Domain/enums/questionDifficulty";
import QuestionType from "../../../../Domain/enums/questionType";
import userRole from "../../../../Domain/enums/userRole.enum";


export interface getAllQuestionsInputDTO{
    search?: string;
    difficulty?: QuestionDifficulty;
    type?: QuestionType;
    category?: string;
    role: userRole;
    userId?: string;
    page: number;
    limit: number;
}

export interface PaginatedQuestionDTO {
    questions: QuestionEntity[];
    totalPages: number;
    totalCount: number
}

