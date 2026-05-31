import { useCallback, useEffect, useRef, useState } from "react"
import type { CodingLanguage } from "../types/test"
import { socket } from "../lib/socket"


interface UseCodeCollaborationProps {
    roomId: string
    initialLanguage?: CodingLanguage
}

export const useCodeCollaboration = ({roomId, initialLanguage = 'javascript'}: UseCodeCollaborationProps) => {
    const [code, setCode] = useState('')
    const [language, setLanguage] = useState(initialLanguage)

    const codeRef = useRef(code)
    const languageRef = useRef(language)

    useEffect(() => {
        languageRef.current = language
    }, [language])

    const updateCode = useCallback((newCode: string, newLanguage: CodingLanguage = languageRef.current) => {
        setCode(newCode)
        setLanguage(newLanguage)

        const payload = {
            roomId,
            code: newCode,
            language: newLanguage,
            timeStamp: Date.now()
        }
        console.log('Emitting code change: ', payload.language)
        socket.emit('code-change', payload)

    }, [roomId])

    const updateLanguage = useCallback((newLanguage: CodingLanguage) => {
        setLanguage(newLanguage)
        const payload = {
            roomId,
            code: codeRef.current,
            language: newLanguage,
            timeStamp: Date.now()
        }

        console.log('emitting language change', newLanguage)
        socket.emit('code-change', payload)
    }, [roomId])

    useEffect(() => {
        const handleRemoteCodeChange = (data: {
            code: string;
            language: CodingLanguage;
            timeStamp: number
        }) => {
            console.log('incoming code change recieved: ', data.language)

            if(data.code !== codeRef.current){
                setCode(data.code)
            }
            if(data.language !== languageRef.current){
                setLanguage(data.language)
            }
        }

        socket.on('code-change', handleRemoteCodeChange)

        return () => {
            socket.off('code-change', handleRemoteCodeChange)
        }
    }, [])

    return {
        code,
        language,
        updateCode,
        updateLanguage
    }
}