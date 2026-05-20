import { ICodeRunnerService } from "../../Application/interface/service/IcodeRunnerService";
import { ITestCodeRunService } from "../../Application/interface/service/ITestCodeRunService";
import { CodingLanguage } from "../../Domain/enums/Test";

export class TestCodeRunService implements ITestCodeRunService{
    constructor(
        private _codeRunner: ICodeRunnerService
    ) {}

    async runTestCases(input: { functionName: string; language: CodingLanguage; sourceCode: string; testCases: { input?: unknown[]; expectedOutput: string; }[]; }): Promise<{ feedback: string; }> {
        const totalTestCases = input.testCases.length
        if(!input.functionName.trim()) {
        return {
            feedback: "Function name is missing"
        }
        }
        if(totalTestCases === 0){
        return {
            feedback: "No test cases available for evaluation"
        }
        }
        let passedCount = 0
        for(const testCase of input.testCases){
            const args = testCase.input ?? []
            const serializeArgs = args.map((arg) => JSON.stringify(arg)).join(",")
            let executableCode = input.sourceCode
            if(input.language === CodingLanguage.JAVASCRIPT){
                executableCode = `
                ${input.sourceCode}

                const result = ${input.functionName}(${serializeArgs});
                console.log(typeof result === "object" ? JSON.stringify(result) : result)
                `
            }

            console.log("========== TEST CASE ==========")
            console.log("FUNCTION:", input.functionName)
            console.log("ARGS:", JSON.stringify(testCase.input ?? []))
            console.log("EXPECTED:", JSON.stringify(testCase.expectedOutput))
            console.log("EXECUTABLE CODE:\n", executableCode)

            const result = await this._codeRunner.runCode({
                language: input.language,
                sourceCode: executableCode,
            })
            console.log("STDOUT:", JSON.stringify(result.stdout))
            console.log("STDERR:", JSON.stringify(result.stderr))
            console.log("ERROR:", result.error)

            if(result.error || result.stderr){
                return {
                feedback: result.error || result.stderr || "Code execution failed"
                }
            }
            const actualOutput = result.stdout.trim()
            const expectedOutput = testCase.expectedOutput.trim()
            // console.log("ACTUAL TRIM:", JSON.stringify(actualOutput))
            // console.log("EXPECTED TRIM:", JSON.stringify(expectedOutput))
            // console.log("PASSED:", actualOutput === expectedOutput)
            if(actualOutput === expectedOutput){
                passedCount++
            }
        }
        return {
            feedback: `${passedCount} / ${totalTestCases} passes`
        }
    }
}