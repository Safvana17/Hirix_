import React from 'react'
import {
  Box,
  Button,
  Divider,
  Stack,
  Typography,
} from '@mui/material'
import LoginRoundedIcon from '@mui/icons-material/LoginRounded'
import PersonAddAltRoundedIcon from '@mui/icons-material/PersonAddAltRounded'
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../../../../constants/routes'


const QuestionSubmittedPage: React.FC = () => {
  const navigate = useNavigate()

return (
  <Box
    sx={{
      minHeight: '100vh',
      bgcolor: '#0B0707',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      px: 2,
      py: 4,
    }}
  >
    <Box
      sx={{
        width: '100%',
        maxWidth: 560,
        bgcolor: '#fff',
        border: '5px solid #6B4705',
        px: { xs: 3, sm: 5 },
        py: 5,
        textAlign: 'center',
        boxShadow: '0 24px 70px rgba(0,0,0,0.4)',
      }}
    >
      <Box
        sx={{
          width: 86,
          height: 86,
          borderRadius: '50%',
          bgcolor: '#FEF3C7',
          mx: 'auto',
          mb: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <HelpOutlineRoundedIcon
          sx={{
            fontSize: 48,
            color: '#6B4705',
          }}
        />
      </Box>

      <Typography
        sx={{
          fontFamily: 'serif',
          fontSize: { xs: 28, sm: 34 },
          color: '#6B4705',
          fontWeight: 700,
        }}
      >
        Question Submitted Successfully
      </Typography>

      <Typography
        sx={{
          mt: 1,
          color: '#374151',
          fontSize: 15,
          lineHeight: 1.8,
        }}
      >
        Thank you for contributing to the Hirix practice library.
      </Typography>

      <Divider sx={{ my: 4 }} />

      <Box sx={{ textAlign: 'left' }}>
        <Typography sx={{ fontWeight: 800, mb: 2 }}>
          Continue Your Journey
        </Typography>

        <Typography
          component="ul"
          sx={{
            color: '#374151',
            fontSize: 14,
            lineHeight: 2,
          }}
        >
          <li>You can practice more coding and aptitude questions.</li>
          <li>Create an account to track your progress and rankings.</li>
        </Typography>
      </Box>

      <Stack spacing={2} sx={{ mt: 4 }}>
        <Button
          variant="contained"
          startIcon={<PersonAddAltRoundedIcon />}
          onClick={() => navigate(ROUTES.PUBLIC.HOME)}
          sx={{
            py: 1.3,
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 700,
            bgcolor: '#021A30',
            '&:hover': {
              bgcolor: '#0A2E4E',
            },
          }}
        >
          Create Account for Practice
        </Button>

        <Button
          variant="outlined"
          startIcon={<LoginRoundedIcon />}
          onClick={() => navigate(ROUTES.CANDIDATE.DASHBOARD)}
          sx={{
            py: 1.3,
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 700,
            borderColor: '#6B4705',
            color: '#6B4705',
            '&:hover': {
              borderColor: '#8A5A07',
              bgcolor: '#FFF7ED',
            },
          }}
        >
          Login to Practice
        </Button>
      </Stack>

      <Typography
        sx={{
          mt: 4,
          fontWeight: 700,
          fontSize: 14,
          color: '#4B5563',
        }}
      >
        You can close this window
      </Typography>
    </Box>
  </Box>
)
}

export default QuestionSubmittedPage