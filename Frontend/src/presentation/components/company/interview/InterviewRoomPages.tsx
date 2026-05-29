import React, { useState } from 'react'
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

const InterviewRoomPage: React.FC = () => {
  const [tab, setTab] = useState(0)
  const [micEnabled, setMicEnabled] = useState(true)
  const [cameraEnabled, setCameraEnabled] = useState(true)

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
            Interview with TechCorp
          </Typography>

          <Typography
            variant="body2"
            color="#D6D6D6"
          >
            Frontend Developer Position
          </Typography>
        </Box>

        <Stack direction="row" spacing={1.5}>
          <Button
            onClick={() =>
              setCameraEnabled(!cameraEnabled)
            }
            sx={controlButtonStyle}
          >
            {cameraEnabled ? (
              <Video />
            ) : (
              <VideoOff />
            )}
          </Button>

          <Button
            onClick={() =>
              setMicEnabled(!micEnabled)
            }
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
            name="John Doe"
            avatar="JD"
          />

          <ParticipantCard
            name="You"
            avatar="Y"
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

const ParticipantCard = ({ name, avatar }: { name: string; avatar: string }) => (
  <Paper
    elevation={0}
    sx={{
      flex: 1,
      borderRadius: 4,
      background: 'rgba(255,255,255,0.06)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255,255,255,0.08)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <Stack alignItems="center" spacing={2}>
      <Avatar
        sx={{
          width: 90,
          height: 90,
          bgcolor: '#795003',
          fontSize: 32,
        }}
      >
        {avatar}
      </Avatar>

      <Typography color="#fff">
        {name}
      </Typography>
    </Stack>
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