import { QuestionEntity } from "../../../../Domain/entities/Question.entity";
import QuestionDifficulty from "../../../../Domain/enums/questionDifficulty";
import QuestionType from "../../../../Domain/enums/questionType";


export interface CandidateGetAllPracticeQuestionsInputDTO{
    candidateId: string;
    search?: string;
    difficulty?: QuestionDifficulty;
    type?: QuestionType;
    category?: string;
    page: number;
    limit: number;
}

export interface CandidatePaginatedPracticeQuestionDTO {
    practiceQuestions: QuestionEntity[];
    totalPages: number;
    totalCount: number
}

