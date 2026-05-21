import { useEffect } from "react";

export function useBehaviourRules({
    allowCopyPaste,
    allowRightClick,
    allowKeyboardShortcuts
}: {
    allowCopyPaste: boolean;
    allowRightClick: boolean;
    allowKeyboardShortcuts: boolean
}) {
    useEffect(() => {
        const prevent = (e: Event) => e.preventDefault()

        const handleKeyDown = (e: KeyboardEvent) => {
            if(!allowKeyboardShortcuts){
                if(e.ctrlKey || e.metaKey || e.key === 'F12' || e.key === 'Escape'){
                    e.preventDefault()
                }
            }
        }

        if(!allowCopyPaste) {
            document.addEventListener("copy", prevent)
            document.addEventListener("paste", prevent)
            document.addEventListener("cut", prevent)
        }
        if(!allowRightClick){
            document.addEventListener("contextmenu", prevent)
        }
        document.addEventListener("keydown", handleKeyDown)

        return () => {
            document.removeEventListener('copy', prevent)
            document.removeEventListener('paste', prevent)
            document.removeEventListener('cut', prevent)
            document.removeEventListener('contextmenu', prevent)
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [allowCopyPaste, allowKeyboardShortcuts, allowRightClick])
}