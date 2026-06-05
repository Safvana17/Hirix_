import { useCallback, useEffect, useRef, useState } from "react"
import { socket } from "../lib/socket"

interface UseScreenShareProps {
    roomId: string
    getPeerConnection: () => RTCPeerConnection | null
    localStream: MediaStream | null
    localVideoRef: React.RefObject<HTMLVideoElement | null>
    renegotiate: () => Promise<void>
}


export const useScreenShare = ({
    roomId,
    getPeerConnection, 
    localStream, 
    localVideoRef,
    renegotiate
}: UseScreenShareProps) => {
    const [isScreenSharing, setIsScreenSharing] = useState(false)
    const screenStreamRef = useRef<MediaStream | null>(null)

    const notifyScreenShareState = useCallback((active: boolean) => {
        socket.emit('screen-share-state', { roomId, active})
        console.log('Emitted screen sharing state', {active})
    }, [roomId])

    const stopScreenShare = useCallback(async() => {
        if(!screenStreamRef.current) return

        screenStreamRef.current?.getTracks().forEach(track => track.stop())
        screenStreamRef.current = null

        const peerConnection = getPeerConnection()
        if(peerConnection && localStream) {
            const cameraTrack = localStream.getVideoTracks()[0]
            const videoSender = peerConnection.getSenders().find((sender) => sender.track?.kind === 'video')

            if(videoSender && cameraTrack){
                await videoSender.replaceTrack(cameraTrack)
                console.log('restored camera track on peer connection')
                await renegotiate()
                // videoSender.replaceTrack(cameraTrack).catch(console.error)
            }
        }

        if(localVideoRef.current && localStream){
            localVideoRef.current.srcObject = localStream
            try {
                await localVideoRef.current.play()
            } catch (error) {
                console.log('autoplay may be blocked until user gesture',error)
            }
        }

        setIsScreenSharing(false)
        notifyScreenShareState(false)
    }, [getPeerConnection, localStream, localVideoRef, renegotiate, notifyScreenShareState])

    const startScreenShare = useCallback(async () => {
        if(isScreenSharing) return

        try {
            console.log('start screen sharing')
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
                    console.log('Replaced video sender with screen track')
                    await renegotiate()
                }else{
                    console.log('no video sender found for screen share')
                    screenTrack.stop()
                    return
                }
            }else{
                console.log('no peer connection when starting screen share')
                screenTrack.stop()
                return
            }

            if(localVideoRef.current) {
                localVideoRef.current.srcObject = screenStream
                try{
                    await localVideoRef.current.play()
                }catch{
                    console.log('from screen share')
                }
            }

            screenTrack.onended = () => stopScreenShare()
            setIsScreenSharing(true)
            notifyScreenShareState(true)
        } catch (error) {
            console.error('screeshare failed to start', error)
        }
    }, [isScreenSharing, getPeerConnection, localVideoRef, stopScreenShare, notifyScreenShareState, renegotiate])

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