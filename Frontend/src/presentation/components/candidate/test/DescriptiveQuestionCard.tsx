import React from "react"
import { Box, TextField, Typography } from "@mui/material"
import QuestionText from "./QuestionText"
import type { CommonQuestionProps } from "./McqQuestionCard"


const DescriptiveQuestion: React.FC<CommonQuestionProps> = ({
  question,
  value,
  onChange,
}) => {
  return (
    <Box>
      <QuestionText question={question} />

      <TextField
        fullWidth
        multiline
        minRows={8}
        value={value}
        placeholder="Write your answer here..."
        onChange={(e) => onChange(e.target.value)}
        sx={{
          mt: 3,
          "& .MuiOutlinedInput-root": {
            borderRadius: 3,
            bgcolor: "#FAFAFA",
          },
        }}
      />

      <Typography sx={{ mt: 1, color: "#6B7280", fontSize: 13 }}>
        Write a clear and complete answer. Your response will be evaluated after
        submission.
      </Typography>
    </Box>
  )
}

export default DescriptiveQuestion