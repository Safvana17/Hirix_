import { CodeRunnerRequest, CodeRunnerResult, ICodeRunnerService } from "../../Application/interface/service/IcodeRunnerService";
import { LANGUAGE_CONFIG } from "../config/codeRunner.config";
import crypto from 'crypto'
import path from 'path'
import fs from 'fs/promises'
import os from 'os'
import { AppError } from "../../Domain/errors/app.error";
import { TestMessages } from "../../Shared/constsnts/messages/testMessages";
import { statusCode } from "../../Shared/Enumes/statusCode";
import { execFile } from "child_process";
import { promisify } from "util";

const execFileAsync = promisify(execFile)


export class DockerCodeRunnerService implements ICodeRunnerService {

    async runCode(request: CodeRunnerRequest): Promise<CodeRunnerResult> {

        const config = LANGUAGE_CONFIG[request.language]
        const runId = crypto.randomUUID()
        const tempDir = path.join(os.tmpdir(), 'hirix-code-runs', runId)
        const codeFilePath = path.join(tempDir, config.fileName)
        const inputFilePath = path.join(tempDir, 'input.txt')
 
        try {
            await fs.mkdir(tempDir, { recursive: true })
            await fs.writeFile(codeFilePath, request.sourceCode)
            await fs.writeFile(inputFilePath, request.input || '')

            const dockerArgs = [
                'run',
                '--rm',

                '--network',
                'none',
                '--memory',
                '128m',
                '--cpus',
                '0.5',
                '--pids-limit',
                '64',
                '--read-only',

                '--tmpfs',
                '/tmp:rw,size=64m',

                '-v',
                `${tempDir}:/app:ro`,

                config.image,
                'sh',
                '-c',
                this.getRunCommand(request.language)
            ]

            const { stdout, stderr } = await execFileAsync(
                'docker',
                dockerArgs,
                {
                    timeout: 7000,
                    maxBuffer: 1024 * 1024
                }
            )

            return { 
                stdout,
                stderr,
                error: null,
                exitCode: 0
            }
        } catch (error) {
            const err = error as Error & {
                stdout?: string
                stderr?: string
                code?: number
                killed?: boolean
                signal?: string
            }

            return {
                stdout: err.stdout || '',
                stderr: err.stderr || '',
                error: err.killed 
                   ? 'Execution timed out'
                   : err.message || 'Execution failed',
                exitCode: typeof err.code === 'number' ? err.code : null
            }
        } finally {
            await fs.rm(tempDir, { recursive: true, force: true })
        }
    }

    private getRunCommand(language: CodeRunnerRequest['language']): string {
        if(language === 'javascript') {
            return 'node /app/main.js < /app/input.txt'
        }
        if(language === 'python'){
            return 'python /app/main.py < /app/input.txt'
        }

        throw new AppError(TestMessages.error.UNSUPPORTED_LANGUAGE, statusCode.BAD_REQUEST)
    }
}