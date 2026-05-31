import { useEffect, useRef, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { socket } from '../lib/socket';

interface UseWebRTCOptions {
  roomId: string;
  userId: string;
  userName: string;
  role: 'Company' | 'Candidate';
  enabled?: boolean;
  onInterviewEnded?: () => void;
  onUserLeft?: () => void;
}

export const useWebRTC = ({
  roomId,
  userId,
  userName,
  role,
  enabled = true,
  onInterviewEnded,
  onUserLeft,
}: UseWebRTCOptions) => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [remoteConnected, setRemoteConnected] = useState(false);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [micEnabled, setMicEnabled] = useState(true);
  const [remoteCameraEnabled, setRemoteCameraEnabled] = useState(true);
  const [remoteMicEnabled, setRemoteMicEnabled] = useState(true);
  const [waitingForPeer, setWaitingForPeer] = useState(true);
  const [roomFull, setRoomFull] = useState(false);

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const iceCandidateQueueRef = useRef<RTCIceCandidateInit[]>([]);
  const onInterviewEndedRef = useRef(onInterviewEnded);
  const onUserLeftRef = useRef(onUserLeft);

  useEffect(() => {
    onInterviewEndedRef.current = onInterviewEnded;
    onUserLeftRef.current = onUserLeft;
  }, [onInterviewEnded, onUserLeft]);

  const rtcConfig: RTCConfiguration = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
    ],
  };

  const getPeerConnection = useCallback(() => peerConnectionRef.current, []);

  const processIceCandidateQueue = useCallback(async (pc: RTCPeerConnection) => {
    for (const candidate of iceCandidateQueueRef.current) {
      try {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (error) {
        console.error('[WebRTC] Failed to add queued ICE candidate', error);
      }
    }
    iceCandidateQueueRef.current = [];
  }, []);

  const cleanupPeerConnection = useCallback(() => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.ontrack = null;
      peerConnectionRef.current.onicecandidate = null;
      peerConnectionRef.current.onconnectionstatechange = null;
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    setRemoteConnected(false);
    setRemoteStream(null);
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
    iceCandidateQueueRef.current = [];
  }, []);

  const stopLocalMedia = useCallback(() => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }
    setLocalStream(null);
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
  }, []);

  const createPeerConnection = useCallback((): RTCPeerConnection => {
    if (peerConnectionRef.current) {
      return peerConnectionRef.current;
    }

    const pc = new RTCPeerConnection(rtcConfig);

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('ice-candidate', { roomId, candidate: event.candidate });
      }
    };

    pc.onconnectionstatechange = () => {
      const state = pc.connectionState;
      if (state === 'connected') {
        setRemoteConnected(true);
        setWaitingForPeer(false);
      } else if (state === 'disconnected' || state === 'failed' || state === 'closed') {
        setRemoteConnected(false);
      }
    };

    pc.ontrack = (event) => {
      const stream = event.streams[0];
      if (stream) {
        setRemoteStream(stream);
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = stream;
        }
      }
    };

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        pc.addTrack(track, localStreamRef.current!);
      });
    }

    peerConnectionRef.current = pc;
    return pc;
  }, [roomId]);

  const createOffer = useCallback(async () => {
    const pc = createPeerConnection();
    try {
      const offer = await pc.createOffer({ offerToReceiveAudio: true, offerToReceiveVideo: true });
      await pc.setLocalDescription(offer);
      socket.emit('offer', { roomId, offer });
    } catch (error) {
      console.error('[WebRTC] Failed to create offer', error);
      toast.error('Failed to start video connection');
    }
  }, [roomId, createPeerConnection]);

  const toggleCamera = useCallback(() => {
    if (!localStreamRef.current) return;
    localStreamRef.current.getVideoTracks().forEach((track) => {
      track.enabled = !track.enabled;
      setCameraEnabled(track.enabled);
      socket.emit('toggle-media', { roomId, type: 'video', enabled: track.enabled });
    });
  }, [roomId]);

  const toggleMic = useCallback(() => {
    if (!localStreamRef.current) return;
    localStreamRef.current.getAudioTracks().forEach((track) => {
      track.enabled = !track.enabled;
      setMicEnabled(track.enabled);
      socket.emit('toggle-media', { roomId, type: 'audio', enabled: track.enabled });
    });
  }, [roomId]);

  const endCall = useCallback(() => {
    stopLocalMedia();
    cleanupPeerConnection();
    socket.emit('interview-ended', { roomId });
    onInterviewEndedRef.current?.();
  }, [roomId, stopLocalMedia, cleanupPeerConnection]);

  const leaveRoom = useCallback(() => {
    stopLocalMedia();
    cleanupPeerConnection();
    socket.emit('user-left', { roomId });
  }, [roomId, stopLocalMedia, cleanupPeerConnection]);

  useEffect(() => {
    if (!enabled) return;

    let active = true;

    const init = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (!active) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        localStreamRef.current = stream;
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        socket.emit('join-room', { roomId, userId, userName, role });
      } catch (error) {
        console.error('[WebRTC] Media access failed', error);
        toast.error('Could not access camera or microphone');
      }
    };

    const handleRoomWaiting = () => {
      setWaitingForPeer(true);
    };

    const handleRoomReady = async ({ shouldCreateOffer }: { shouldCreateOffer: boolean }) => {
      setWaitingForPeer(false);
      if (shouldCreateOffer) {
        await createOffer();
      }
    };

    const handleRoomFull = () => {
      setRoomFull(true);
      toast.error('Interview room is full');
    };

    const handleOffer = async ({ offer }: { offer: RTCSessionDescriptionInit }) => {
      const pc = createPeerConnection();
      if (pc.signalingState === 'closed') return;

      try {
        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        await processIceCandidateQueue(pc);
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.emit('answer', { roomId, answer });
      } catch (error) {
        console.error('[WebRTC] Failed to handle offer', error);
      }
    };

    const handleAnswer = async ({ answer }: { answer: RTCSessionDescriptionInit }) => {
      const pc = peerConnectionRef.current;
      if (!pc || pc.signalingState === 'closed') return;

      try {
        await pc.setRemoteDescription(new RTCSessionDescription(answer));
        await processIceCandidateQueue(pc);
      } catch (error) {
        console.error('[WebRTC] Failed to handle answer', error);
      }
    };

    const handleIceCandidate = async ({ candidate }: { candidate: RTCIceCandidateInit }) => {
      const pc = peerConnectionRef.current;
      if (!pc) return;

      if (!pc.remoteDescription) {
        iceCandidateQueueRef.current.push(candidate);
        return;
      }

      try {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (error) {
        console.error('[WebRTC] Failed to add ICE candidate', error);
      }
    };

    const handleToggleMedia = ({ type, enabled }: { type: 'audio' | 'video'; enabled: boolean }) => {
      if (type === 'video') setRemoteCameraEnabled(enabled);
      if (type === 'audio') setRemoteMicEnabled(enabled);
    };

    const handleUserLeft = () => {
      cleanupPeerConnection();
      setWaitingForPeer(true);
      onUserLeftRef.current?.();
    };

    const handleInterviewEnded = () => {
      stopLocalMedia();
      cleanupPeerConnection();
      onInterviewEndedRef.current?.();
    };

    socket.on('room-waiting', handleRoomWaiting);
    socket.on('room-ready', handleRoomReady);
    socket.on('room-full', handleRoomFull);
    socket.on('offer', handleOffer);
    socket.on('answer', handleAnswer);
    socket.on('ice-candidate', handleIceCandidate);
    socket.on('toggle-media', handleToggleMedia);
    socket.on('user-left', handleUserLeft);
    socket.on('interview-ended', handleInterviewEnded);

    init();

    return () => {
      active = false;
      socket.emit('user-left', { roomId });
      socket.off('room-waiting', handleRoomWaiting);
      socket.off('room-ready', handleRoomReady);
      socket.off('room-full', handleRoomFull);
      socket.off('offer', handleOffer);
      socket.off('answer', handleAnswer);
      socket.off('ice-candidate', handleIceCandidate);
      socket.off('toggle-media', handleToggleMedia);
      socket.off('user-left', handleUserLeft);
      socket.off('interview-ended', handleInterviewEnded);
      stopLocalMedia();
      cleanupPeerConnection();
    };
  }, [
    enabled,
    roomId,
    userId,
    userName,
    role,
    createOffer,
    createPeerConnection,
    processIceCandidateQueue,
    cleanupPeerConnection,
    stopLocalMedia,
  ]);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  return {
    localVideoRef,
    remoteVideoRef,
    localStream,
    remoteStream,
    remoteConnected,
    cameraEnabled,
    micEnabled,
    remoteCameraEnabled,
    remoteMicEnabled,
    waitingForPeer,
    roomFull,
    toggleCamera,
    toggleMic,
    endCall,
    leaveRoom,
    getPeerConnection,
  };
};










