import userRole from "../../../../Domain/enums/userRole.enum";

export interface CompanyDeleteQuestionInputDTO {
    id: string;
    user: {
        id: string;
        role: userRole
    }
}

export interface CompanyDeleteQuestionOutputDTO {
    id: string;
}