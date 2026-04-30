import { Check } from '@mui/icons-material'
import { Box, Paper, Typography } from '@mui/material'
import React from 'react'

const CompanyTestPublishPage: React.FC = () => {
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
          minHeight: 360,
          mx: 'auto',
          p: { xs: 3, md: 6 },
          borderRadius: 1,
          backgroundColor: '#fff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
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
            mb: 3,
          }}
        >
          <Check
            sx={{
              fontSize: 52,
              color: '#1F8F4D',
            }}
          />
        </Box>

        <Typography variant="h5" fontWeight={800} mb={1.5}>
          Test ready to publish
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: '#8A8A8A',
            mb: 3,
          }}
        >
          Generate a secure link and share it with candidates
        </Typography>
      </Paper>
    </Box>
  )
}

export default CompanyTestPublishPage