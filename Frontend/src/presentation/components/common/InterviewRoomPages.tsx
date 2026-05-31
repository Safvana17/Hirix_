import React from 'react'
import { Box, Typography } from '@mui/material'
// import { Mic, MicOff, PhoneOff, Send, Video, VideoOff } from 'lucide-react'
import type { GetInterviewAccessResponse } from '../../../types/interview'
import { useNavigate, useParams } from 'react-router-dom'
import { useWebRTC } from '../../../hooks/useWebRTC'
import { useChat } from '../../../hooks/useChat'
import { useCodeCollaboration } from '../../../hooks/useCodeCollaboration'
import toast from 'react-hot-toast'
import { useScreenShare } from '../../../hooks/useScreenShare'
import InterviewHeader from './InterviewHeader'
import ParticipantSection from './ParticipantSection'
import InterviewSidebar from './InterviewSidebar'
import InterviewToolbar from './InterviewToolbar'

interface InterviewRoomPageProps {
  interview: GetInterviewAccessResponse
}

const InterviewRoomPage: React.FC <InterviewRoomPageProps> = ({interview}) => {
  const { roomId } = useParams()
  const { token } = useParams()
  const navigate = useNavigate()
  // const [tab, setTab] = useState(0)

  const isCandidate = interview.role === 'Candidate'
  const role = isCandidate ? 'Candidate' : 'Company'
  const loaclParticipantName = isCandidate ? interview.candidateName : interview.interviewerName
  // const remoteParticipantName = isCandidate ? interview.interviewerName : interview.candidateName
  const userId = `${role}-${roomId}`

  const handleInterviewEnded = async () => {
    try {
      console.log('interview ended')
    } catch (error) {
      toast.error(typeof error === 'string' ? error : 'Failed to end interview')
    }
  }

  const {toggleCamera, cameraEnabled, toggleMic, micEnabled, remoteCameraEnabled,remoteMicEnabled, localStream, remoteStream, remoteConnected, waitingForPeer, endCall, leaveRoom, getPeerConnection, localVideoRef, remoteVideoRef} = useWebRTC({roomId: roomId!, userId, userName: loaclParticipantName, role, enabled: Boolean(token), onInterviewEnded: handleInterviewEnded})
  const { message, sendMessage } = useChat({ roomId: roomId!, userId, userName: loaclParticipantName})
  const { code, language, updateCode, updateLanguage } = useCodeCollaboration({roomId: roomId!, })
  const { startScreenShare, stopScreenShare, isScreenSharing } = useScreenShare({getPeerConnection, localStream, localVideoRef})
  
  const handleEndCall = () => {
    if(role === 'Company'){
      endCall()
    }else{
      leaveRoom()
      navigate(`/interview/completed`)
    }
  }
  return (
    <Box className="flex flex-col h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 font-sans relative">
      <InterviewHeader
        companyName="Hirix"
        roleName={role === 'Company' ? 'Company' : 'Candidate'}
        roomId={roomId!}
        remoteConnected={remoteConnected}
      />

      {waitingForPeer && (
        <Box className="px-4 py-2 bg-indigo-500/10 border-b border-indigo-500/20 text-center">
          <Typography className="text-indigo-300 text-sm">
            Waiting for the other participant to join...
          </Typography>
        </Box>
      )}

      <Box className="flex-1 flex flex-col lg:flex-row gap-4 p-4 min-h-0 overflow-hidden">
        <Box className="flex-1 flex gap-4 min-h-0 overflow-hidden">
          <Box className="flex-1 min-h-0">
            <ParticipantSection
              localName={loaclParticipantName}
              localRole={role}
              remoteName={role === 'Company' ? 'Candidate' : 'Company'}
              remoteRole={role === 'Company' ? 'Candidate' : 'Company'}
              localStream={localStream}
              remoteStream={remoteStream}
              remoteConnected={remoteConnected}
              cameraEnabled={cameraEnabled}
              micEnabled={micEnabled}
              remoteCameraEnabled={remoteCameraEnabled}
              remoteMicEnabled={remoteMicEnabled}
              localVideoRef={localVideoRef}
              remoteVideoRef={remoteVideoRef}
            />
          </Box>

          <Box className="w-[35%] min-w-[450px] max-w-[650px] shrink-0 min-h-0">
            <InterviewSidebar
              messages={message}
              sendMessage={sendMessage}
              code={code}
              language={language}
              updateCode={(c) => updateCode(c, language)}
              updateLanguage={updateLanguage}
              defaultTab={1}
            />
          </Box>
        </Box>

        <Box className="w-full lg:w-[380px] shrink-0 h-full min-h-0 lg:hidden">
          <InterviewSidebar
            messages={message}
            sendMessage={sendMessage}
            code={code}
            language={language}
            updateCode={(c) => updateCode(c, language)}
            updateLanguage={updateLanguage}
          />
        </Box>
      </Box>

      <Box className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-50">
        <InterviewToolbar
          cameraEnabled={cameraEnabled}
          micEnabled={micEnabled}
          isScreenSharing={isScreenSharing}
          toggleCamera={toggleCamera}
          toggleMic={toggleMic}
          startScreenShare={startScreenShare}
          stopScreenShare={stopScreenShare}
          endCall={handleEndCall}
          isInterviewer={role === 'Company'}
        />
      </Box>
    </Box>
  );
};

export default InterviewRoomPage;
