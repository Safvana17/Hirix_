import React, { useEffect, useRef, useState } from 'react'
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import { Mic, MicOff, Video, VideoOff } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import type { GetInterviewAccessResponse } from '../../../../types/interview'

interface InterviewReadyPageProps {
  interview: GetInterviewAccessResponse
}

const InterviewReadyPage: React.FC <InterviewReadyPageProps> = ({interview}) => {
  const navigate = useNavigate()
  const { roomId } = useParams()
  const [cameraEnabled, setCameraEnabled] = useState(true)
  const [micEnabled, setMicEnabled] = useState(true)
  const [loading, setLoading] = useState(false)
  const [localStream, setLocalStream] = useState<MediaStream | null>(null)

  const videoRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    let stream: MediaStream

    const initializeMedia = async () => {
        try {
            stream = await navigator.mediaDevices.getUserMedia({
               video: true,
               audio: true
            })
            setLocalStream(stream)
            if(videoRef.current)
              videoRef.current.srcObject = stream

        } catch (error) {
            console.log(error)
        }
    }

    initializeMedia()

    return () => {
        stream?.getTracks().forEach(track =>  {
            track.stop()
        })
    }
  }, [])


  const toggleMic = () => {
    if (!localStream) return

    localStream.getAudioTracks().forEach((track) => {
      track.enabled = !track.enabled
      setMicEnabled(track.enabled)
    })
  }

  const toggleCamera = () => {
    if (!localStream) return

    localStream.getVideoTracks().forEach((track) => {
      track.enabled = !track.enabled
      setCameraEnabled(track.enabled)
    })
  }

  const handleJoinInterview = async () => {
    setLoading(true)

    setTimeout(() => {
      navigate(`/interview/${roomId}/live`)
    }, 1000)
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom right, #021A30, #0B0707)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        px: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: 450,
          p: 4,
          borderRadius: 5,
          background: 'rgba(255,255,255,0.08)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <Typography
          variant="h5"
          fontWeight={800}
          color="#fff"
          textAlign="center"
          mb={4}
        >
          Interview Ready
        </Typography>

        <Box
          sx={{
            height: 240,
            borderRadius: 4,
            overflow: 'hidden',
            bgcolor: '#000',
            mb: 3,
            position: 'relative',
          }}
        >
          <>
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
           {!cameraEnabled && (
            <Stack
              height="100%"
              justifyContent="center"
              alignItems="center"
              spacing={2}
            >
              <Avatar
                sx={{
                  width: 90,
                  height: 90,
                  bgcolor: '#795003',
                  fontSize: 32,
                }}
              >
                Y
              </Avatar>

              <Typography color="#fff">
                Camera Off
              </Typography>
            </Stack>
          )}
        </>
        </Box>

        <Stack
          direction="row"
          justifyContent="center"
          spacing={2}
          mb={4}
        >
          <Button
            onClick={toggleMic}
            sx={{
              minWidth: 55,
              height: 55,
              borderRadius: '50%',
              bgcolor: micEnabled ? '#fff' : '#D32F2F',
              color: '#000',
            }}
          >
            {micEnabled ? <Mic /> : <MicOff />}
          </Button>

          <Button
            onClick={toggleCamera}
            sx={{
              minWidth: 55,
              height: 55,
              borderRadius: '50%',
              bgcolor: cameraEnabled ? '#fff' : '#D32F2F',
              color: '#000',
            }}
          >
            {cameraEnabled ? <Video /> : <VideoOff />}
          </Button>
        </Stack>

        <Stack spacing={1.5} mb={4}>
          <InfoRow label="Company" value={interview.companyName} />
          <InfoRow label="Role" value={interview.jobRole} />
          <InfoRow label="Round" value={`Round ${interview.round}`} />
          <InfoRow label="Scheduled Time" value={interview.startTime} />
          {interview.status === 'WAITING' && (
            <Paper
              elevation={0}
              sx={{
                mt: 2,
                p: 2,
                borderRadius: 3,
                bgcolor: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <Typography
                fontWeight={700}
                color="#F5C76E"
                mb={1}
              >
                Interview Not Started Yet
              </Typography>
              <Typography
                variant="body2"
                color="#D7D7D7"
              >
                Your interview session will become available at the scheduled time.
                Please keep this page open and ensure your microphone and camera are ready.
              </Typography>
            </Paper>
          )}
        </Stack>

        <Button
          fullWidth
          variant="contained"
          disabled={loading || interview.status === 'WAITING'}
          onClick={handleJoinInterview}
          sx={{
            py: 1.4,
            borderRadius: 3,
            fontWeight: 700,
            textTransform: 'none',
            bgcolor: '#795003',
          }}
        >
          {loading ? (
            <CircularProgress
              size={22}
              sx={{ color: '#fff' }}
            />
          ) : (
            'Join Interview'
          )}
        </Button>
      </Paper>
    </Box>
  )
}

const InfoRow = ({ label, value }: {label: string; value: string | number }) => (
  <Stack
    direction="row"
    justifyContent="space-between"
  >
    <Typography color="#CFCFCF">
      {label}
    </Typography>

    <Typography
      color="#fff"
      fontWeight={600}
    >
      {value}
    </Typography>
  </Stack>
)

export default InterviewReadyPage