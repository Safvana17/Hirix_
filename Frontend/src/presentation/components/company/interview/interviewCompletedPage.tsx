import React from 'react'
import { Box, Button, Paper, Stack, Typography } from '@mui/material'
import { CircleCheck } from 'lucide-react'

const InterviewCompletedPage: React.FC = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom right, #021B35, #0B3861)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: 500,
          p: 5,
          borderRadius: 5,
          textAlign: 'center',
          background: 'rgba(255,255,255,0.08)',
          backdropFilter: 'blur(12px)',
          color: '#fff',
        }}
      >
        <Stack spacing={3} alignItems="center">
          <CircleCheck
            size={90}
            color="#4CAF50"
          />

          <Typography
            variant="h4"
            fontWeight={800}
          >
            Interview Completed
          </Typography>

          <Typography color="#D5D5D5">
            Thank you for attending your
            interview.
          </Typography>

          <Typography color="#D5D5D5">
            The company will review your
            performance and update the
            result soon.
          </Typography>

          <Button
            variant="contained"
            sx={{
              mt: 3,
              bgcolor: '#795003',
              textTransform: 'none',
              borderRadius: 3,
              px: 4,
            }}
          >
            Close Window
          </Button>
        </Stack>
      </Paper>
    </Box>
  )
}

export default InterviewCompletedPage