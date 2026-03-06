import ICandidateRepository from "../../../../Domain/repositoryInterface/iCandidate.repository";
import { IHashService } from "../../../interface/service/IHashService";
import { ICandidateLogoutUsecase } from "../../interfaces/auth/ICandidateLogoutUsecase";

export class CandidateLogoutUsecase implements ICandidateLogoutUsecase {
      constructor(
        private _candidateRepository: ICandidateRepository,
        private _hashService: IHashService
      ) {}

      async execute(refreshToken: string): Promise<void> {
          if(!refreshToken) return 

          const hashedRefreshToken = this._hashService.hashToken(refreshToken)
          await this._candidateRepository.revokeRefreshToken(hashedRefreshToken)
      }
}