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
import { useLocation, useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import toast from "react-hot-toast"
import type { AppDispatch } from "../../../../redux/store"
import { resheduleTest } from "../../../../redux/slices/features/test/companyTestSlice"

const ResheduleTestPage: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const test = location.state
  const [formData, setFormData] = useState({
    startTime: "",
    endTime: "",
  })
  const [loading, setLoading] = useState(false)

  const handleResheduleTest = async () => {
    if (!test) {
      toast.error("Test is missing")
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
      await dispatch(resheduleTest({ id: test.id, startTime: formData.startTime, endTime: formData.endTime,})).unwrap()
      toast.success("Test rescheduled successfully")
      navigate("/company/tests")
    } catch (error) {
      toast.error(typeof error === "string" ? error : "Failed to reschedule test")
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
          Reschedule Test
        </Typography>

        <Alert severity="warning" sx={{ mb: 3, borderRadius: 2, backgroundColor: '#F6E8CD', borderBlockColor: '#6B4705'}}>
          Candidates will be notified with updated test schedule.
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

export default ResheduleTestPage