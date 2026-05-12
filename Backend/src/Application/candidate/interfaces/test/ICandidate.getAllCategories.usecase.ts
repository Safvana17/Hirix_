import { CandidateGetAllCategoriesInputDTO, CandidateGetAllCategoriesOutputDTO } from "../../dtos/test/candidate.getAllCategories.dto";

export interface ICandidateGetAllCategoriesUsecase {
    execute(request: CandidateGetAllCategoriesInputDTO):Promise<CandidateGetAllCategoriesOutputDTO>
}