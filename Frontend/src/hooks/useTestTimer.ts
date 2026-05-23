import { useCallback, useEffect, useRef, useState } from "react"


export function useTestTimer({
    endTime,
    autoSubmitOnTimeEnd,
    warningBeforeEndInMinutes,
    onAutoSubmit
}: {
    endTime: string | Date
    autoSubmitOnTimeEnd: boolean
    warningBeforeEndInMinutes: number
    onAutoSubmit: () => void | Promise<void>
}) {
    const showWarningRef = useRef(false)
    const autoSubmittedRef = useRef(false)

    const calculateReminingSeconds = useCallback(() => {
        const end = new Date(endTime).getTime()
        return Math.max(0, Math.floor((end - Date.now())/ 1000 ))
    }, [endTime])

    const [reminingSeconds, setReminingSeconds] = useState( calculateReminingSeconds )
    useEffect(() => {
        const interval = setInterval(() => {
            const remaining = calculateReminingSeconds()
            setReminingSeconds(remaining)
            if(remaining <= 0 && autoSubmitOnTimeEnd && !autoSubmittedRef.current){
                autoSubmittedRef.current = true
                onAutoSubmit()
            }
        }, 1000)

        return () => clearInterval(interval)
    }, [endTime, autoSubmitOnTimeEnd, onAutoSubmit, calculateReminingSeconds])

    useEffect(() => {
        const warningSeconds = warningBeforeEndInMinutes * 60
        if(reminingSeconds <= warningSeconds && warningBeforeEndInMinutes && !showWarningRef.current){
            showWarningRef.current = true
            alert(`Only ${warningBeforeEndInMinutes} minutes left`)
        }
    }, [reminingSeconds, warningBeforeEndInMinutes])

    return {
        reminingSeconds
    }
}