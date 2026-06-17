import React from 'react';
import { Box, Tooltip, IconButton } from '@mui/material';
import { Mic, MicOff, Video, VideoOff, MonitorUp, MonitorOff, PhoneOff } from 'lucide-react';

interface InterviewToolbarProps {
  cameraEnabled: boolean;
  micEnabled: boolean;
  isScreenSharing: boolean;
  toggleCamera: () => void;
  toggleMic: () => void;
  startScreenShare: () => void;
  stopScreenShare: () => void;
  endCall: () => void;
  isInterviewer?: boolean;
}

export const InterviewToolbar: React.FC<InterviewToolbarProps> = ({
  cameraEnabled,
  micEnabled,
  isScreenSharing,
  toggleCamera,
  toggleMic,
  startScreenShare,
  stopScreenShare,
  endCall,
  isInterviewer = true,
}) => {
  return (
    <Box
      className="flex items-center gap-4 bg-slate-950/85 border border-slate-800 px-6 py-3.5 rounded-full shadow-2xl backdrop-blur-xl animate-fade-in"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        width: 'fit-content',
        margin: '0 auto',
      }}
    >
      <Tooltip title={micEnabled ? 'Mute Microphone' : 'Unmute Microphone'} arrow>
        <IconButton
          onClick={toggleMic}
          sx={{
            width: 44,
            height: 44,
            bgcolor: micEnabled ? '#1e293b' : 'rgba(239,68,68,.15)',
            color: micEnabled ? '#f8fafc' : '#f87171',
            '&:hover': {
              bgcolor: micEnabled ? '#334155' : 'rgba(239,68,68,.25)',
            },
          }}
        >
          {micEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
        </IconButton>
      </Tooltip>
      <Tooltip title={cameraEnabled ? 'Disable Camera' : 'Enable Camera'} arrow>
        <IconButton
          onClick={toggleCamera}
          sx={{
            width: 44,
            height: 44,
            bgcolor: micEnabled ? '#1e293b' : 'rgba(239,68,68,.15)',
            color: micEnabled ? '#f8fafc' : '#f87171',
            '&:hover': {
              bgcolor: micEnabled ? '#334155' : 'rgba(239,68,68,.25)',
            },
          }}
        >
          {cameraEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
        </IconButton>
      </Tooltip>
      <Tooltip title={isScreenSharing ? 'Stop Screen Share' : 'Share Screen'} arrow>
        <IconButton
          onClick={isScreenSharing ? stopScreenShare : startScreenShare}
          sx={{
            width: 44,
            height: 44,
            bgcolor: micEnabled ? '#1e293b' : 'rgba(239,68,68,.15)',
            color: micEnabled ? '#f8fafc' : '#f87171',
            '&:hover': {
              bgcolor: micEnabled ? '#334155' : 'rgba(239,68,68,.25)',
            },
          }}
        >
          {isScreenSharing ? <MonitorOff className="h-5 w-5" /> : <MonitorUp className="h-5 w-5" />}
        </IconButton>
      </Tooltip>

      <Box className="h-6 w-px bg-slate-800 mx-2" />


      <Tooltip title={isInterviewer ? 'End Interview' : 'Leave Interview'} arrow>
        <IconButton
          onClick={endCall}
          className="h-11 w-11 bg-gradient-to-r from-red-650 to-rose-600 text-white hover:shadow-lg hover:shadow-red-500/30 transition-all duration-300 hover:scale-105"
          style={{
            borderRadius: '50%',
            padding: '10px',
            backgroundColor: '#dc2626',
            color: '#fff',
          }}
        >
          <PhoneOff className="h-5 w-5" />
        </IconButton>
      </Tooltip>

    </Box>
  );
}
export default InterviewToolbar;
