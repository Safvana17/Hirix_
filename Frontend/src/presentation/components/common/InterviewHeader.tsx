import React from 'react';
import { Box, Typography} from '@mui/material';
// import { Code2 } from 'lucide-react';
import Logo from '../../../assets/images/Logo.jpg'

interface InterviewHeaderProps {
  companyName: string;
  roleName: string;
  roomId: string;
  remoteConnected: boolean;
}

export const InterviewHeader: React.FC<InterviewHeaderProps> = ({
  companyName,
  roleName,
  roomId,
  remoteConnected,
}) => {
  return (
    <Box
      className="flex items-center justify-between border-b border-slate-800 bg-slate-900/90 px-6 py-4 backdrop-blur-md"
      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
    >
      <Box className="flex items-center gap-4" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 shadow-lg shadow-indigo-500/20">
          {/* <Code2 className="h-5 w-5 text-white animate-pulse" /> */}
          <img src={Logo} />
        </Box>
        <Box>
          <Box className="flex items-center gap-2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h6" className="font-bold text-white tracking-wide" style={{ color: '#fff', fontWeight: 'bold' }}>
              {companyName}
            </Typography>
            {/* <Chip 
              label="Live Sandbox" 
              size="small" 
              className="bg-indigo-900/40 text-indigo-300 border border-indigo-500/30 text-[10px] uppercase font-bold tracking-wider px-1"
            /> */}
          </Box>
          <Typography variant="body2" className="text-slate-400 text-sm font-medium">
            Role: <span className="text-slate-300 font-semibold">{roleName}</span>
          </Typography>
        </Box>
      </Box>

      <Box className="flex items-center gap-6" sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
        <Box className="hidden sm:block text-right">
          <Typography variant="caption" className="block text-slate-500 font-mono">
            ROOM REFERENCE:
          </Typography>
          <Typography variant="body2" className="font-mono text-slate-300 font-bold bg-slate-850 px-2 py-0.5 rounded border border-slate-800 text-xs">
            {roomId}
          </Typography>
        </Box>
        <Box 
          className={`flex items-center gap-2 rounded-full px-3 py-1.5 border backdrop-blur-sm transition-all duration-300 ${
            remoteConnected 
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
              : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
          }`}
          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
        >
          <span className={`relative flex h-2 w-2`}>
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
              remoteConnected ? 'bg-emerald-400' : 'bg-amber-400'
            }`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${
              remoteConnected ? 'bg-emerald-500' : 'bg-amber-500'
            }`}></span>
          </span>
          <Typography variant="caption" className="font-semibold uppercase tracking-wider text-[11px]">
            {remoteConnected ? 'Peers Connected' : 'Waiting for Peer'}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
export default InterviewHeader;
