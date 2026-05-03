import React, { useState } from "react"
import {
  Alert,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Paper,
  TextField,
  Typography,
} from "@mui/material"
import { useNavigate, useParams } from "react-router-dom"
import { useDispatch } from "react-redux"
import toast from "react-hot-toast"
import type { AppDispatch } from "../../../../redux/store"
import { cancelTest } from "../../../../redux/slices/features/test/companyTestSlice"

const CancelTestPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()

  const [reason, setReason] = useState("")
  const [notifyCandidates, setNotifyCandidates] = useState(true)
  const [loading, setLoading] = useState(false)

  const handleCancelTest = async () => {
    if (!id) {
      toast.error("Test id is missing")
      return
    }

    if (!reason.trim()) {
      toast.error("Cancellation reason is required")
      return
    }

    try {
      setLoading(true)

      await dispatch(
        cancelTest({
          id,
          reason: reason.trim(),
        })
      ).unwrap()

      toast.success("Test cancelled successfully")
      navigate("/company/tests")
    } catch (error) {
      toast.error(typeof error === "string" ? error : "Failed to cancel test")
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
          Cancel Test
        </Typography>

        <Alert severity="warning" sx={{ mb: 3, borderRadius: 2 }}>
          Candidates will be notified about the cancellation.
        </Alert>

        <TextField
          label="Reason"
          fullWidth
          multiline
          minRows={5}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Enter reason for cancelling this test"
        />

        <FormControlLabel
          sx={{ mt: 2 }}
          control={
            <Checkbox
              checked={notifyCandidates}
              onChange={(e) => setNotifyCandidates(e.target.checked)}
            />
          }
          label="Send email notification to candidates"
        />

        <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
          <Button
            variant="outlined"
            color="inherit"
            onClick={() => navigate("/company/tests")}
          >
            Back
          </Button>

          <Button
            variant="contained"
            color="error"
            disabled={loading}
            onClick={handleCancelTest}
          >
            {loading ? "Cancelling..." : "Confirm Cancel"}
          </Button>
        </Box>
      </Paper>
    </Box>
  )
}

export default CancelTestPage