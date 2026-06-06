import { logger } from "../../../utils/logging/loger";
import { ICodeRunnerService } from "../../interface/service/IcodeRunnerService";
import { UnifiedRunInterviewCodeInpuDTO, UnifiedInterviewCodeRunnerOutputDTO } from "../dtos/unified.runInterviewCode.dto";
import { IUnifiedRunInterviewCodeUsecase } from "../interfaces/IUnified.runInterviewCode.usecase";

export class UnifiedInterviewCodeRunnerUsecase implements IUnifiedRunInterviewCodeUsecase{
    constructor(
        private _codeRunnerService: ICodeRunnerService
    ) {}

    async execute(request: UnifiedRunInterviewCodeInpuDTO): Promise<UnifiedInterviewCodeRunnerOutputDTO> {
        const result = await this._codeRunnerService.runCode({language: request.language, sourceCode: request.sourceCode, input: request.input})
        logger.info({result: result}, 'from code runner usecase')
        return {
            error: result.error,
            stderr: result.stderr,
            stdout: result.stdout,
            exitCode: result.exitCode
        }
    }
}