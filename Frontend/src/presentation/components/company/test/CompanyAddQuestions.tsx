import React, { useEffect, useState } from 'react'
import {
  Box,
  Button,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import type { CreateTestPayload, TestQuestions } from '../../../../types/test'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../../../redux/store'
import type { Question, QuestionDifficulty, QuestionFormData, QuestionType } from '../../../../types/question'
import { getAllCategories } from '../../../../redux/slices/features/category/categorySlice'
import { getQuestionsForTest } from '../../../../redux/slices/features/question/questionSlice'
import TestQuestionCard from './TestQuestionCard'
import QuestionModal from '../../modal/QuestionModal'


interface CompanyAddQuestionProps {
  data: CreateTestPayload
  updateData: (data: Partial<CreateTestPayload>) => void
}

const questionDifficulty: QuestionDifficulty[] = ['easy', 'medium', 'hard']
const questionType: QuestionType[] = ['mcq', 'coding', 'descriptive']

const CompanyAddQuestions: React.FC<CompanyAddQuestionProps> = ({ data, updateData }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { questions } = useSelector((state: RootState) => state.question)
  const { categories } = useSelector((state: RootState) => state.category)
  const [difficulty, setDifficulty] = useState<QuestionDifficulty | ''>('')
  const [type, setType] = useState<QuestionType | ''>('')
  const [category, setCategory] = useState('')
  const [openCreateModal, setOpenCreateModal] = useState(false)

  useEffect(() => {
    dispatch(getAllCategories({}))
  }, [dispatch])

  useEffect(() => {
    dispatch(getQuestionsForTest({ params: { difficulty: difficulty || undefined, type: type || undefined, category: category || undefined, }}))
  }, [dispatch, difficulty, type, category])

  const mapQuestionToTestQuestion = (q: Question): TestQuestions => {
    return {
      id: q.id, // IMPORTANT (no random id)
      source: q.createdBy === 'Admin' ? 'ADMIN_LIBRARY' : 'COMPANY_LIBRARY',
      type: q.type,
      title: q.title,
      order: data.questions.length + 1,
      mark: 1,
      questionId: q.id,
      description: q.description,
      options: q.options,
      answer: q.answer,
      testCase: q.testCases?.map((tc) => ({
        input: tc.input,
        expectedOutput: tc.expectedOutput
      })) || [],
    }
  }

  const mapCustomToTestQuestion = (q: QuestionFormData): TestQuestions => {
    return {
      id: '',
      source: 'TEST_ONLY',
      type: q.type,
      title: q.title,
      order: data.questions.length + 1,
      mark: 1,

      description: q.description,
      options: q.options,
      answer: q.answer,
      testCase: q.testCases?.map((tc) => ({
        input: tc.input,
        expectedOutput: tc.expectedOutput
      })) || [],
    }
  }

  const isSelected = (questionId: string) => {
    return data.questions.some((q) => q.questionId === questionId)
  }

  const toggleQuestion = (question: Question) => {
    const mapped = mapQuestionToTestQuestion(question)

    const exists = data.questions.find(
      (q) => q.questionId === mapped.questionId
    )

    const updated = exists
      ? data.questions.filter((q) => q.questionId !== mapped.questionId)
      : [...data.questions, mapped]

    updateData({ questions: updated })
  }

  const handleCreateQuestion = (formData: QuestionFormData) => {
    const newQuestion = mapCustomToTestQuestion(formData)

    updateData({
      questions: [...data.questions, newQuestion],
    })

    setOpenCreateModal(false)
  }

  return (
    <>
      <Box
        sx={{
          backgroundColor: '#E6DECF',
          borderRadius: 3,
          p: { xs: 2, md: 4 },
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, md: 4 },
            borderRadius: 3,
            backgroundColor: '#F5EFE6',
          }}
        >
          {/* HEADER */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={4}
            flexWrap="wrap"
            gap={2}
          >
            <Box>
              <Typography variant="h6" fontWeight={700}>
                Select Questions
              </Typography>

              <Typography variant="body2" color="text.secondary">
                {data.questions.length} selected
              </Typography>
            </Box>

            <Button
              variant="contained"
              onClick={() => setOpenCreateModal(true)}
              sx={{
                backgroundColor: '#0B3861',
                textTransform: 'none',
                fontWeight: 600,
              }}
            >
              + Create Custom Question
            </Button>
          </Box>

          {/* FILTERS */}
          <Box display="flex" gap={2} mb={3} flexWrap="wrap">
            <TextField
              select
              size="small"
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              sx={filterStyle}
            >
              <MenuItem value="">All</MenuItem>
              {categories.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              size="small"
              label="Difficulty"
              value={difficulty}
              onChange={(e) =>
                setDifficulty(e.target.value as QuestionDifficulty | '')
              }
              sx={filterStyle}
            >
              <MenuItem value="">All</MenuItem>
              {questionDifficulty.map((d) => (
                <MenuItem key={d} value={d}>
                  {d}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              size="small"
              label="Type"
              value={type}
              onChange={(e) => setType(e.target.value as QuestionType | '')}
              sx={filterStyle}
            >
              <MenuItem value="">All</MenuItem>
              {questionType.map((t) => (
                <MenuItem key={t} value={t}>
                  {t}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          {/* LIST */}
          <Paper
            sx={{
              p: 2,
              borderRadius: 3,
              maxHeight: 420,
              overflowY: 'auto',
              backgroundColor: '#EDE4D7',
            }}
          >
            {questions.length === 0 ? (
              <Typography align="center" color="text.secondary">
                No questions found
              </Typography>
            ) : (
              <Stack spacing={2}>
                {questions.map((q) => (
                  <TestQuestionCard
                    key={q.id}
                    question={q}
                    selected={isSelected(q.id)}
                    onSelect={() => toggleQuestion(q)}
                  />
                ))}
              </Stack>
            )}
          </Paper>
        </Paper>
      </Box>

      {/* MODAL */}
      <QuestionModal
        isOpen={openCreateModal}
        mode="create"
        categories={categories}
        initialData={null}
        role="Company"
        onClose={() => setOpenCreateModal(false)}
        onSave={handleCreateQuestion}
      />
    </>
  )
}

const filterStyle = {
  minWidth: 180,
  backgroundColor: '#fff',
  borderRadius: 2,
}

export default CompanyAddQuestions