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
  isScreenSharing?: boolean
  remoteScreenSharing?: boolean
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
  isScreenSharing = false,
  remoteScreenSharing = false
}) => {
  const presentationActive = isScreenSharing || remoteScreenSharing;
  const localIsPresenter = isScreenSharing;
  const remoteIsPresenter = remoteScreenSharing && !isScreenSharing;

  if (presentationActive) {
    return (
      <Box className="flex flex-col w-full h-full min-h-0 gap-3">
        <Box className="flex-1 min-h-0">
          {localIsPresenter ? (
            <ParticipantCard
              name={localName}
              role={localRole}
              isLocal
              cameraEnabled
              micEnabled={micEnabled}
              videoRef={localVideoRef}
              stream={localStream}
              isConnected
              isScreenShare
            />
          ) : (
            <ParticipantCard
              name={remoteConnected ? remoteName : 'Remote participant'}
              role={remoteRole}
              isLocal={false}
              cameraEnabled={remoteConnected && remoteCameraEnabled}
              micEnabled={remoteConnected && remoteMicEnabled}
              videoRef={remoteVideoRef}
              stream={remoteStream}
              isConnected={remoteConnected}
              isScreenShare
            />
          )}
        </Box>

        <Box className="flex gap-3 h-[140px] shrink-0">
          {localIsPresenter ? (
            <Box className="w-[220px] shrink-0">
              <ParticipantCard
                name={remoteConnected ? remoteName : 'Remote participant'}
                role={remoteRole}
                isLocal={false}
                cameraEnabled={remoteConnected && remoteCameraEnabled}
                micEnabled={remoteConnected && remoteMicEnabled}
                videoRef={remoteVideoRef}
                stream={remoteStream}
                isConnected={remoteConnected}
                compact
              />
            </Box>
          ) : (
            <>
              <Box className="w-[220px] shrink-0">
                <ParticipantCard
                  name={localName}
                  role={localRole}
                  isLocal
                  cameraEnabled={cameraEnabled}
                  micEnabled={micEnabled}
                  videoRef={localVideoRef}
                  stream={localStream}
                  isConnected
                  compact
                />
              </Box>
              {!remoteIsPresenter && (
                <Box className="w-[220px] shrink-0">
                  <ParticipantCard
                    name={remoteConnected ? remoteName : 'Remote participant'}
                    role={remoteRole}
                    isLocal={false}
                    cameraEnabled={remoteConnected && remoteCameraEnabled}
                    micEnabled={remoteConnected && remoteMicEnabled}
                    videoRef={remoteVideoRef}
                    stream={remoteStream}
                    isConnected={remoteConnected}
                    compact
                  />
                </Box>
              )}
            </>
          )}
        </Box>
      </Box>
    );
  }

  return (
    <Box className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full h-full min-h-0">
      <ParticipantCard
        name={localName}
        role={localRole}
        isLocal
        cameraEnabled={cameraEnabled}
        micEnabled={micEnabled}
        videoRef={localVideoRef}
        stream={localStream}
        isConnected
      />

      <ParticipantCard
        name={remoteConnected ? remoteName : 'Remote participant'}
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
