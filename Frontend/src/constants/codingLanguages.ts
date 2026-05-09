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

console.log(solution(input))`,
    },
    {
        label: 'Python',
        value: 'python',
        extension: 'py',
        defaultCode: `def solution(input_data):
    # Write your code here
    return input_data


print(solution(input_data))`,
    },
] as const