// import { useEffect, useRef, useState } from "react"
// import toast from "react-hot-toast"
// import { socket } from "../lib/socket"

// export function useWebRTC({ roomId}: {roomId: string}) {
//       const [micEnabled, setMicEnabled] = useState(true)
//       const [cameraEnabled, setCameraEnabled] = useState(true)
//       const [remoteCameraEnabled, setRemoteCameraEnabled] = useState(true)
//       const [remoteMicEnabled, setRemoteMicEnabled] = useState(true)
//       const [localStream, setLocalStream] = useState<MediaStream | null>(null)
//       const localVideoRef = useRef<HTMLVideoElement | null>(null)
//       const remoteVideoRef = useRef<HTMLVideoElement | null>(null)
//       const peerConnectionRef = useRef<RTCPeerConnection | null>(null)
//       // const remoteStreamRef = useRef<MediaStream>(new MediaStream())
//       const iceCandidateQueueRef = useRef<RTCIceCandidateInit[]>([])


// socket.off("room-ready")
// socket.off("offer")
// socket.off("answer")
// socket.off("ice-candidate")
// socket.off("toggle-media")
// socket.off("user-left")

//   useEffect(() => {
//     let stream: MediaStream

//     const initializeMedia = async() => {
//       try {
//         stream = await navigator.mediaDevices.getUserMedia({
//           video: true,
//           audio: true
//         })
//         console.log(stream.getTracks())
//         setLocalStream(stream)

