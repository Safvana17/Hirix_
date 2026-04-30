import { Check, InfoOutlined } from '@mui/icons-material'
import { Box, Button, Paper, Typography } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../../../../constants/routes'

const TestCreateSuccessPage: React.FC = () => {
    const navigate = useNavigate()
  return (
    <Box
      sx={{
        backgroundColor: '#E6DECF',
        borderRadius: 3,
        p: { xs: 2, md: 4 },
      }}
    >
      <Paper
        elevation={0}
        sx={{
          maxWidth: 760,
          mx: 'auto',
          p: { xs: 3, md: 5 },
          borderRadius: 1,
          backgroundColor: '#fff',
          textAlign: 'center',
        }}
      >
        <Box
          sx={{
            width: 105,
            height: 105,
            borderRadius: '50%',
            backgroundColor: '#A9F7C8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 3,
          }}
        >
          <Check sx={{ fontSize: 52, color: '#1F8F4D' }} />
        </Box>

        <Typography variant="h6" fontWeight={800} mb={2}>
          Your test has been successfully shared with candidates
        </Typography>

        <Typography variant="body2" sx={{ color: '#555', mb: 3 }}>
          You can continue to manage this test using the options below:
        </Typography>

        <Box
          sx={{
            maxWidth: 560,
            mx: 'auto',
            textAlign: 'left',
            mb: 3,
          }}
        >
          <Instruction text="Edit test settings such as instructions, test rules, end date, or reminders before the test starts." />
          <Instruction text="Add new candidates before the test starts. They will receive the test invitation link." />
          <Instruction text="Remove candidates only if they have not started the test." />
          <Instruction text="View candidate status and monitor submissions in real time." />
        </Box>

        <Box
          sx={{
            maxWidth: 560,
            mx: 'auto',
            textAlign: 'left',
            border: '1px solid #F36B6B',
            backgroundColor: '#FFEAEA',
            p: 2,
            mb: 3,
          }}
        >
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <InfoOutlined sx={{ color: '#C62828', fontSize: 20 }} />
            <Typography fontWeight={800} color="#C62828">
              Important
            </Typography>
          </Box>

          <Typography variant="body2" sx={{ color: '#C62828', fontSize: 13 }}>
            Once a candidate starts the test, questions, scoring, rules, and
            duration cannot be edited. This protects fairness and prevents
            invalid test results.
          </Typography>
        </Box>

        <Button
          variant="contained"
          sx={{
            backgroundColor: '#6B4705',
            color: '#fff',
            textTransform: 'none',
            fontWeight: 700,
            borderRadius: 2,
            px: 3,
            py: 1,
            '&:hover': {
              backgroundColor: '#563904',
            },
          }}
          onClick={() => navigate(ROUTES.COMPANY.TEST)}
        >
          View All Tests
        </Button>
      </Paper>
    </Box>
  )
}

const Instruction = ({ text }: { text: string }) => {
  return (
    <Box display="flex" alignItems="flex-start" gap={1.5} mb={1.5}>
      <Box
        sx={{
          width: 9,
          height: 9,
          borderRadius: '50%',
          backgroundColor: '#6B4705',
          mt: '6px',
          flexShrink: 0,
        }}
      />
      <Typography variant="body2" sx={{ color: '#333' }}>
        {text}
      </Typography>
    </Box>
  )
}

export default TestCreateSuccessPage