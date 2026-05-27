import React, { useState } from "react"
import {
  Alert,
  Box,
  Button,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material"
import { useNavigate, useParams } from "react-router-dom"
import { useDispatch } from "react-redux"
import toast from "react-hot-toast"
import type { AppDispatch } from "../../../../redux/store"
import { rescheduleInterview } from "../../../../redux/slices/features/interview/CompanyInterviewSlice"

const RescheduleInterviewPage: React.FC = () => {
  const {interviewId} = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const [formData, setFormData] = useState({
    startTime: "",
    endTime: "",
  })
  const [loading, setLoading] = useState(false)

  const handleResheduleTest = async () => {
    if (!interviewId) {
      toast.error("Interview is missing")
      return
    }

    if (!formData.startTime || !formData.endTime) {
      toast.error("Both dates are required")
      return
    }

    if (new Date(formData.startTime) >= new Date(formData.endTime)) {
      toast.error("End time must be after start time")
      return
    }

    try {
      setLoading(true)
      if(!formData.startTime || !formData.endTime){
        toast.error("Please provide correct time")
        return
      }
      await dispatch(rescheduleInterview({ id: interviewId, startTime: formData.startTime, endTime: formData.endTime,})).unwrap()
      toast.success("Interview rescheduled successfully")
      navigate("/company/interviews")
    } catch (error) {
      toast.error(typeof error === "string" ? error : "Failed to reschedule interview")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      minHeight="100vh"
      bgcolor="#f4efe6"
      display="flex"
      justifyContent="center"
      alignItems="center"
      px={2}
    >
      <Paper
        elevation={2}
        sx={{
          width: "100%",
          maxWidth: 600,
          p: 4,
          borderRadius: 4,
        }}
      >
        <Typography variant="h5" fontWeight={800} mb={2}>
          Reschedule Interview
        </Typography>

        <Alert severity="warning" sx={{ mb: 3, borderRadius: 2, backgroundColor: '#F6E8CD', borderBlockColor: '#6B4705'}}>
          Candidate and interviewer will be notified with updated interview schedule.
        </Alert>

        <Grid container spacing={2}>
          <Grid size={12}>
            <TextField
              fullWidth
              type="datetime-local"
              label="Start Time"
              value={formData.startTime}
              onChange={(e) =>
                setFormData({ ...formData, startTime: e.target.value })
              }
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid size={12}>
            <TextField
              fullWidth
              type="datetime-local"
              label="End Time"
              value={formData.endTime}
              onChange={(e) =>
                setFormData({ ...formData, endTime: e.target.value })
              }
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>

        <Box display="flex" justifyContent="flex-end" gap={2} mt={4}>
          <Button
            variant="contained"
            sx={{
                backgroundColor: "#AA0101"
            }}
            onClick={() => navigate("/company/tests")}
          >
            Back
          </Button>

          <Button
            variant="contained"
            sx={{
                backgroundColor: "#6B4705"
            }}
            disabled={loading}
            onClick={handleResheduleTest}
          >
            {loading ? "Rescheduling..." : "Confirm Reschedule"}
          </Button>
        </Box>
      </Paper>
    </Box>
  )
}

export default RescheduleInterviewPage