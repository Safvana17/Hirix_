import { useCallback, useEffect, useRef, useState } from "react";
import type { CandidateTest, CodingLanguage, TestCandidate, TestCandidateAnswer, TestQuestions, TestRules, ViolationType } from "../types/test";
import { useTabSwitchMonitor } from "./useTabSwitchMonitor";
import { useAutosave } from "./useAutoSave";
import { useFullScreenMonitor } from "./useFullScreenMonitor";
import { useBehaviourRules } from "./useBahaviourRules";
import { useTestTimer } from "./useTestTimer";


export type RunTimeAnswers = Record<string, TestCandidateAnswer>

interface useTestRunTimeProps {
    test: CandidateTest
    rules: TestRules
    candidate: TestCandidate
    onSaveAnswers: (answers: RunTimeAnswers) => Promise<void>
    onSubmitTest: (answers: RunTimeAnswers) => Promise<void>
    onTerminateTest: (
        reason: ViolationType,
        answers: RunTimeAnswers
    ) => Promise<void>
    onWarning?: (datas: {
        type: ViolationType
        warningCount: number
    }) => Promise<void> | void
}
export function useTestRunTime ({
    test,
    rules,
    candidate,
    onSaveAnswers,
    onSubmitTest,
    onTerminateTest,
    onWarning
}: useTestRunTimeProps) {
    const [answers, setAnswers] = useState<RunTimeAnswers>(() => buildInitialAnswers(candidate))
    const [warningCount, setWarningCount] = useState(candidate.warningCount ?? 0)
    // const [timeLeftInSeconds, setTimeLeftInSeconds] = useState(() => getInitialTimeLeft(test))
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isTerminating, setIsTerminating] = useState(false)

    const answerRef = useRef<RunTimeAnswers>(answers)
    const isSubmittingRef = useRef(false)
    const isTerminatingRef = useRef(false)
    const warningCountRef = useRef(candidate.warningCount ?? 0);
    const currentQuestionStartTimeRef = useRef(Date.now())
    const currentQuestionIdRef = useRef<string | null>(null)
    const isDirtyRef = useRef(false)
    const isSavingRef = useRef(false)

    useEffect(() => {
        answerRef.current = answers
    }, [answers])

    useEffect(() => {
    console.log("useTestRunTime initialized");
}, []);

    const saveAnswers = useCallback( async () => {
        if(!isDirtyRef.current) return
        if(isSavingRef.current) return
        try {
            isSavingRef.current = true
            await onSaveAnswers(answerRef.current)
            isDirtyRef.current  = false
        } finally {
            isSavingRef.current = false
        }
    }, [onSaveAnswers])

    const updateAnswer = useCallback(({
        question,
        value,
        language,
        output
    }: {
        question: TestQuestions
        value: string
        language?: CodingLanguage
        output?: string
    }) => {
        isDirtyRef.current = true
        setAnswers((prev) => {
            const oldAnswer = prev[question.id]
            const baseAnswer: TestCandidateAnswer = {
               testQuestionId: question.id,
               questionType: question.type,
               timeTakenInSeconds: oldAnswer?.timeTakenInSeconds ?? 0,
               totalMarks: question.mark,
               isMarkedForReview: oldAnswer?.isMarkedForReview ?? false,
               visited: true,
               answeredAt: new Date().toISOString(),
            }

            if(question.type === 'mcq'){
                baseAnswer.selectedOptionIds = value ?[ value ]: []
            }
            if(question.type === 'descriptive') {
                baseAnswer.descriptiveAnswer = value
            }
            if(question.type === 'coding'){
                baseAnswer.codingAnswer = {
                    language: language ?? 'javascript',
                    code: value,
                    output
                }
            }
            return {
                ...prev,
                [question.id]: baseAnswer
            }
        })
    }, [])

    const markQuestionVisited = useCallback((question: TestQuestions) => {
        setAnswers((prev) => {
            const oldAnswer = prev[question.id]
            return{
                ...prev,
                [question.id]: {
                    testQuestionId: question.id,
                    questionType: question.type,
                    timeTakenInSeconds: oldAnswer?.timeTakenInSeconds ?? 0,
                    totalMarks: question.mark,
                    isMarkedForReview: oldAnswer?.isMarkedForReview ?? false,
                    visited: true,
                    selectedOptionIds: oldAnswer?.selectedOptionIds,
                    descriptiveAnswer: oldAnswer?.descriptiveAnswer,
                    codingAnswer: oldAnswer?.codingAnswer
                }
            }
        })
    }, [])

    const toggleMarkForReview = useCallback((question: TestQuestions) => {
        setAnswers((prev) => {
            const oldAnswer = prev[question.id]
            return{
                ...prev,
                [question.id]: {
                    testQuestionId: question.id,
                    questionType: question.type,
                    timeTakenInSeconds: oldAnswer?.timeTakenInSeconds ?? 0,
                    totalMarks: question.mark,
                    isMarkedForReview: !(oldAnswer?.isMarkedForReview ?? false),
                    visited: true,
                    answeredAt: new Date().toISOString(),
                    selectedOptionIds: oldAnswer?.selectedOptionIds,
                    descriptiveAnswer: oldAnswer?.descriptiveAnswer,
                    codingAnswer: oldAnswer?.codingAnswer,
                    
                }
            }
        })
    }, [])

    const trackQuestionTime = useCallback((questionId: string) => {
        const now = Date.now()
        if(currentQuestionIdRef.current){
            const spendSeconds = Math.floor((now - currentQuestionStartTimeRef.current) / 1000)
            setAnswers((prev) => {
                const existing = prev[currentQuestionIdRef.current!]
                if(!existing) return prev

                return {
                    ...prev,
                    [currentQuestionIdRef.current!]: {
                        ...existing,
                        timeTakenInSeconds: existing.timeTakenInSeconds + spendSeconds
                    }
                }
            })
        }

        currentQuestionIdRef.current = questionId
        currentQuestionStartTimeRef.current = now
    }, [])

    const handleSubmit = useCallback( async () => {
        if( isSubmittingRef.current || isTerminatingRef.current) return

        try {
            isSubmittingRef.current = true
            setIsSubmitting(true)
            await saveAnswers()
            await onSubmitTest(answerRef.current)
        } finally {
            isSubmittingRef.current = false
            setIsSubmitting(false)
       }
    }, [onSubmitTest, saveAnswers])

    const handleTerminate = useCallback( async(reason: ViolationType) => {
        if(isTerminatingRef.current || isSubmittingRef.current) return

        try{
            isTerminatingRef.current = true
            setIsTerminating(true)
            await saveAnswers()
            await onTerminateTest(reason, answerRef.current)
        }finally {
            isTerminatingRef.current = false
            setIsTerminating(false)
        }
    }, [onTerminateTest, saveAnswers])

    // const handleViolation = useCallback( async (type: ViolationType) => {
    //     setWarningCount((prev) => {
    //         const nextCount = prev + 1
    //         onWarning?.({
    //             type,
    //             warningCount: nextCount
    //         })
    //         if(rules.warning.autoSubmitOnMaxWarnings && nextCount >= rules.warning.maxWarningCount) {
    //             void handleTerminate(type)
    //         }
    //         return nextCount
    //     })
    // }, [onWarning, handleTerminate, rules.warning.autoSubmitOnMaxWarnings, rules.warning.maxWarningCount])

    const handleViolation = useCallback(
    async (type: ViolationType) => {
        warningCountRef.current += 1
        const nextCount = warningCountRef.current
        console.log("[VIOLATION] counted", { type, nextCount})
        setWarningCount(nextCount)
        onWarning?.({type,warningCount: nextCount,})
        if ( rules.warning.autoSubmitOnMaxWarnings && nextCount >= rules.warning.maxWarningCount) {
          void handleTerminate(type);
        }
    },
    [
        onWarning,
        handleTerminate,
        rules.warning.autoSubmitOnMaxWarnings,
        rules.warning.maxWarningCount,
    ]
    )

    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         const remaining = getInitialTimeLeft(test)
    //         setTimeLeftInSeconds(remaining)

    //         if(remaining <= 0){
    //             clearInterval(interval)

    //             void handleSubmit()
    //         }
    //     }, 1000)

    //     return () => clearInterval(interval)
    // }, [test, handleSubmit])

    useAutosave({
        enabled: rules.autoSave.enabled,
        intervalInSeconds: rules.autoSave.intervalInSeconds,
        onSave: saveAnswers
    })

    useFullScreenMonitor({
        enforceFullScreen: rules.behavior.enforceFullScreen,
        onExit: () => {
            void handleViolation('FULLSCREEN_EXIT')
        },
    })

    useTabSwitchMonitor({
        allowTabSwitch: rules.navigation.allowTabSwitch,
        onViolation: () => {
            void handleViolation('TAB_SWITCH')
        },
    })

    useBehaviourRules({
        allowCopyPaste: rules.behavior.allowCopyPaste,
        allowRightClick: rules.behavior.allowRightClick,
        allowKeyboardShortcuts: rules.behavior.allowKeyboardShortcuts
    })
    
    useTestTimer({
        endTime: test.endTime,
        autoSubmitOnTimeEnd: test.rules.timing.autoSubmitOnTimeEnd,
        warningBeforeEndInMinutes: test.rules.timing.warningBeforeEndInMinutes,
        onAutoSubmit: () => {
            handleSubmit()
        }
    })
    return {
        answers,
        warningCount,
        // timeLeftInSeconds,
        isSubmitting,
        isTerminating,
        updateAnswer,
        markQuestionVisited,
        toggleMarkForReview,
        saveAnswers,
        handleSubmit,
        handleTerminate,
        handleViolation,
        trackQuestionTime
    }
}

function buildInitialAnswers(candidate: TestCandidate): RunTimeAnswers {
    const result: RunTimeAnswers = {}

    candidate.candidateAnswers?.forEach((answer) => {
        result[answer.testQuestionId] = {
            testQuestionId: answer.testQuestionId,
            questionType: answer.questionType,
            timeTakenInSeconds: answer.timeTakenInSeconds ?? 0,
            selectedOptionIds: answer.selectedOptionIds,
            descriptiveAnswer: answer.descriptiveAnswer,
            codingAnswer: answer.codingAnswer as | TestCandidateAnswer['codingAnswer'] | undefined,
            totalMarks: answer.totalMarks,
            answeredAt: undefined,
            visited: true
        }
    })
    return result
}

// function getInitialTimeLeft(test: CandidateTest): number {
//     const endTime = new Date(test.endTime).getTime()
//     return Math.max(0, Math.floor((endTime - Date.now())/ 1000))  
// }
