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
  isScreenShare?: boolean
  compact?: boolean
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
  isScreenShare=false,
  compact=false
}) => {

  const showVideo = Boolean(stream && isConnected && (cameraEnabled || isScreenShare))
  
  useEffect(() => {
    const videoE1 = videoRef.current
    if(!videoE1 || !stream) return

    if (videoE1.srcObject !== stream) {
      videoE1.srcObject = stream;
    }
    void videoE1.play().catch(() => undefined)

  }, [videoRef, stream, cameraEnabled, isScreenShare]);

  const getInitials = (userName: string) => {
    return userName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Box
      className={`relative w-full h-full overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl flex items-center justify-center group transition-all duration-500 hover:border-indigo-500/30 ${
        compact ? 'min-h-[120px] rounded-xl' : 'min-h-[220px] rounded-2xl'
      }`}
    >
      {showVideo ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={isLocal}
          className={`w-full h-full transition-opacity duration-300 ${
            isScreenShare ? 'object-contain bg-black' : 'object-cover'
          } ${isLocal && !isScreenShare ? 'transform -scale-x-100' : ''}`}
          style={{ width: '100%', height: '100%', opacity: cameraEnabled || isScreenShare ? 1 : 0 }}
        />
      ) : (
        <video ref={videoRef} autoPlay playsInline muted={isLocal} className="hidden" />
      )}

      {(!cameraEnabled || !stream || !isConnected) && !isScreenShare && (
        <Box className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 gap-4">
          <Box className="relative">
            <span className="absolute -inset-1 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 opacity-60 blur-lg animate-pulse" />
            <Avatar
              className={`relative border border-slate-700 bg-slate-800 font-bold tracking-wider text-slate-100 ${
                compact ? 'h-12 w-12 text-base' : 'h-20 w-20 text-2xl'
              }`}
            >
              {getInitials(name) || <User />}
            </Avatar>
            <Box className="absolute bottom-0 right-0 h-6 w-6 rounded-full bg-red-500 border-2 border-slate-950 flex items-center justify-center">
              <VideoOff className="h-3 w-3 text-white" />
            </Box>
          </Box>

          <Box className="text-center">
            <Typography variant="body1" className={`font-bold text-slate-200 ${compact ? 'text-sm' : 'text-base'}`}>
              {name}
            </Typography>
            <Typography variant="caption" className="text-slate-500 uppercase tracking-widest text-[10px]">
              {!isConnected ? 'Connecting feed...' : 'Camera paused'}
            </Typography>
          </Box>
        </Box>
      )}

      {isScreenShare && (
        <Box className="absolute top-3 left-3 z-10 bg-indigo-600/90 px-2 py-1 rounded-lg">
          <Typography className="text-[10px] font-bold uppercase tracking-wider text-white">
            {isLocal ? 'You are presenting' : 'Screen share'}
          </Typography>
        </Box>
      )}

      <Box className="absolute top-4 right-4 flex gap-2 z-10">
        {!micEnabled && (
          <Box className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 backdrop-blur-md transition-all duration-300">
            <MicOff className="h-4 w-4" />
          </Box>
        )}
      </Box>

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