//         peerConnectionRef.current = new RTCPeerConnection({
//           iceServers: [
//             {
//               urls: "stun:stun.l.google.com:19302",
//             }
//           ]
//         })

//         socket.emit("join-room", roomId)

//         peerConnectionRef.current.onconnectionstatechange = () => {
//             console.log( "Connection State:", peerConnectionRef.current?.connectionState)
//         }

//         peerConnectionRef.current.oniceconnectionstatechange = () => {
//           console.log( "ICE State:", peerConnectionRef.current?.iceConnectionState)
//         }

//         peerConnectionRef.current.onsignalingstatechange = () => {
//           console.log("Signaling State:", peerConnectionRef.current?.signalingState)
//         }

//         peerConnectionRef.current.onicecandidateerror = (event) => {
//           console.error("ICE candidate error", event)
//         }

//         stream.getTracks().forEach(track => {
//           peerConnectionRef.current?.addTrack(track, stream)
//         })

//         peerConnectionRef.current.ontrack = (event) => {
//           console.log("Remote stream", event.streams[0])
//           if(remoteVideoRef.current){
//             remoteVideoRef.current.srcObject = event.streams[0]
//           }
//         }

//         peerConnectionRef.current.onicecandidate = (event) => {
//           if(event.candidate){
//             socket.emit("ice-candidate", {
//               roomId,
//               candidate: event.candidate
//             })
//           }
//         }

//       } catch (error) {
//         console.log(error)
//         toast.error(typeof error === 'string' ? error : 'Failed to on Camera')
//       }
//     }

//     initializeMedia()

//      const handleRoomReady = async ({ shouldCreateOffer}: {shouldCreateOffer: boolean}) => {
//          if(!shouldCreateOffer) return
//          if(!peerConnectionRef.current) return

//          console.log("user joined")
//          const offer = await peerConnectionRef.current.createOffer()
//          await peerConnectionRef.current.setLocalDescription(offer)
//          socket.emit("offer", { roomId, offer})
//      }
//      socket.on("room-ready", handleRoomReady)

