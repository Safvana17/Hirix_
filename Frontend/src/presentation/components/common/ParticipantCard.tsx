import React, { useEffect} from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import { MicOff, User, VideoOff } from 'lucide-react';

interface ParticipantCardProps {
  name: string;
  role: 'Company' | 'Candidate';
  isLocal: boolean;
  cameraEnabled: boolean;
  micEnabled: boolean;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  stream: MediaStream | null;
  isConnected?: boolean;
}

export const ParticipantCard: React.FC<ParticipantCardProps> = ({
  name,
  role,
  isLocal,
  cameraEnabled,
  micEnabled,
  videoRef,
  stream,
  isConnected = true,
}) => {

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [videoRef, stream]);

  const getInitials = (userName: string) => {
    return userName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Box className="relative w-full h-full min-h-[220px] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl flex items-center justify-center group transition-all duration-500 hover:border-indigo-500/30">
      {/* Video element */}
      {cameraEnabled && stream && isConnected ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={isLocal} 
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            isLocal ? 'transform -scale-x-100' : ''
          }`}
          style={{ width: '100%', height: '100%' }}
        />
      ) : null}

      {(!cameraEnabled || !stream || !isConnected) && (
        <Box 
          className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 gap-4"
          sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
        >
          {/* Pulsing Avatar Halo */}
          <Box className="relative">
            <span className="absolute -inset-1 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 opacity-60 blur-lg animate-pulse" />
            <Avatar
              className="relative h-20 w-20 border border-slate-700 bg-slate-800 text-2xl font-bold tracking-wider text-slate-100"
              style={{
                height: '80px',
                width: '80px',
                backgroundColor: '#1e293b',
                color: '#f8fafc',
                border: '1px solid #334155',
                fontSize: '24px',
              }}
            >
              {getInitials(name) || <User />}
            </Avatar>
            {/* Tiny Indicator badge */}
            <Box className="absolute bottom-0 right-0 h-6 w-6 rounded-full bg-red-500 border-2 border-slate-950 flex items-center justify-center">
              <VideoOff className="h-3 w-3 text-white" />
            </Box>
          </Box>

          <Box className="text-center">
            <Typography variant="body1" className="font-bold text-slate-200 text-base">
              {name}
            </Typography>
            <Typography variant="caption" className="text-slate-500 uppercase tracking-widest text-[10px]">
              {!isConnected ? 'Connecting Feed...' : 'Camera Paused'}
            </Typography>
          </Box>
        </Box>
      )}

      {/* Overlay: Top bar (Mic status & Badges) */}
      <Box className="absolute top-4 right-4 flex gap-2 z-10">
        {!micEnabled && (
          <Box className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 backdrop-blur-md transition-all duration-300">
            <MicOff className="h-4 w-4" />
          </Box>
        )}
      </Box>

      {/* Overlay: Bottom bar (User name details) */}
      <Box className="absolute bottom-4 left-4 right-4 flex items-center justify-between z-10 pointer-events-none">
        <Box className="flex items-center gap-2 bg-slate-950/70 px-3 py-1.5 rounded-xl border border-slate-800/40 backdrop-blur-md shadow-lg pointer-events-auto">
          <Typography variant="caption" className="font-bold text-slate-200 text-xs">
            {name} {isLocal ? '(You)' : ''}
          </Typography>
          <Box className="h-3 w-px bg-slate-800" />
          <Typography variant="caption" className="text-indigo-400 font-semibold text-[10px] uppercase tracking-wider">
            {role}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
export default ParticipantCard;
