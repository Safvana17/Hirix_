import React, { useState } from "react"
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material"
import { useNavigate, useParams } from "react-router-dom"
import { useDispatch } from "react-redux"
import toast from "react-hot-toast"
import type { AppDispatch } from "../../../../redux/store"
import { updateInterviewResult } from "../../../../redux/slices/features/interview/CompanyInterviewSlice"
import type { InterviewResult, UpdateInterviewResultArgs } from "../../../../types/interview"

const InterviewResult: InterviewResult[] = ['HOLD', 'PENDING', 'REJECTED', 'SELECTED']

const UpdateInterviewResultPage: React.FC = () => {
  const {interviewId} = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const [formData, setFormData] = useState<UpdateInterviewResultArgs>({
    result: 'SELECTED',
    feedback: "",
  })
  const [loading, setLoading] = useState(false)

  const handleUpdateResult = async () => {
    if (!interviewId) {
      toast.error("Interview id is missing")
      return
    }

    if (!formData.result || formData.result === 'PENDING') {
      toast.error("Result is required")
      return
    }

    if (!formData.feedback || formData.feedback.trim() === '') {
      toast.error("Feedback is required")
      return
    }

    try {
      setLoading(true)
      await dispatch(updateInterviewResult({interviewId, data: formData})).unwrap()
      toast.success("Interview result updated successfully")
      navigate(`/company/interview/${interviewId}`)
    } catch (error) {
      toast.error(typeof error === "string" ? error : "Failed to update interview result")
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
          Update Interview Result
        </Typography>

        <Grid container spacing={2}>

            <Grid size={12}>
            <FormControl fullWidth>
                <InputLabel>Result</InputLabel>
                <Select
                value={formData.result}
                label="Result"
                onChange={(e) =>
                    setFormData({
                    ...formData,
                    result: e.target.value as UpdateInterviewResultArgs["result"],
                    })
                }
                >
                {InterviewResult.map((result) => (
                    <MenuItem key={result} value={result}>
                    {result}
                    </MenuItem>
                ))}
                </Select>
            </FormControl>
            </Grid>

            <Grid size={12}>
                <TextField
                fullWidth
                type="text"
                label="Feedback"
                value={formData.feedback}
                onChange={(e) =>
                    setFormData({ ...formData, feedback: e.target.value })
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
            onClick={() => navigate(`/company/interview/${interviewId}`)}
          >
            Back
          </Button>

          <Button
            variant="contained"
            sx={{
                backgroundColor: "#6B4705"
            }}
            disabled={loading}
            onClick={handleUpdateResult}
          >
            {loading ? "Updating..." : "Update Result"}
          </Button>
        </Box>
      </Paper>
    </Box>
  )
}

export default UpdateInterviewResultPage