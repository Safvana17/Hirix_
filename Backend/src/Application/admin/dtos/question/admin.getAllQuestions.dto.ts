import QuestionDifficulty from "../../../../Domain/enums/questionDifficulty";
import QuestionType from "../../../../Domain/enums/questionType";
import QuestionVisibility from "../../../../Domain/enums/questionVisibility";

export interface GetAllQuestionsOutputDTO {
    id: string;
    title: string;
    categoryName: string;
    type: QuestionType;
    difficulty: QuestionDifficulty;
    visibility: QuestionVisibility;
}

export interface getAllQuestionsInputDTO{
    search?: string;
    difficulty?: QuestionDifficulty;
    type?: QuestionType;
    category?: string;
    page: number;
    limit: number;
}

export interface PaginatedQuestionDTO {
    questions: GetAllQuestionsOutputDTO[];
    totalPages: number;
    totalCount: number
}