import QuestionDifficulty from "../enums/questionDifficulty";
import QuestionType from "../enums/questionType";
import QuestionVisibility from "../enums/questionVisibility";
import userRole from "../enums/userRole.enum";
import { TestCase } from "../interfaces/question.testCase";

export class QuestionEntity {
    id: string;
    title: string;
    description: string;
    type: QuestionType;
    options?: string[];
    testCases?: TestCase[];
    difficulty: QuestionDifficulty;
    categoryId: string;
    createdBy: userRole
    createdById?: string | null;
    visibility: QuestionVisibility;
    isPremium: boolean;
    isPractice: boolean;
    isDeleted: boolean;
    answer?: string

    constructor (
        id: string,
        title: string,
        description: string,
        type: QuestionType,
        difficulty: QuestionDifficulty,
        categoryId: string,
        createdBy: userRole,
        visibility: QuestionVisibility,
        isPremium: boolean,
        isPractice: boolean,
        isDeleted: boolean,
        answer?: string,
        options?: string[],
        testCases?: TestCase[],
        createdById?: string | null
    ) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.type = type;
        this.difficulty = difficulty;
        this.categoryId = categoryId;
        this.createdBy = createdBy;
        this.createdById = createdById;
        this.visibility = visibility;
        this.isPremium = isPremium;
        this.isPractice = isPractice;
        this.isDeleted = isDeleted;
        this.answer = answer;
        this.options = options;
        this.testCases = testCases;
    }
    
}