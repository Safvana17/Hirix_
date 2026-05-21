import { useEffect } from "react";


export function useAutosave({
    enabled,
    intervalInSeconds,
    onSave
}: {
    enabled: boolean;
    intervalInSeconds: number
    onSave: () => Promise<void>
}) {
    useEffect(() => {
        if(!enabled) return 

        const interval = setInterval(() => {
            console.log("saving...")
            onSave()
        }, intervalInSeconds * 1000)

        return () => clearInterval(interval)
    }, [enabled, onSave, intervalInSeconds])
}