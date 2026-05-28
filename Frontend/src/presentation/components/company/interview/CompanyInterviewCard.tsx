import React from 'react'
import { Box, Button, Chip, Paper, Stack, Typography } from '@mui/material'
import { CalendarDays, Clock3, User, Mail } from 'lucide-react'
import type { Interview, InterviewResult, InterviewStatus } from '../../../../types/interview'

interface InterviewCardProps {
  interview: Interview
  onJoin: () => void
  onEdit: (interview: Interview) => void
  onReschedule: (id: string) => void
  onCancel: (id: string) => void
  onViewDetails: (id: string) => void
  onUpdateResult: (id: string) => void
  onScheduleNextRound: (interview: Interview, round: number) => void
  onSendOfferLetter: (id: string) => void
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

const getResultColor = (result?: InterviewResult) => {
  switch (result) {
    case 'SELECTED':
      return '#2E7D32'

    case 'REJECTED':
      return '#D32F2F'

    case 'HOLD':
      return '#ED6C02'

    default:
      return '#795003'
  }
}

const InterviewCard: React.FC<InterviewCardProps> = ({
  interview,
  onJoin,
  onEdit,
  onReschedule,
  onCancel,
  onViewDetails,
  onUpdateResult,
  onScheduleNextRound,
  onSendOfferLetter,
}) => {
  const isActiveInterview = interview.interviewStatus !== 'COMPLETED' && interview.interviewStatus !== 'CANCELLED'
  const isCompleted =interview.interviewStatus === 'COMPLETED'

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
          boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
        },
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="flex-start"
        flexWrap="wrap"
        gap={3}
      >
        <Box flex={1}>
          <Typography
            variant="h6"
            fontWeight={700}
            color="#2B2B2B"
          >
            {interview.name}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            mt={0.5}
            mb={2}
          >
            {interview.description}
          </Typography>
          <Stack spacing={1.2}>
            <Box display="flex" alignItems="center" gap={1}>
              <User size={16} />
              <Typography variant="body2">
                {interview.candidateName}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <Mail size={16} />
              <Typography variant="body2">
                {interview.candidateEmail}
              </Typography>
            </Box>

            <Box display="flex" alignItems="center" gap={1}>
              <CalendarDays size={16} />
              <Typography variant="body2">
                {new Date(
                  interview.scheduledStartTime
                ).toLocaleDateString()}
              </Typography>
            </Box>

            <Box display="flex" alignItems="center" gap={1}>
              <Clock3 size={16} />
              <Typography variant="body2">
                {new Date(
                  interview.scheduledStartTime
                ).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Typography>
            </Box>

            <Box display="flex" alignItems="center" gap={1}>
              <User size={16} />
              <Typography variant="body2">
                Interviewer: {interview.interviewerName}
              </Typography>
            </Box>
          </Stack>

          {isCompleted && interview.result && (
            <Box mt={2}>
              <Typography
                variant="body2"
                fontWeight={700}
                color="#2B2B2B"
              >
                Result:
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                {interview.result}
              </Typography>
            </Box>
          )}

          {interview.feedback && (
            <Box mt={2}>
              <Typography
                variant="body2"
                fontWeight={700}
                color="#2B2B2B"
              >
                Feedback:
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                {interview.feedback}
              </Typography>
            </Box>
          )}

          <Stack
            direction="row"
            spacing={1}
            mt={3}
            flexWrap="wrap"
            useFlexGap
          >
            {isActiveInterview && (
              <>
                <Button
                  variant="contained"
                  size="small"
                  onClick={onJoin}
                  sx={{
                    backgroundColor: '#0B3861',
                    textTransform: 'none',
                    borderRadius: 2,
                  }}
                >
                  Join
                </Button>

                <Button
                  variant="contained"
                  size="small"
                  onClick={() => onEdit(interview)}
                  sx={{
                    backgroundColor: '#61390b',
                    textTransform: 'none',
                    borderRadius: 2,
                  }}
                >
                  Edit
                </Button>

                <Button
                  variant="contained"
                  size="small"
                  onClick={() =>
                    onReschedule(interview.id)
                  }
                  sx={{
                    backgroundColor: '#D4A017',
                    textTransform: 'none',
                    borderRadius: 2,
                  }}
                >
                  Reschedule
                </Button>

                <Button
                  variant="contained"
                  size="small"
                  onClick={() => onCancel(interview.id)}
                  sx={{
                    backgroundColor: '#800909',
                    textTransform: 'none',
                    borderRadius: 2,
                  }}
                >
                  Cancel
                </Button>
              </>
            )}

            {isCompleted && !interview.result && (
              <Button
                variant="contained"
                size="small"
                onClick={() =>
                  onUpdateResult(interview.id)
                }
                sx={{
                  backgroundColor: '#795003',
                  textTransform: 'none',
                  borderRadius: 2,
                }}
              >
                Update Result
              </Button>
            )}

            {isCompleted &&
              interview.result === 'SELECTED' && (
                <>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() =>
                      onScheduleNextRound(interview, interview.round+1)
                    }
                    sx={{
                      backgroundColor: '#0B3861',
                      textTransform: 'none',
                      borderRadius: 2,
                    }}
                  >
                    Schedule Next Round
                  </Button>

                  <Button
                    variant="contained"
                    size="small"
                    onClick={() =>
                      onSendOfferLetter(interview.id)
                    }
                    sx={{
                      backgroundColor: '#2E7D32',
                      textTransform: 'none',
                      borderRadius: 2,
                    }}
                  >
                    Send Offer Letter
                  </Button>
                </>
              )}

            {isCompleted &&
              interview.result === 'HOLD' && (
                <Button
                  variant="contained"
                  size="small"
                  onClick={() =>
                    onScheduleNextRound(interview, interview.round+1)
                  }
                  sx={{
                    backgroundColor: '#ED6C02',
                    textTransform: 'none',
                    borderRadius: 2,
                  }}
                >
                  Schedule Next Round
                </Button>
              )}
          </Stack>
        </Box>

        <Box
          display="flex"
          flexDirection="column"
          alignItems="flex-end"
          gap={1.5}
        >
          <Chip
            label={interview.interviewStatus}
            sx={{
              backgroundColor: getStatusColor(
                interview.interviewStatus
              ),
              color: '#fff',
              fontWeight: 700,
            }}
          />

          {interview.result && (
            <Chip
              label={interview.result}
              sx={{
                backgroundColor: getResultColor(
                  interview.result
                ),
                color: '#fff',
                fontWeight: 700,
              }}
            />
          )}

          <Button
            variant="outlined"
            onClick={() =>
              onViewDetails(interview.id)
            }
            sx={{
              borderColor: '#795003',
              color: '#795003',
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: 2,
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