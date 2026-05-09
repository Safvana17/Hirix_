export type CodingLanguages = 'javascript' | 'python'

export const CODING_LANGUAGES = [
    {
        label: 'JavaScript',
        value: 'javascript',
        extension: 'js',
        defaultCode: `function solution(input) {
        // Write your code here
        return input
        }
        
        const fs = require("fs")
        const input = fs.readFileSync(0, "utf-8").trim()
        
        console.log(solution(input))`,
    },
    {
        label: 'Python',
        value: 'python',
        extension: 'py',
        defaultCode: `def solution(input_data):
        #write your code here
        
        return input_data
        
        import sys
        input_data = sys.stdin.read().strip()
        
        print(solution(input_data))`,
    },
] as const