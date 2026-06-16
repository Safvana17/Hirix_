import { useEffect, useRef, useState } from "react"

export function useCamera ({
    enableCamera,
    captureSnapshots,
    snapshotInterval = 60000,
    onSnapshot
}: {
    enableCamera: boolean
    captureSnapshots: boolean
    snapshotInterval: number
    onSnapshot?: (file: Blob) => Promise<void> 
}) {
    const videoRef = useRef<HTMLVideoElement | null>(null)
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const [cameraError, setCameraError] = useState<string | null>(null)

    useEffect(() => {
        if(!enableCamera) return

        let stream: MediaStream
        let intervalId: ReturnType<typeof setInterval>

        const startCamera = async () => {
            try {
                stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: false
                })
                if(videoRef.current){
                    videoRef.current.srcObject = stream
                }

                if(captureSnapshots && onSnapshot ) {
                    intervalId = setInterval( async () => {
                        if(!videoRef.current || !canvasRef.current || !onSnapshot){
                            return
                        }
                        const video = videoRef.current
                        const canvas = canvasRef.current

                        canvas.height = video.videoHeight
                        canvas.width = video.videoWidth

                        const ctx = canvas.getContext("2d")
                        if(!ctx) return

                        ctx.drawImage(video, 0, 0)

                        canvas.toBlob( async (blob) => {
                            if(!blob) return

                            try {
                                await onSnapshot(blob)
                            } catch (error) {
                                console.log("Snapshot upload failed", error)
                            }
                        }, "image/jpeg", 0.8)
                    }, snapshotInterval)
                }

            } catch {
                setCameraError("Camera permission is required to attend this test.")
            }
        }

        startCamera()

        return () => {
            clearInterval(intervalId)
            stream?.getTracks().forEach(track => track.stop())
        }
    }, [enableCamera, captureSnapshots, onSnapshot, snapshotInterval])

    return {
        videoRef,
        canvasRef,
        cameraError
    }
}