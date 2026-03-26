import ICompanyRepository from "../../../../Domain/repositoryInterface/iCompany.repository";
import { IHashService } from "../../../interface/service/IHashService";
import { ICompanyLogoutUsecase } from "../../interfaces/auth/ICompanyLogoutUsecase";

export class CompanyLogoutUsecase implements ICompanyLogoutUsecase {
      constructor(
        private _companyRepository: ICompanyRepository,
        private _hashService: IHashService
      ) {}

      async execute(refreshToken: string): Promise<void> {
          if(!refreshToken) return 

          const hashedRefreshToken = this._hashService.hashToken(refreshToken)
          await this._companyRepository.revokeRefreshToken(hashedRefreshToken)
      }
}