import { CategoryEntity } from "../../../../Domain/entities/Category.entity";

export interface CandidateGetAllCategoriesInputDTO {
    token: string
}


export interface CandidateGetAllCategoriesOutputDTO {
    categories: CategoryEntity[]
}