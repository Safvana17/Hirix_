import { useCallback, useEffect, useState } from "react"
import type { Message } from "../types/interview"
import { socket } from "../lib/socket"

interface UseChatProps {
    roomId: string
    userId: string
    userName: string
}

export const useChat = ({roomId, userId, userName}: UseChatProps) => {
    const [message, setMessage] = useState<Message[]>([])

    const sendMessage = useCallback((text: string) => {
        if(!text.trim()) return
        const messageData = {
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            roomId,
            senderId: userId,
            senderName: userName,
            text,
            timeStamp: Date.now()
        }

        console.log("Sending chat message: ", messageData)

        socket.emit('chat-message', messageData)

        setMessage((prev) => [...prev, {
            id: messageData.id,
            senderId: messageData.senderId,
            senderName: messageData.senderName,
            text: messageData.text,
            timeStamp: messageData.timeStamp,
            isMe: true
        }])
    }, [roomId, userId, userName])

    useEffect(() => {
        const handleIncomingMessage = (data: {
            id: string;
            senderId: string;
            senderName: string;
            text: string;
            timeStamp: number;
        }) => {
            console.log('incoming chat message received: ', data)

            setMessage((prev) => {
                const exist = prev.some((msg) => msg.id === data.id)
                if(exist) return prev
                return [
                    ...prev,
                    {
                        id: data.id,
                        senderId: data.senderId,
                        senderName: data.senderName,
                        text: data.text,
                        timeStamp: data.timeStamp,
                        isMe: data.senderId === userId
                    }
                ]
            })
        }
        socket.on('chat-message', handleIncomingMessage)

        return () => {
            socket.off('chat-message', handleIncomingMessage)
        }
    })

    return {
        message,
        sendMessage
    }
}