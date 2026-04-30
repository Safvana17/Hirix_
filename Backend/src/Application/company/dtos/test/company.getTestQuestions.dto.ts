import { QuestionEntity } from "../../../../Domain/entities/Question.entity";
import QuestionDifficulty from "../../../../Domain/enums/questionDifficulty";
import QuestionType from "../../../../Domain/enums/questionType";

export interface CompanyGetAllQuestionsForTestInputDTO{
    difficulty?: QuestionDifficulty;
    type?: QuestionType;
    category?: string;
    companyId: string;
}

export interface CompanyGetAllQuestionsForTestOutputDTO {
    questions: QuestionEntity[]
}