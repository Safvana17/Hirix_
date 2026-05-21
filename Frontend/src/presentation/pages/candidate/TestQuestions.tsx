import React, { useMemo, useState } from 'react'
import { Box, Button, Chip, Divider, Stack, Typography } from '@mui/material'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import BookmarkBorderRoundedIcon from '@mui/icons-material/BookmarkBorderRounded'
import BookmarkRoundedIcon from '@mui/icons-material/BookmarkRounded'
import CandidateTestHeader from '../../components/candidate/test/CandidateTestHeader'
import CandidateTestSidebar from '../../components/candidate/test/CandidateTestSidebar'
import type { CandidateTest, TestCandidate } from '../../../types/test'
import QuestionRenderer from '../../components/candidate/test/QuestionRender'
import { useTestRunTime } from '../../../hooks/useTestRunTime'
import TestWarningBanner from '../../components/candidate/test/TestWarningBanner'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import type { AppDispatch } from '../../../redux/store'
import { submitTest, terninateTest } from '../../../redux/slices/features/test/CandidateTestSlice'
import { useNavigate, useParams } from 'react-router-dom'
import { ROUTES } from '../../../constants/routes'
// import { useFullScreenMonitor } from '../../../hooks/useFullScreenMonitor'


interface TestQuestionsProps {
  test: CandidateTest
  candidate: TestCandidate
}
 
const TestQuestion: React.FC <TestQuestionsProps> = ({test, candidate}) => {
    const { token } = useParams()
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const questions = test?.questions ?? []
    const currentQuestion = questions[currentQuestionIndex]
    const [warningMessage, setWarningMessage] = useState<string | null>(null)
    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate()

    const runTime = useTestRunTime({
      test,
      rules: test.rules,
      candidate: candidate!,
      onSaveAnswers: async () => {
        console.log('saved answers')
      },
      onSubmitTest: async (answers) => {
        try {
          if(!token) return
          await dispatch(submitTest({token, answer: Object.values(answers), warningCount: runTime.warningCount})).unwrap()
          navigate(`/candidate/test/${token}`)
        } catch (error) {
          toast.error(typeof error === 'string' ? error : 'Failed to submit test')
        }
      },
      onTerminateTest: async (reason, answers) => {
        console.log("terminated", reason)
        try {
          if(!token) return
          await dispatch(terninateTest({token, answer: Object.values(answers), warningCount: runTime.warningCount})).unwrap()
          navigate(ROUTES.CANDIDATE.TEST_TERMINATE)
        } catch (error) {
          toast.error(typeof error === 'string' ? error : 'Failed to terminate test')
        }
      },
      onWarning: ({type, warningCount}) => {
        const messageMap = {
            TAB_SWITCH: 'Tab switch detected! Please stay on the test window.',
            FULLSCREEN_EXIT: 'Fullscreen exit detected! Please stay in fullscreen mode.',
            COPY_PASTE: 'Copy or paste action detected.',
            RIGHT_CLICK: 'Right click is not allowed during the test.',
            KEYBOARD_SHORTCUT: 'Keyboard shortcuts are restricted during the test.',
            NO_FACE: 'No face detected in camera.',
            MULTIPLE_FACE: 'Multiple faces detected in camera.',
        }
        console.log('warning: ',type, warningCount)
        setWarningMessage(messageMap[type] || 'Rule violation detected.')
        console.log("WARNING MESSAGE STATE:", warningMessage)
      }
    })

    const answeredQuestionIds = useMemo(() => {
        return Object.keys(runTime.answers).filter((questionId) => {
          const answer = runTime.answers[questionId]
            return (
              answer.selectedOptionIds?.length ||
              answer.descriptiveAnswer ||
              answer.codingAnswer?.code
            )
        })
    }, [runTime.answers])

    if(!test || !candidate) return null

    const handleQuestionClick = (index: number) => {
      runTime.trackQuestionTime(questions[index].id)
      setCurrentQuestionIndex(index)
    }

    const handleNext = () => {
        runTime.trackQuestionTime(currentQuestion.id)
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex((prev) => prev + 1)
        }
    }

    const handlePrevious = () => {
      if(!test.rules.navigation.allowBackNavigation){
         toast.error("Back navigation is not allowed")
         return
      }else{
        runTime.trackQuestionTime(currentQuestion.id)
        if (currentQuestionIndex > 0) {
          setCurrentQuestionIndex((prev) => prev - 1)
        }
      }
    }

    if (!currentQuestion) {
        return <p>No questions found</p>
    }


    const isMarkedForReview = runTime.answers[currentQuestion.id] ?.isMarkedForReview ?? false
    return (
      <Box sx={{ height: '100vh', overflow: 'hidden', background: 'linear-gradient(to bottom, #021A30, #0B0707)', }} >
        <CandidateTestHeader test={test} onSubmit={runTime.handleSubmit} />
        {warningMessage && (
          <TestWarningBanner 
             warningCount={runTime.warningCount}
             maxWarningCount={test.rules.warning.maxWarningCount}
             message={warningMessage}
             onClose={() => setWarningMessage(null)}
          />
        )}
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
                    value={
                      runTime.answers[currentQuestion.id]
                        ?.descriptiveAnswer || 
                      runTime.answers[currentQuestion.id]
                        ?.codingAnswer?.code ||
                      runTime.answers[currentQuestion.id]
                        ?.selectedOptionIds?.[0]  || ""
                    }
                    onChange={(value) =>
                      runTime.updateAnswer({
                        question: currentQuestion,
                        value
                      })
                    }
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
                        onClick={() => runTime.toggleMarkForReview(currentQuestion)}
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
              reviewQuestionIds={Object.keys(runTime.answers).filter((questionId) =>
                runTime.answers[questionId]?.isMarkedForReview 
              )}
              onQuestionClick={handleQuestionClick}
            />
          </Box>
        </Box>
      </Box>
    )
}

export default TestQuestion