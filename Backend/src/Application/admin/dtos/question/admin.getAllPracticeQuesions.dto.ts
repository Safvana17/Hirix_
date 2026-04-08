import { QuestionEntity } from "../../../../Domain/entities/Question.entity";
import QuestionDifficulty from "../../../../Domain/enums/questionDifficulty";
import QuestionType from "../../../../Domain/enums/questionType";


export interface getAllPracticeQuestionsInputDTO{
    search?: string;
    difficulty?: QuestionDifficulty;
    type?: QuestionType;
    category?: string;
    page: number;
    limit: number;
}

export interface PaginatedPracticeQuestionDTO {
    practiceQuestions: QuestionEntity[];
    totalPages: number;
    totalCount: number
}

