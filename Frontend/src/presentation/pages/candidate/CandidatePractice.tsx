import React, { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  Chip,
  Container,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import { ArrowBack, CheckCircle, Send } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import CandidateHeader from '../../components/layout/CandidateHeader';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../../redux/store';
import { getQuestionById, getRelatedQuestions } from '../../../redux/slices/features/question/practiceQuestionSlice';
import PracticeMcqQuestion from '../../components/candidate/practice/PracticeMcqQuestion';
import PracticeDescriptiveQuestion from '../../components/candidate/practice/PracticeDescriptiveQuestion';
import PracticeCodingQuestion from '../../components/candidate/practice/PracticeCodingQuestion';
import RelatedPracticeQuestions from '../../components/candidate/practice/RelatedPracticeQuestions';

const CandidatePractice: React.FC = () => {
  const navigate = useNavigate()
  const { questionId } = useParams()
  const dispatch = useDispatch<AppDispatch>()
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [descriptiveAnswer, setDescriptiveAnswer] = useState('')
  const [code, setCode] = useState('')
  const [showResult, setShowResult] = useState(false)
  const { selectedPracticeQuestion, PracticeQuestions} = useSelector((state: RootState) => state.practiceQuestion)

  useEffect(() => {
    if(questionId) {
      dispatch(getQuestionById({questionId}))
      dispatch(getRelatedQuestions({questionId}))
    }
  }, [dispatch, questionId])


  const mockResult = {
    isCorrect: selectedAnswer === 'O(1)',
    correctAnswer: 'O(1)',
    aiFeedback:
      'Good attempt. The correct answer is O(1) because array elements are accessed directly using their index.',
  };

  return (
    <Box minHeight="100vh" sx={{ background: 'linear-gradient(to bottom, #021A30, #0B0707)' }}>
     <CandidateHeader />
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          sx={{ color: '#D9B46F', textTransform: 'none', mb: 2 }}
        >
          Back
        </Button>

        <Grid container spacing={3}>
          <Grid size={{xs: 12, md: 8}}>
            <Card sx={{ p: 3, borderRadius: 3, background: '#fff', minHeight: 500 }}>
              <Stack direction="row" spacing={1} mb={2}>
                <Chip label={selectedPracticeQuestion?.isPremium ? 'Premium' : 'Free'} size="small" sx={{ background: '#D9B46F' }} />
                <Chip label={selectedPracticeQuestion?.type} size="small" sx={{ background: '#F5E3BD' }} />
                <Chip label={selectedPracticeQuestion?.difficulty} size="small" sx={{ background: '#F5E3BD' }} />
              </Stack>

              <Typography fontWeight={700} fontSize={17} mb={2}>
                {selectedPracticeQuestion?.title}
              </Typography>
              <Typography fontWeight={400} fontSize={13} mb={2}>
                {selectedPracticeQuestion?.description}
              </Typography>

              {selectedPracticeQuestion?.type === 'mcq' && (
                <PracticeMcqQuestion question={selectedPracticeQuestion} value={selectedAnswer} onChange={setSelectedAnswer} />
              )}

              {selectedPracticeQuestion?.type === 'descriptive' && (
                <PracticeDescriptiveQuestion value={descriptiveAnswer}onChange={setDescriptiveAnswer} />
              )}

              {selectedPracticeQuestion?.type === 'coding' && (
                <PracticeCodingQuestion question={selectedPracticeQuestion} value={code} onChange={setCode} />
              )}

              <Button
                fullWidth
                variant="contained"
                startIcon={<Send />}
                onClick={() => setShowResult(true)}
                sx={{
                  mt: 3,
                  background: '#001E33',
                  borderRadius: 2,
                  py: 1.2,
                  textTransform: 'none',
                  fontWeight: 700,
                  '&:hover': { background: '#003A5C' },
                }}
              >
                Submit
              </Button>
            </Card>
          </Grid>

          <Grid size={{xs: 12, md: 4}}>
            <Card sx={{ p: 3, borderRadius: 3, background: '#fff', minHeight: 500 }}>
              {!showResult ? (
                <Box textAlign="center" mt={15}>
                  <Typography fontWeight={700} color="text.secondary">
                    Submit your answer to see the result
                  </Typography>
                </Box>
              ) : (
                <>
                  <Stack alignItems="center" spacing={1} mb={3}>
                    {mockResult.isCorrect ? (
                      <CheckCircle sx={{ color: '#2E7D32', fontSize: 48 }} />
                    ) : (
                      <CheckCircle sx={{ color: '#C62828', fontSize: 48 }} />
                    )}

                    <Typography
                      variant="h6"
                      fontWeight={800}
                      color={mockResult.isCorrect ? '#2E7D32' : '#C62828'}
                    >
                      {mockResult.isCorrect ? 'Correct Answer' : 'Wrong Answer'}
                    </Typography>
                  </Stack>

                  {!mockResult.isCorrect && (
                    <Alert severity="info" sx={{ mb: 2 }}>
                      Correct answer: {mockResult.correctAnswer}
                    </Alert>
                  )}

                  {/* {isPremiumUser ? (
                    <Box>
                      <Typography fontWeight={800} mb={1}>
                        AI Feedback
                      </Typography>
                      <Typography color="text.secondary" lineHeight={1.8}>
                        {mockResult.aiFeedback}
                      </Typography>
                    </Box>
                  ) : (
                    <Alert icon={<Lock />} severity="warning" sx={{ background: '#D3C1A0', color: '#1E1E1E' }}>
                      Free users can only see whether the answer is correct or wrong.
                    </Alert>
                  )} */}
                </>
              )}
            </Card>
          </Grid>
        </Grid>
        <RelatedPracticeQuestions questions={PracticeQuestions} onTry={(questionId) => navigate(`/candidate/practice/${questionId}`)} />
      </Container>
    </Box>
  );
};

export default CandidatePractice