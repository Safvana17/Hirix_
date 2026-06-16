import { CompanyViewSnapshotInputDTO, CompanyViewSnapshotOutputDTO } from "../../dtos/test/company.viewSnapshots.dto";

export interface ICompanyViewSnapshotsUsecase {
    execute(request: CompanyViewSnapshotInputDTO): Promise<CompanyViewSnapshotOutputDTO>
}