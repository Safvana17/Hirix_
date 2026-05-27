import React from 'react'
import { Box, Button, Chip, Paper, Stack, Typography } from '@mui/material'
import { CalendarDays, Clock3, User } from 'lucide-react'
import type { Interview, InterviewStatus } from '../../../../types/interview'

interface InterviewCardProps {
  interview: Interview
  onJoin: () => void
  onReschedule: (id: string) => void
  onCancel: (id: string) => void
  onViewDetails: (id: string) => void
}

const getStatusColor = (status: InterviewStatus) => {
  switch (status) {
    case 'SCHEDULED':
      return '#2E7D32'

    case 'RESCHEDULED':
      return '#ED6C02'

    case 'COMPLETED':
      return '#1565C0'

    case 'CANCELLED':
      return '#D32F2F'

    default:
      return '#795003'
  }
}

const InterviewCard: React.FC<InterviewCardProps> = ({
  interview,
  onJoin,
  onReschedule,
  onCancel,
  onViewDetails
}) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 4,
        border: '1px solid #E0E0E0',
        mb: 3,
        transition: '0.2s',
        '&:hover': {
          boxShadow: '0 4px 16px rgba(0,0,0,0.08)'
        }
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="flex-start"
        flexWrap="wrap"
        gap={2}
      >
        <Box>
          <Typography
            variant="h6"
            fontWeight={700}
            color="#2B2B2B"
          >
            {interview.candidateName}
          </Typography>
          {/* <Typography
            variant="body2"
            color="text.secondary"
            mb={2}
          >
            {interview.jobRoleId}
          </Typography> */}
          <Stack spacing={1.2}>
            <Box display="flex" alignItems="center" gap={1}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: '#795003'
                }}
              >
                {interview.name}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <CalendarDays size={16} />
              <Typography variant="body2">
                {new Date(interview.scheduledStartTime).toLocaleDateString()}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <Clock3 size={16} />
              <Typography variant="body2">
                {new Date(interview.scheduledStartTime).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <User size={16} />
              <Typography variant="body2">
                {interview.interviewerName}
              </Typography>
            </Box>
          </Stack>
          <Stack direction="row" spacing={1} mt={3}>
            {interview.interviewStatus !== 'COMPLETED' &&
              interview.interviewStatus !== 'CANCELLED' && (
                <>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={onJoin}
                    sx={{
                      backgroundColor: '#0B3861',
                      textTransform: 'none',
                      borderRadius: 2
                    }}
                  >
                    Join
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={onJoin}
                    sx={{
                      backgroundColor: '#61390b',
                      textTransform: 'none',
                      borderRadius: 2
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => onReschedule(interview.id)}
                    sx={{
                      backgroundColor: '#D4A017',
                      textTransform: 'none',
                      borderRadius: 2
                    }}
                  >
                    Reschedule
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => onCancel(interview.id)}
                    sx={{
                      backgroundColor: "#800909",
                      textTransform: 'none',
                      borderRadius: 2
                    }}
                  >
                    Cancel
                  </Button>
                </>
              )}
          </Stack>
        </Box>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="flex-end"
          gap={2}
        >
          <Chip
            label={interview.interviewStatus}
            sx={{
              backgroundColor: getStatusColor(interview.interviewStatus),
              color: '#fff',
              fontWeight: 700
            }}
          />
          <Button
            variant="outlined"
            onClick={() => onViewDetails(interview.id)}
            sx={{
              borderColor: '#795003',
              color: '#795003',
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: 2
            }}
          >
            View Details
          </Button>
        </Box>
      </Box>
    </Paper>
  )
}

export default InterviewCard