//       const handleOffer = async ({offer}: {offer: RTCSessionDescriptionInit}) => {
//          if(!peerConnectionRef.current) return
//          console.log("offer recieved")
//          if(peerConnectionRef.current.signalingState === 'closed') return
//          try {
//             await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(offer))
//          } catch (error) {
//             console.log(error)
//             return
//          }
//          for(const candidate of iceCandidateQueueRef.current) {
//             try {
//                 await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate))
//             } catch (error) {
//                 console.error(error)
//             }
//          }
//          iceCandidateQueueRef.current = []
//          const answer = await peerConnectionRef.current.createAnswer()
//          await peerConnectionRef.current.setLocalDescription(answer)
//          socket.emit("answer", { roomId, answer})
//       }
//       socket.on("offer", handleOffer)

//      const handleAnswer =  async ({answer}: {answer: RTCSessionDescriptionInit}) => {
//          if(!peerConnectionRef.current) return
//          console.log("answer received")
//          if(peerConnectionRef.current.signalingState === 'closed') return
//          try {
//             await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer))
//          } catch (error) {
//             console.log(error)
//             return
//          }
//          for(const candidate of iceCandidateQueueRef.current) {
//             try {
//                await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate))
//             } catch (error) {
//                console.error(error)
//             }
//          }
//          iceCandidateQueueRef.current = []
//       }
//       socket.on("answer", handleAnswer)

//     const handleIceCandidate = async({candidate}: {candidate: RTCIceCandidateInit}) => {
//       const pc = peerConnectionRef.current
//       if(!pc) return
//       if(!pc.remoteDescription){
//         iceCandidateQueueRef.current.push(candidate)
//         return
//       }
//       console.log("candidate received")
//       try {
//         await pc.addIceCandidate( new RTCIceCandidate(candidate))
//       } catch (error) {
//         console.log("Failed to add ice candidate", error)
//       }
//     }
//     socket.on("ice-candidate", handleIceCandidate)

//     const handleToggleMedia = async({type, enabled}: {type: "audio" | "video"; enabled: boolean}) => {
//       if(type === 'video'){
//             setRemoteCameraEnabled(enabled)
//       }
//       if(type === 'audio') {
//             setRemoteMicEnabled(enabled)
//       }
//     }
//     socket.on("toggle-media", handleToggleMedia)

//     const handleUserLeft =  () => {
//       if(remoteVideoRef.current){
//         remoteVideoRef.current.srcObject = null
//       }
//       // peerConnectionRef.current?.getReceivers().forEach(receiver => {
//       //     receiver.track?.stop()
//       // })
//     }
//     socket.on("user-left", handleUserLeft)

//     return () => {
//        stream?.getTracks().forEach(track => track.stop())
//        peerConnectionRef.current?.close()
//        peerConnectionRef.current = null
//        socket.off('room-ready', handleRoomReady)
//        socket.off("offer", handleOffer)
//        socket.off("answer", handleAnswer)
//        socket.off("ice-candidate", handleIceCandidate)
//        socket.off("toggle-media", handleToggleMedia)
//        socket.off("user-left", handleUserLeft)
//     }
//   }, [roomId])

//   useEffect(() => {
//     if(localVideoRef.current && localStream){
//       localVideoRef.current.srcObject = localStream
//     }
//   }, [localStream])

//   const toggleCamera = () => {
//     if (!localStream) return

//     localStream.getVideoTracks().forEach((track) => {
//       track.enabled = !track.enabled
//       setCameraEnabled(track.enabled)

//       socket.emit("toggle-media", {
//             roomId,
//             type: "video",
//             enabled: track.enabled
//       })
//     })
//   }

//   const toggleMic = () => {
//     if (!localStream) return

//     localStream.getAudioTracks().forEach((track) => {
//       track.enabled = !track.enabled
//       setMicEnabled(track.enabled)

//       socket.emit("toggle-media", {
//             roomId,
//             type: "audio",
//             enabled: track.enabled
//       })
//     })
//   }
//   return{
//       localVideoRef,
//       remoteVideoRef,
//       toggleCamera,
//       toggleMic,
//       micEnabled,
//       cameraEnabled,
//       remoteCameraEnabled,
//       remoteMicEnabled
//   }
// }