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
import { ArrowBack, CheckCircle, Lock, Send } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import CandidateHeader from '../../components/layout/CandidateHeader';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../../redux/store';
import { getExplanation, getQuestionById, getRelatedQuestions, submitAnswer} from '../../../redux/slices/features/question/practiceQuestionSlice';
import PracticeMcqQuestion from '../../components/candidate/practice/PracticeMcqQuestion';
import PracticeDescriptiveQuestion from '../../components/candidate/practice/PracticeDescriptiveQuestion';
import PracticeCodingQuestion from '../../components/candidate/practice/PracticeCodingQuestion';
import RelatedPracticeQuestions from '../../components/candidate/practice/RelatedPracticeQuestions';
import toast from 'react-hot-toast';
import type { CodingLanguage } from '../../../types/test';
import type { PracticeResultResponse } from '../../../types/question';

const CandidatePractice: React.FC = () => {
  const navigate = useNavigate();
  const { questionId } = useParams();
  const dispatch = useDispatch<AppDispatch>();

  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [descriptiveAnswer, setDescriptiveAnswer] = useState('');
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState<CodingLanguage>('javascript');

  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<PracticeResultResponse | null>(null);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isExplanationLoading, setIsExplanationLoading] = useState(false);

  const { selectedPracticeQuestion, PracticeQuestions } = useSelector(
    (state: RootState) => state.practiceQuestion
  );

  useEffect(() => {
    if (questionId) {
      dispatch(getQuestionById({ questionId }));
      dispatch(getRelatedQuestions({ questionId }));

      setSelectedAnswer('');
      setDescriptiveAnswer('');
      setCode('');
      setShowResult(false);
      setResult(null);
      setExplanation(null);
    }
  }, [dispatch, questionId]);

  const getAnswer = () => {
    if (!selectedPracticeQuestion) return null;

    switch (selectedPracticeQuestion.type) {
      case 'mcq':
        return {
          questionType: selectedPracticeQuestion.type,
          selectedOption: selectedAnswer ? [selectedAnswer] : [],
        };

      case 'descriptive':
        return {
          questionType: selectedPracticeQuestion.type,
          descriptiveAnswer,
        };

      case 'coding':
        return {
          questionType: selectedPracticeQuestion.type,
          codingAnswer: {
            sourceCode: code,
            language,
          },
        };

      default:
        return null;
    }
  };

  const handleSubmit = async () => {
    if (!questionId) return;

    const data = getAnswer();

    if (!data) {
      toast.error('Please enter your answer');
      return;
    }

    try {
      const submitResult = await dispatch(
        submitAnswer({ questionId, data })
      ).unwrap();

      setResult(submitResult);
      setShowResult(true);
      setExplanation(null);

      toast.success(submitResult.isCorrect ? 'Correct Answer' : 'Wrong Answer');
    } catch (error) {
      toast.error(typeof error === 'string' ? error : 'Failed to submit answer');
    }
  };

  const handleGetExplanation = async () => {
    if (!questionId) return;

    try {
      setIsExplanationLoading(true);

      const explanationResult = await dispatch(
        getExplanation({ questionId })
      ).unwrap();
console.log('result from page', explanationResult)
      setExplanation(explanationResult);
    } catch (error) {
      toast.error(
        typeof error === 'string' ? error : 'Failed to get explanation'
      );
    } finally {
      setIsExplanationLoading(false);
    }
  };
