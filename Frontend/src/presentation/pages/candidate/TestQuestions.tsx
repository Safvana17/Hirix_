import React, { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import type { RootState } from '../../../redux/store'
import { Box, Button, Chip, Divider, Stack, Typography } from '@mui/material'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import BookmarkBorderRoundedIcon from '@mui/icons-material/BookmarkBorderRounded'
import BookmarkRoundedIcon from '@mui/icons-material/BookmarkRounded'
import CandidateTestHeader from '../../components/candidate/test/CandidateTestHeader'
import CandidateTestSidebar from '../../components/candidate/test/CandidateTestSidebar'
import type { TestQuestions } from '../../../types/test'
import QuestionRenderer from '../../components/candidate/test/QuestionRender'


type AnswerState = Record<string, string>

const TestQuestions: React.FC = () => {
    const { test } = useSelector((state: RootState) => state.candidateTest)
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [answers, setAnswers] = useState<AnswerState>({})
    const [reviewQuestionIds, setReviewQuestionIds] = useState<string[]>([])
    const questions = test?.questions ?? []
    const currentQuestion = questions[currentQuestionIndex]

    const answeredQuestionIds = useMemo(() => {
        return Object.keys(answers).filter((questionId) => {
            return answers[questionId]?.trim()
        })
    }, [answers])

    if (!test) return null


    const handleSubmit = () => {
        console.log('submit answers:', answers)
    }

    const handleQuestionClick = (index: number) => {
        setCurrentQuestionIndex(index)
    }

    const handleAnswerChange = (questionId: string, value: string) => {
        setAnswers((prev) => ({
            ...prev,
            [questionId]: value,
        }))
    }

    const handleMarkForReview = () => {
        if (!currentQuestion) return
        setReviewQuestionIds((prev) => {
            if (prev.includes(currentQuestion.id)) {
                return prev.filter((id) => id !== currentQuestion.id)
            }
            return [...prev, currentQuestion.id]
        })
    }

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex((prev) => prev + 1)
        }
    }

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex((prev) => prev - 1)
        }
    }

    if (!currentQuestion) {
        return <p>No questions found</p>
    }

    const isMarkedForReview = reviewQuestionIds.includes(currentQuestion.id)
    return (
      <Box sx={{ height: '100vh', overflow: 'hidden', background: 'linear-gradient(to bottom, #021A30, #0B0707)', }} >
        <CandidateTestHeader test={test} onSubmit={handleSubmit} />
        <Box sx={{ display: 'flex', height: 'calc(100vh - 108px)'}} >
          <Box
            component="main"
            sx={{
              flex: 1,
              overflowY: 'auto',
              px: { xs: 2, md: 5 },
              py: 4,
            }}
          >
            <Box sx={{ maxWidth: 980, mx: 'auto' }}>
              <Box
                sx={{
                  bgcolor: '#FFFFFF',
                  borderRadius: 4,
                  boxShadow: '0 24px 70px rgba(0,0,0,0.35)',
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    px: { xs: 3, md: 4 },
                    py: 3,
                    bgcolor: '#F8FAFC',
                    borderBottom: '1px solid #E5E7EB',
                  }}
                >
                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    justifyContent="space-between"
                    alignItems={{ xs: 'flex-start', sm: 'center' }}
                    spacing={2}
                  >
                    <Box>
                      <Typography
                        sx={{
                          fontSize: 14,
                          color: '#6B7280',
                          fontWeight: 600,
                        }}
                      >
                        Question {currentQuestionIndex + 1} of{' '}{questions.length}
                      </Typography>
                      <Typography
                        sx={{
                          mt: 0.5,
                          fontSize: { xs: 22, md: 28 },
                          fontWeight: 800,
                          color: '#111827',
                        }}
                      >
                        {currentQuestion.title || 'Question'}
                      </Typography>
                    </Box>

                    <Stack direction="row" spacing={1}>
                      <Chip
                        label={currentQuestion.type}
                        sx={{
                          bgcolor: '#EAF4FF',
                          color: '#0A2E4E',
                          fontWeight: 700,
                        }}
                      />
                      {currentQuestion.mark && (
                        <Chip
                          label={`${currentQuestion.mark} Marks`}
                          sx={{
                            bgcolor: '#ECFDF3',
                            color: '#027A48',
                            fontWeight: 700,
                          }}
                        />
                      )}
                    </Stack>
                  </Stack>
                </Box>
                <Box sx={{ px: { xs: 3, md: 4 }, py: 4 }}>
                  <QuestionRenderer
                    question={currentQuestion}
                    value={answers[currentQuestion.id] || ''}
                    onChange={(value) =>handleAnswerChange(currentQuestion.id, value)}
                  />
                  <Divider sx={{ my: 4 }} />
                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    justifyContent="space-between"
                    spacing={2}
                  >
                    <Button
                      variant="outlined"
                      startIcon={<ArrowBackRoundedIcon />}
                      disabled={currentQuestionIndex === 0}
                      onClick={handlePrevious}
                      sx={{
                        borderRadius: 999,
                        textTransform: 'none',
                        px: 3,
                        py: 1.1,
                      }}
                    >
                      Previous
                    </Button>
                    <Stack
                      direction={{ xs: 'column', sm: 'row' }}
                      spacing={2}
                    >
                      <Button
                        variant={ isMarkedForReview ? 'contained' : 'outlined' }
                        startIcon={
                          isMarkedForReview ? (
                            <BookmarkRoundedIcon />
                          ) : (
                            <BookmarkBorderRoundedIcon />
                          )
                        }
                        onClick={handleMarkForReview}
                        sx={{                        
                          borderRadius: 999,
                          textTransform: 'none',
                          px: 3,
                          py: 1.1,
                          bgcolor: isMarkedForReview
                            ? '#7C3AED'
                            : 'transparent',
                          '&:hover': {
                            bgcolor: isMarkedForReview
                              ? '#6D28D9'
                              : undefined,
                          },
                        }}
                      >
                        {isMarkedForReview ? 'Marked' : 'Mark for Review'}
                      </Button>
                      <Button
                        variant="contained"
                        endIcon={<ArrowForwardRoundedIcon />}
                        disabled={ currentQuestionIndex === questions.length - 1 }
                        onClick={handleNext}
                        sx={{
                          borderRadius: 999,
                          textTransform: 'none',
                          px: 3,
                          py: 1.1,
                          bgcolor: '#02182C',
                          '&:hover': { bgcolor: '#0A2E4E' },
                        }}
                      >
                        Next
                      </Button>
                    </Stack>
                  </Stack>
                </Box>
              </Box>
            </Box>
          </Box>
          <Box
            sx={{
              height: '100%',
              borderLeft: '1px solid #D1D5DB',
              bgcolor: '#FFFFFF',
            }}
          >
            <CandidateTestSidebar
              test={test}
              currentQuestionIndex={currentQuestionIndex}
              answeredQuestionIds={answeredQuestionIds}
              reviewQuestionIds={reviewQuestionIds}
              onQuestionClick={handleQuestionClick}
            />
          </Box>
        </Box>
      </Box>
    )
}

export default TestQuestions