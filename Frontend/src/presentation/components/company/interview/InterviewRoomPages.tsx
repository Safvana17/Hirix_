import React, { useEffect, useRef, useState } from 'react'
import {
  Avatar,
  Box,
  Button,
  Divider,
  Paper,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material'
import { Mic, MicOff, PhoneOff, Send, Video, VideoOff } from 'lucide-react'
import type { GetInterviewAccessResponse } from '../../../../types/interview'
import toast from 'react-hot-toast'

interface InterviewRoomPageProps {
  interview: GetInterviewAccessResponse
}

const InterviewRoomPage: React.FC <InterviewRoomPageProps> = ({interview}) => {
  const [tab, setTab] = useState(0)
  const [micEnabled, setMicEnabled] = useState(true)
  const [cameraEnabled, setCameraEnabled] = useState(true)
  const [localStream, setLocalStream] = useState<MediaStream | null>(null)
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null)
  const localVideoRef = useRef<HTMLVideoElement | null>(null)
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    let stream: MediaStream

    const initializeMedia = async() => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        })
        setLocalStream(stream)

        if(localVideoRef.current){
          localVideoRef.current.srcObject = stream
        }

      } catch (error) {
        toast.error(typeof error === 'string' ? error : 'Failed to on Camera')
      }
    }

    initializeMedia()

    return () => {
       stream?.getTracks().forEach(track => track.stop())
    }
  }, [])

  useEffect(() => {
    if(remoteVideoRef.current && remoteStream){
      remoteVideoRef.current.srcObject = remoteStream
    }
  }, [remoteStream])

  const isCandidate = interview.role === 'Candidate'
  const loaclParticipantName = isCandidate ? interview.candidateName : interview.interviewerName
  const remoteParticipantName = isCandidate ? interview.interviewerName : interview.candidateName

  return (
    <Box
      sx={{
        height: '100vh',
        bgcolor: '#050816',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          px: 3,
          py: 2,
          bgcolor: '#0B3861',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box>
          <Typography fontWeight={700}>
            Interview with {interview.companyName}
          </Typography>

          <Typography
            variant="body2"
            color="#D6D6D6"
          >
            {interview.jobRole} role
          </Typography>
        </Box>

        <Stack direction="row" spacing={1.5}>
          <Button
            onClick={() =>{
              if(!localStream) return
              localStream.getVideoTracks().forEach(track => {
                track.enabled = !track.enabled
                setCameraEnabled(track.enabled)
              })
            }}
            sx={controlButtonStyle}
          >
            {cameraEnabled ? (
              <Video />
            ) : (
              <VideoOff />
            )}
          </Button>

          <Button
            onClick={() =>{
              if(!localStream) return
              localStream.getAudioTracks().forEach(track => {
                track.enabled = !track.enabled
                setMicEnabled(track.enabled)
              })
            }}
            sx={controlButtonStyle}
          >
            {micEnabled ? <Mic /> : <MicOff />}
          </Button>

          <Button
            sx={{
              bgcolor: '#D32F2F',
              color: '#fff',
              px: 3,
              borderRadius: 2,
            }}
          >
            <PhoneOff size={18} />
          </Button>
        </Stack>
      </Box>

      <Box
        sx={{
          flex: 1,
          display: 'flex',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            flex: 1,
            p: 3,
            display: 'flex',
            gap: 3,
          }}
        >
          <ParticipantCard
            name={loaclParticipantName}
            avatar={loaclParticipantName.charAt(0)}
            videoRef={localVideoRef}
            cameraEnabled={cameraEnabled}
            muted
          />

          <ParticipantCard
            name={remoteParticipantName}
            avatar={remoteParticipantName.charAt(0)}
            videoRef={remoteVideoRef}
            cameraEnabled={true}
            muted={false}
          />
        </Box>
        <Paper
          square
          sx={{
            width: 420,
            bgcolor: '#101010',
            borderLeft: '1px solid #2C2C2C',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Tabs
            value={tab}
            onChange={(_, value) => setTab(value)}
            textColor="inherit"
            indicatorColor="secondary"
          >
            <Tab label="Chat" />
            <Tab label="Live Code" />
          </Tabs>

          <Divider />

          {tab === 0 ? (
            <ChatPanel />
          ) : (
            <CodePanel />
          )}
        </Paper>
      </Box>
    </Box>
  )
}

interface ParticipantCardProps {
  name: string
  avatar: string
  videoRef?: React.RefObject<HTMLVideoElement | null>
  cameraEnabled?: boolean
  muted?: boolean
}

const ParticipantCard: React.FC<ParticipantCardProps> = ({
  name,
  avatar,
  videoRef,
  cameraEnabled = false,
  muted = false,
}) => (
  <Paper
    elevation={0}
    sx={{
      flex: 1,
      borderRadius: 4,
      overflow: 'hidden',
      position: 'relative',
      background: '#0F172A',
      border: '1px solid rgba(255,255,255,0.08)',
      minHeight: 500,
    }}
  >
    {cameraEnabled ? (
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={muted}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
    ) : (
      <Stack
        justifyContent="center"
        alignItems="center"
        height="100%"
        spacing={2}
      >
        <Avatar
          sx={{
            width: 100,
            height: 100,
            bgcolor: '#795003',
            fontSize: 36,
          }}
        >
          {avatar}
        </Avatar>

        <Typography
          sx={{
            color: '#fff',
            fontWeight: 600,
          }}
        >
          {name}
        </Typography>
      </Stack>
    )}

    <Box
      sx={{
        position: 'absolute',
        bottom: 16,
        left: 16,
        bgcolor: 'rgba(0,0,0,0.6)',
        px: 2,
        py: 0.8,
        borderRadius: 2,
      }}
    >
      <Typography
        sx={{
          color: '#fff',
          fontWeight: 600,
        }}
      >
        {name}
      </Typography>
    </Box>
  </Paper>
)

const ChatPanel = () => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
    }}
  >
    <Box sx={{ flex: 1, p: 2 }}>
      <Typography color="#AAA">
        No messages yet
      </Typography>
    </Box>

    <Box
      sx={{
        p: 2,
        display: 'flex',
        gap: 1,
      }}
    >
      <TextField
        fullWidth
        placeholder="Type message..."
        size="small"
        sx={{
          input: { color: '#fff' },
        }}
      />

      <Button
        sx={{
          minWidth: 50,
          bgcolor: '#795003',
          color: '#fff',
        }}
      >
        <Send size={18} />
      </Button>
    </Box>
  </Box>
)

const CodePanel = () => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
    }}
  >
    <Box
      sx={{
        p: 2,
        borderBottom:
          '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <Typography color="#fff">
        Javascript
      </Typography>
    </Box>

    <Box
      sx={{
        flex: 1,
        p: 2,
        fontFamily: 'monospace',
        color: '#fff',
      }}
    >
      // write your code here
    </Box>

    <Box
      sx={{
        height: 140,
        bgcolor: '#000',
        p: 2,
      }}
    >
      <Typography color="#AAA">
        Output
      </Typography>
    </Box>
  </Box>
)

const controlButtonStyle = {
  minWidth: 50,
  height: 50,
  borderRadius: 2,
  bgcolor: '#fff',
  color: '#000',
}

export default InterviewRoomPage