console.log("explanation from page: ",  explanation)
  return (
    <Box
      minHeight="100vh"
      sx={{ background: 'linear-gradient(to bottom, #021A30, #0B0707)' }}
    >
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
          <Grid size={{ xs: 12, md: 8 }}>
            <Card
              sx={{
                p: 3,
                borderRadius: 3,
                background: '#fff',
                minHeight: 500,
              }}
            >
              <Stack direction="row" spacing={1} mb={2}>
                <Chip
                  label={selectedPracticeQuestion?.isPremium ? 'Premium' : 'Free'}
                  size="small"
                  sx={{ background: '#D9B46F' }}
                />
                <Chip
                  label={selectedPracticeQuestion?.type}
                  size="small"
                  sx={{ background: '#F5E3BD' }}
                />
                <Chip
                  label={selectedPracticeQuestion?.difficulty}
                  size="small"
                  sx={{ background: '#F5E3BD' }}
                />
                {selectedPracticeQuestion?.isAttended && (
                  <Chip
                    label="✓ Attended"
                    size="small"
                    sx={{
                      backgroundColor: "#DCFCE7",
                      color: "#166534",
                      fontWeight: 600,
                    }}
                  />
                )}
              </Stack>

              <Typography fontWeight={700} fontSize={17} mb={2}>
                {selectedPracticeQuestion?.title}
              </Typography>

              <Typography fontWeight={400} fontSize={13} mb={2}>
                {selectedPracticeQuestion?.description}
              </Typography>

              {selectedPracticeQuestion?.type === 'mcq' && (
                <PracticeMcqQuestion
                  question={selectedPracticeQuestion}
                  value={selectedAnswer}
                  onChange={setSelectedAnswer}
                />
              )}

              {selectedPracticeQuestion?.type === 'descriptive' && (
                <PracticeDescriptiveQuestion
                  value={descriptiveAnswer}
                  onChange={setDescriptiveAnswer}
                />
              )}

              {selectedPracticeQuestion?.type === 'coding' && (
                <PracticeCodingQuestion
                  question={selectedPracticeQuestion}
                  value={code}
                  onLanguageChange={setLanguage}
                  onChange={setCode}
                />
              )}

              <Button
                fullWidth
                variant="contained"
                startIcon={<Send />}
                onClick={handleSubmit}
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

          <Grid size={{ xs: 12, md: 4 }}>
            <Card
              sx={{
                p: 3,
                borderRadius: 3,
                background: '#fff',
                minHeight: 500,
              }}
            >
              {!showResult || !result ? (
                <Box textAlign="center" mt={15}>
                  <Typography fontWeight={700} color="text.secondary">
                    Submit your answer to see the result
                  </Typography>
                </Box>
              ) : (
                <>
                  <Stack alignItems="center" spacing={1} mb={3}>
                    <CheckCircle
                      sx={{
                        color: result.isCorrect ? '#2E7D32' : '#C62828',
                        fontSize: 48,
                      }}
                    />

                    <Typography
                      variant="h6"
                      fontWeight={800}
                      color={result.isCorrect ? '#2E7D32' : '#C62828'}
                    >
                      {result.isCorrect ? 'Correct Answer' : 'Wrong Answer'}
                    </Typography>
                  </Stack>

                  {result.feedback ? (
                    <Box>
                      <Typography fontWeight={800} mb={1}>
                        Feedback:
                      </Typography>

                      <Typography color="text.secondary" lineHeight={1.8}>
                        {result.feedback}
                      </Typography>

                      {result.hasDetailedExplanation && explanation && (
                        <Box
                          sx={{
                            mt: 3,
                            p: 2,
                            border: '2px solid #001E33',
                            borderRadius: 2,
                            backgroundColor: '#F4F7FA',
                            maxHeight: 300,
                            overflowY: 'auto',
                          }}
                        >
                          <Typography
                            variant="h6"
                            fontWeight={700}
                            mb={2}
                            color="#001E33"
                          >
                            AI Explanation
                          </Typography>

                          <Typography
                            sx={{
                              whiteSpace: 'pre-wrap',
                              color: '#333',
                              lineHeight: 1.8,
                            }}
                          >
                            {explanation}
                          </Typography>
                        </Box>
                      )}

                      {result.hasDetailedExplanation && !explanation && (
                        <Button
                          variant="contained"
                          onClick={handleGetExplanation}
                          disabled={isExplanationLoading}
                          sx={{
                            mt: 2,
                            textTransform: 'none',
                            background: '#001E33',
                            '&:hover': { background: '#003A5C' },
                          }}
                        >
                          {isExplanationLoading
                            ? 'Loading Explanation...'
                            : 'Get AI Explanation'}
                        </Button>
                      )}
                    </Box>
                  ) : (
                    <Alert
                      icon={<Lock />}
                      severity="warning"
                      sx={{ background: '#D3C1A0', color: '#1E1E1E' }}
                    >
                      Free users can only see whether the answer is correct or
                      wrong.
                    </Alert>
                  )}
                </>
              )}
            </Card>
          </Grid>
        </Grid>

        <RelatedPracticeQuestions
          questions={PracticeQuestions}
          onTry={(questionId) => navigate(`/candidate/practice/${questionId}`)}
        />
      </Container>
    </Box>
  );
};

export default CandidatePractice;