import { CheckCircle, ErrorOutline, Replay } from '@mui/icons-material'
import { Box, Button, Card, Divider, Stack, Typography } from '@mui/material'
import { motion } from 'framer-motion'

import React from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ROUTES } from '../../../constants/routes'

const AnimatedCard = motion(Card)


const PaymentStatus: React.FC= () => {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const status = params.get("status") || 'failed' 
  
  const isSuccess = status === 'success'

  const handleRetry = () => {
    navigate("/company/payment")
  }
  
  return (
    <Box 
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#E6DECF",
        p: 2,
      }}
    >
      <AnimatedCard
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        sx={{
          
          maxWidth: 420,
          width: "100%",
          borderRadius: 4,
          boxShadow: 6,
          p: 4,
          textAlign: "center",
        }}
      >
        <Stack spacing={3} alignItems="center">
          {isSuccess ? (
            <CheckCircle sx={{ fontSize: 80, color: "green", background: '#fff'}} />
          ) : (
            <ErrorOutline sx={{ fontSize: 80, color: "red", background: "#e9d7b7", borderRadius: 10, padding: 2 }} />
          )}

          <Typography variant="h5" fontWeight={600}>
            {isSuccess ? "Payment Successful" : "Payment Failed"}
          </Typography>

          <Typography variant="body2">
            {isSuccess
              ? "Your transaction has been completed successfully."
              : "Something went wrong during the transaction. Please try again."}
          </Typography>

          <Divider sx={{ width: "100%" }} />

          {isSuccess ? (
            <Button
              variant="contained"
              fullWidth
              sx={{ borderRadius: 3, py: 1.2, background: "#6B4705", }}
              onClick={() => window.location.href = ROUTES.COMPANY.DASHBOARD}
            >
              Go to Dashboard
            </Button>
          ) : (
            <Stack spacing={2} width="100%">
              <Button
                variant="contained"
                startIcon={<Replay />}
                fullWidth
                sx={{ borderRadius: 3, py: 1.2, background: "#6B4705", }}
                onClick={handleRetry}
              >
                Retry Payment
              </Button>

              <Button
                variant="outlined"
                fullWidth
                sx={{ borderRadius: 3, py: 1.2, borderColor: 'red', color: 'red' }}
                onClick={() => window.location.href = ROUTES.COMPANY.SUBSCRIPTION}
              >
                CANCEL
              </Button>
            </Stack>
          )}
        </Stack>
      </AnimatedCard>
    </Box>
  )
}

export default PaymentStatus
