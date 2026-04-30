import { Box, Checkbox, Chip, Paper, Stack, Typography } from '@mui/material'
import React from 'react'
import type { Question } from '../../../../types/question'


interface TestQuestionCardProps {
    question: Question
    selected: boolean
    onSelect: () => void
}
const TestQuestionCard: React.FC<TestQuestionCardProps> = ({ question, selected, onSelect }) => {
  return (
    <Paper
      sx={{
        p: 2,
        borderRadius: 2,
        backgroundColor: '#fff',
        display: 'flex',
        gap: 2,
        alignItems: 'flex-start',
      }}
    >
      <Checkbox checked={selected} onChange={onSelect} />

      <Box flex={1}>
        <Typography fontWeight={600}>
          {question.title}
        </Typography>

        <Typography variant="body2" color="text.secondary" mt={1}>
          {question.categoryName}
        </Typography>

        <Stack direction="row" spacing={1} mt={1}>
          <Chip label={question.type} size="small" />
          <Chip label={question.difficulty} size="small" />
          {/* <Chip label={question.source} size="small" /> */}
        </Stack>
      </Box>
    </Paper>
  )
}

export default TestQuestionCard
