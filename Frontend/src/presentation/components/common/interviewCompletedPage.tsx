import React from 'react'
import {
  Box,
  Button,
  Divider,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import { CircleCheck, Code2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const InterviewCompletedPage: React.FC = () => {
  const navigate = useNavigate()

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background:
          'linear-gradient(135deg, #020617 0%, #0f172a 50%, #1e293b 100%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        px: 3,
        py: 4,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: 900,
          p: { xs: 4, md: 6 },
          borderRadius: 5,
          textAlign: 'center',
          background: 'rgba(15,23,42,0.78)',
          border: '1px solid rgba(148,163,184,0.15)',
          backdropFilter: 'blur(14px)',
          color: '#fff',
        }}
      >
        <Stack spacing={4} alignItems="center">
          <Box
            sx={{
              width: 120,
              height: 120,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(34,197,94,0.12)',
              border: '1px solid rgba(34,197,94,0.25)',
            }}
          >
            <CircleCheck
              size={72}
              color="#22c55e"
            />
          </Box>

          <Box>
            <Typography
              variant="h4"
              fontWeight={700}
              gutterBottom
            >
              Interview Completed
            </Typography>

            <Typography
              sx={{
                color: '#cbd5e1',
                maxWidth: 700,
                mx: 'auto',
                lineHeight: 1.8,
                fontSize: '1.0rem',
              }}
            >
              Thank you for attending your interview. Your session has been
              completed successfully and the hiring team will review your
              performance before sharing the next steps in the process.
            </Typography>
          </Box>

          <Divider
            sx={{
              width: '100%',
              borderColor: 'rgba(148,163,184,0.15)',
            }}
          />

          <Box sx={{ maxWidth: 720 }}>
            <Typography
              variant="h5"
              fontWeight={700}
              gutterBottom
            >
              Prepare for Your Next Opportunity
            </Typography>

            <Typography
              sx={{
                color: '#94a3b8',
                lineHeight: 1.8,
                fontSize: '0.8rem',
              }}
            >
              Keep improving your skills with coding challenges, technical
              interview questions, aptitude tests, and mock assessments.
              We have a growing collection of practice content designed to
              help you stay interview-ready, strengthen your problem-solving
              abilities, and build confidence for future opportunities.
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'flex',
              gap: 2,
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            <Button
              variant="contained"
              size="large"
              startIcon={<Code2 size={18} />}
              onClick={() => navigate('/login')}
              sx={{
                textTransform: 'none',
                borderRadius: 3,
                px: 5,
                py: 1.5,
                fontWeight: 700,
                background:"#6B4705",
                '&:hover': {
                  background:"#523705"
                },
              }}
            >
              Start Practicing
            </Button>
          </Box>
        </Stack>
      </Paper>
    </Box>
  )
}

export default InterviewCompletedPage