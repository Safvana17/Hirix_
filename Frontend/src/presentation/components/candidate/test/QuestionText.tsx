import React from "react"
import { Box, Typography } from "@mui/material"
import type { TestQuestions } from "../../../../types/test"


interface QuestionTextProps {
  question: TestQuestions
}

const QuestionText: React.FC<QuestionTextProps> = ({ question }) => {
  return (
    <Box>
      <Typography
        sx={{
          mb: 1.5,
          color: "#111827",
          fontSize: 18,
          fontWeight: 700,
        }}
      >
        Question
      </Typography>

      <Typography
        sx={{
          color: "#374151",
          fontSize: 16,
          lineHeight: 1.8,
          whiteSpace: "pre-line",
        }}
      >
        {question.description || question.title}
      </Typography>
    </Box>
  )
}

export default QuestionText