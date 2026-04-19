import React, { useEffect, useState } from 'react';
import CandidateHeader from '../../components/layout/CandidateHeader';
import CandidatePracticeQuestions from '../../components/candidate/CandidatePracticeQuestions';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../../redux/store';
import { getAllPracticeQuestions } from '../../../redux/slices/features/question/practiceQuestionSlice';
import { useDebounce } from '../../../hooks/useDebounce';
import type { QuestionType, QuestionDifficulty } from '../../../types/question';
import { Box, Button, Divider, Typography } from '@mui/material';
import { Star } from 'lucide-react';
import { Lock } from '@mui/icons-material';



const CandidateDashboard: React.FC = () => {
  const [type, setType] = useState<QuestionType | ''>('');
  const [page, setPage] = useState(1)
  const [difficulty, setDifficulty] = useState<QuestionDifficulty | ''>('');
  const [searchTerm, setSearchTerm] = useState('');
  const { currentPlan, plans } = useSelector((state: RootState) => state.subscription)
  

  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const { PracticeQuestions } = useSelector(
    (state: RootState) => state.practiceQuestion
  );
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(
      getAllPracticeQuestions({
        params: {
          search: debouncedSearchTerm,
          type: type || undefined,
          difficulty: difficulty || undefined,
          page: page,
          limit: 10,
        },
        role: 'candidate',
      })
    );
  }, [debouncedSearchTerm, type, difficulty, page, dispatch]);

  const proPlan = plans.find(p => p.price > 0)

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#021A30] to-[#0B0707]">
      <CandidateHeader />
      <CandidatePracticeQuestions
        questions={PracticeQuestions}
        type={type}
        setType={setType}
        difficulty={difficulty}
        setDifficulty={setDifficulty}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        page={page}
        setPage={setPage}
      />
      {currentPlan?.price === 0 && (
        <>
          <Divider sx={{ borderColor: "#f9f7f5", my: 3 }} />
          <Box px={4} pb={6}>
            <Box
              sx={{
                background: "linear-gradient(135deg, #9D81F0, #A2BEFA)",
                borderRadius: "16px",
                textAlign: "center",
                py: 6,
                px: 3,
                mb: 4,
              }}
            >

              <Box
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: "50%",
                  background: "#e0e0e0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                }}
              >
                <Lock />
              </Box>
              <Typography variant="h6" fontWeight="bold" color="#fff" mb={1}>
                Unlock 100+ premium practice questions
              </Typography>
              <Typography variant="body2" color="#eaeaea" mb={3}>
                Upgrade to Pro to access premium practice questions, AI-powered feedback,
                and detailed performance analytics.
              </Typography>
              <Button
                variant="contained"
                sx={{
                  background: "linear-gradient(90deg, #8822F5, #9057C6)",
                  textTransform: "none",
                  borderRadius: "999px",
                  px: 4,
                  py: 1,
                  fontWeight: "bold",
                }}
              >
                Upgrade to {proPlan?.planName} - ${proPlan?.price}/ {proPlan?.billingCycle}
              </Button>
            </Box>
            <Box
              sx={{
                background: "#D3C1A0",
                borderRadius: "12px",
                px: 3,
                py: 2,
                display: "flex",
                alignItems: "flex-start",
                gap: 2,
              }}
            >
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: "#6B4705",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  flexShrink: 0,
                }}
              >
                <Star fontSize="small" />
              </Box>
              <Box>
                <Typography fontWeight="bold" color="#000">
                  Limited Access Notice
                </Typography>
                <Typography variant="body2" color="#222">
                  As a free user, you have a limited number of practice attempts per day and 
                  access only to non-premium questions. Upgrade to Pro to unlock unlimited 
                  practice and full question access.
                </Typography>
              </Box>
            </Box>
          </Box>
        </>
      )}
    </div>
  );
};

export default CandidateDashboard;