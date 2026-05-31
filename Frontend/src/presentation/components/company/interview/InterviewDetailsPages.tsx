import React, { useEffect } from 'react'
import {
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import { ArrowLeft } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../../../redux/store'
import { getInterviewById } from '../../../../redux/slices/features/interview/CompanyInterviewSlice'


const getStatusColor = (status: string) => {
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

const getResultColor = (result?: string) => {
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

const InfoRow = ({
  label,
  value,
}: {
  label: string
  value?: string
}) => (
  <Stack direction="row" spacing={2}>
    <Typography minWidth={170} fontWeight={700}>
      {label}
    </Typography>

    <Typography color="text.secondary">
      {value || '-'}
    </Typography>
  </Stack>
)

const InterviewDetailsPage: React.FC = () => {
    const navigate = useNavigate()
    const {interviewId } = useParams()
    const {selectedInterview} = useSelector((state: RootState) => state.companyInterview)
    const dispatch = useDispatch<AppDispatch>()

    useEffect(() => {
        if(interviewId)
           dispatch(getInterviewById({id: interviewId}))
    }, [dispatch, interviewId])

    const handleScheduleNextRound = () => {
         console.log('interview', selectedInterview)
    }

    const handleUpdateResult = () => {
       navigate(`/company/interview/${interviewId}/update-result`)
    }

    const handleSendOfferLetter = () => {
        console.log('sending....')
    }


  return (
    <Container maxWidth="md" sx={{ py: 4, minHeight: '100vh', backgroundColor: '#E6DECF' }}>
      <Stack direction="row" alignItems="center" spacing={1} mb={3}>
        <Button
          startIcon={<ArrowLeft size={18} />}
          onClick={() => navigate(-1)}
          sx={{
            color: '#795003',
            textTransform: 'none',
            fontWeight: 700,
          }}
        >
          Back
        </Button>
      </Stack>

      <Paper
        elevation={0}
        sx={{
          borderRadius: 4,
          p: 4,
          border: '1px solid #E0E0E0',
        }}
      >
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          spacing={2}
          mb={3}
        >
          <Box>
            <Typography
              variant="h5"
              fontWeight={800}
              color="#2B2B2B"
            >
              {selectedInterview?.name}
            </Typography>

            <Typography color="text.secondary" mt={1}>
              {selectedInterview?.description}
            </Typography>
          </Box>

          <Stack direction="row" spacing={1}>
            <Chip
              label={selectedInterview?.interviewStatus}
              sx={{
                bgcolor: getStatusColor(selectedInterview?.interviewStatus ?? 'warning'),
                color: '#fff',
                fontWeight: 700,
              }}
            />

            {selectedInterview?.result && (
              <Chip
                label={selectedInterview?.result}
                sx={{
                  bgcolor: getResultColor(selectedInterview?.result),
                  color: '#fff',
                  fontWeight: 700,
                }}
              />
            )}
          </Stack>
        </Stack>

        <Divider sx={{ mb: 3 }} />

        <Stack spacing={2.5}>
          <InfoRow
            label="Candidate Name"
            value={selectedInterview?.candidateName}
          />

          <InfoRow
            label="Candidate Email"
            value={selectedInterview?.candidateEmail}
          />

          <InfoRow
            label="Interviewer Name"
            value={selectedInterview?.interviewerName}
          />

          <InfoRow
            label="Interviewer Email"
            value={selectedInterview?.interviewerEmail}
          />

          <InfoRow
            label="Start Time"
            value={ selectedInterview ? new Date( selectedInterview?.scheduledStartTime).toLocaleString() : '-'}
          />
          <InfoRow
            label="End Time"
            value={selectedInterview ? new Date(selectedInterview?.scheduledEndTime).toLocaleString() : '-'}
          />

          <InfoRow
            label="Round"
            value={`Round ${selectedInterview?.round}`}
          />
        </Stack>

        {selectedInterview?.feedback && (
          <>
            <Divider sx={{ my: 4 }} />
            <Box>
              <Typography
                variant="h6"
                fontWeight={700}
                mb={2}
              >
                Feedback
              </Typography>

              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  bgcolor: '#F8F8F8',
                  borderRadius: 2,
                  border: '1px solid #E0E0E0',
                }}
              >
                <Typography color="text.secondary">
                  {selectedInterview?.feedback}
                </Typography>
              </Paper>
            </Box>
          </>
        )}

        <Stack
          direction="row"
          spacing={2}
          mt={4}
          flexWrap="wrap"
          useFlexGap
        >
          {selectedInterview?.interviewStatus === 'COMPLETED' && 
             selectedInterview.result === 'PENDING' &&(
              <Button
                variant="contained"
                onClick={handleUpdateResult}
                sx={{
                  bgcolor: '#795003',
                  textTransform: 'none',
                  borderRadius: 2,
                }}
              >
                Update Result
              </Button>
            )}

          {selectedInterview?.result === 'SELECTED' && (
            <>
              <Button
                variant="contained"
                onClick={handleScheduleNextRound}
                sx={{
                  bgcolor: '#0B3861',
                  textTransform: 'none',
                  borderRadius: 2,
                }}
              >
                Schedule Next Round
              </Button>

              <Button
                variant="contained"
                onClick={handleSendOfferLetter}
                sx={{
                  bgcolor: '#2E7D32',
                  textTransform: 'none',
                  borderRadius: 2,
                }}
              >
                Send Offer Letter
              </Button>
            </>
          )}
        </Stack>
      </Paper>
    </Container>
  )
}

export default InterviewDetailsPage