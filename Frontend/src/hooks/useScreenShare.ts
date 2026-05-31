import { useCallback, useEffect, useRef, useState } from "react"

interface UseScreenShareProps {
    getPeerConnection: () => RTCPeerConnection | null
    localStream: MediaStream | null
    localVideoRef: React.RefObject<HTMLVideoElement | null>
}


export const useScreenShare = ({
    getPeerConnection, 
    localStream, 
    localVideoRef
}: UseScreenShareProps) => {
    const [isScreenSharing, setIsScreenSharing] = useState(false)
    const screenStreamRef = useRef<MediaStream | null>(null)

    const stopScreenShare = useCallback(() => {
        if(!screenStreamRef.current) return

        screenStreamRef.current?.getTracks().forEach(track => track.stop())
        screenStreamRef.current = null

        const peerConnection = getPeerConnection()
        if(peerConnection && localStream) {
            const cameraTrack = localStream.getVideoTracks()[0]
            const videoSender = peerConnection.getSenders().find((sender) => sender.track?.kind === 'video')

            if(videoSender && cameraTrack){
                videoSender.replaceTrack(cameraTrack).catch(console.error)
            }
        }

        if(localVideoRef.current && localStream){
            localVideoRef.current.srcObject = localStream
        }

        setIsScreenSharing(false)
    }, [getPeerConnection, localStream, localVideoRef])

    const startScreenShare = useCallback(async () => {
        if(isScreenSharing) return

        try {
            const screenStream = await navigator.mediaDevices.getDisplayMedia({
                video: true,
                audio: false
            })
            const screenTrack = screenStream.getVideoTracks()[0]
            if(!screenTrack) return
            screenStreamRef.current = screenStream
            const peerConnection = getPeerConnection()

            if(peerConnection) {
                const videoSender = peerConnection.getSenders().find((sender) => sender.track?.kind === 'video')
                if(videoSender) {
                    await videoSender.replaceTrack(screenTrack)
                }
            }

            if(localVideoRef.current) {
                localVideoRef.current.srcObject = screenStream
            }

            screenTrack.onended = () => stopScreenShare()
            setIsScreenSharing(true)
        } catch (error) {
            console.error('screeshare failed to start', error)
        }
    }, [isScreenSharing, getPeerConnection, localVideoRef, stopScreenShare])

    useEffect(() => {
        return () => {
            screenStreamRef.current?.getTracks().forEach(track => track.stop())
        }
    }, [])
    return {
        startScreenShare,
        stopScreenShare,
        isScreenSharing
    }
}