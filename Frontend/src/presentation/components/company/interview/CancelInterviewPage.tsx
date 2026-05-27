import React, { useState } from "react"
import {
  Alert,
  Box,
  Button,
  Paper,
  TextField,
  Typography,
} from "@mui/material"
import { useNavigate, useParams } from "react-router-dom"
import { useDispatch } from "react-redux"
import toast from "react-hot-toast"
import type { AppDispatch } from "../../../../redux/store"
import { cancelInterview } from "../../../../redux/slices/features/interview/CompanyInterviewSlice"

const CancelInterviewPage: React.FC = () => {
  const { interviewId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const [reason, setReason] = useState("")
  const [loading, setLoading] = useState(false)

  const handleCancelInterview = async () => {
    if (!interviewId) {
      toast.error("Interview id is missing")
      return
    }
    if (!reason.trim()) {
      toast.error("Cancellation reason is required")
      return
    }
    try {
      setLoading(true)
      await dispatch(cancelInterview({id: interviewId, reason: reason.trim()})).unwrap()
      toast.success("Interview cancelled successfully")
      navigate("/company/interviews")
    } catch (error) {
      toast.error(typeof error === "string" ? error : "Failed to cancel interview")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      minHeight="100vh"
      bgcolor="#e8dfcf"
      display="flex"
      justifyContent="center"
      alignItems="center"
      px={2}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 520,
          p: 4,
          borderRadius: 4,
        }}
      >
        <Typography variant="h5" fontWeight={800} mb={2}>
          Cancel Interview
        </Typography>
        <Alert severity="warning" sx={{ mb: 3, borderRadius: 2 }}>
          Candidate will be notified about the cancellation through email.
        </Alert>
        <TextField
          label="Reason"
          fullWidth
          multiline
          minRows={5}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Enter reason for cancelling this interview"
        />
        <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
          <Button
            variant="outlined"
            color="inherit"
            onClick={() => navigate("/company/interviews")}
          >
            Back
          </Button>
          <Button
            variant="contained"
            color="error"
            disabled={loading}
            onClick={handleCancelInterview}
          >
            {loading ? "Cancelling..." : "Confirm Cancel"}
          </Button>
        </Box>
      </Paper>
    </Box>
  )
}

export default CancelInterviewPage