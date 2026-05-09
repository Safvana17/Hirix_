import React from "react"
import { Typography } from "@mui/material"
import type { TestQuestions } from "../../../../types/test"
import McqQuestion from "./McqQuestionCard"
import DescriptiveQuestion from "./DescriptiveQuestionCard"
import CodingQuestion from "./CodingQuestionCard"


interface QuestionRendererProps {
  question: TestQuestions
  value: string
  onChange: (value: string) => void
}

const QuestionRenderer: React.FC<QuestionRendererProps> = ({ question, value, onChange }) => {
  const questionType = question.type.toLowerCase()

  if (questionType === "mcq") {
    return <McqQuestion question={question} value={value} onChange={onChange} />
  }

  if (questionType === "descriptive") {
    return (
      <DescriptiveQuestion
        question={question}
        value={value}
        onChange={onChange}
      />
    )
  }

  if (questionType === "coding") {
    return (
      <CodingQuestion question={question} value={value} onChange={onChange} />
    )
  }

  return (
    <Typography sx={{ color: "#B42318" }}>
      Unsupported question type: {question.type}
    </Typography>
  )
}

export default QuestionRenderer