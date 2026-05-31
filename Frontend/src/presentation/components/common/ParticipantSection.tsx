import React from 'react';
import { Box } from '@mui/material';
import ParticipantCard from './ParticipantCard';

interface ParticipantSectionProps {
  localName: string;
  localRole: 'Company' | 'Candidate';
  remoteName: string;
  remoteRole: 'Company' | 'Candidate';
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  remoteConnected: boolean;
  cameraEnabled: boolean;
  micEnabled: boolean;
  remoteCameraEnabled?: boolean;
  remoteMicEnabled?: boolean;
  localVideoRef: React.RefObject<HTMLVideoElement | null>;
  remoteVideoRef: React.RefObject<HTMLVideoElement | null>;
}

export const ParticipantSection: React.FC<ParticipantSectionProps> = ({
  localName,
  localRole,
  remoteName,
  remoteRole,
  localStream,
  remoteStream,
  remoteConnected,
  cameraEnabled,
  micEnabled,
  remoteCameraEnabled = true,
  remoteMicEnabled = true,
  localVideoRef,
  remoteVideoRef,
}) => {
  return (
    <Box 
      className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full h-full"
      style={{
        display: 'grid',
        gap: '16px',
        width: '100%',
        height: '100%',
      }}
    >
      {/* Local Participant Card */}
      <ParticipantCard
        name={localName}
        role={localRole}
        isLocal={true}
        cameraEnabled={cameraEnabled}
        micEnabled={micEnabled}
        videoRef={localVideoRef}
        stream={localStream}
        isConnected={true}
      />

      {/* Remote Participant Card */}
      <ParticipantCard
        name={remoteConnected ? remoteName : 'Remote Participant'}
        role={remoteRole}
        isLocal={false}
        cameraEnabled={remoteConnected && remoteCameraEnabled}
        micEnabled={remoteConnected && remoteMicEnabled}
        videoRef={remoteVideoRef}
        stream={remoteStream}
        isConnected={remoteConnected}
      />
    </Box>
  );
};
export default ParticipantSection;
