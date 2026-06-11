import React, { useEffect, useState } from 'react';
import moment from 'moment';
import CandidateHeader from '../../components/layout/CandidateHeader';
import CandidatePracticeQuestions from '../../components/candidate/CandidatePracticeQuestions';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../../redux/store';
import { getAllPracticeQuestions } from '../../../redux/slices/features/question/practiceQuestionSlice';
import { useDebounce } from '../../../hooks/useDebounce';
import type { QuestionType, QuestionDifficulty } from '../../../types/question';
import { Box, Button, Divider, Grid, Typography } from '@mui/material';
import { CheckCircle2, ClipboardCheck, Star, StarsIcon, Target } from 'lucide-react';
import { Lock } from '@mui/icons-material';
import { getAllPlans } from '../../../redux/slices/features/subscription/subscriptionSlice';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';
import SummeryCard from '../../components/layout/SummeryCard';
import { getCandidateDashboardSummary, getTestHistory } from '../../../redux/slices/features/analytics/adminAnalysticsSlice';
import type { Column } from '../../../types/table';
import type { TestHistory } from '../../../types/analytics';
import DataTable from '../../components/ui/DataTable';



const CandidateDashboard: React.FC = () => {
  const [type, setType] = useState<QuestionType | ''>('')
  const [page, setPage] = useState(1)
  const [hitoryPage, setHistoryPage] = useState(1)
  const [difficulty, setDifficulty] = useState<QuestionDifficulty | ''>('');
  const [searchTerm, setSearchTerm] = useState('');
  const { currentPlan, plans } = useSelector((state: RootState) => state.subscription)
  const { user } = useSelector((state: RootState) => state.auth)
  const navigate = useNavigate()
  const debouncedSearchTerm = useDebounce(searchTerm, 500)
  const { PracticeQuestions } = useSelector( (state: RootState) => state.practiceQuestion)
  const { candidateSummary, testHistory, pagination, loading } = useSelector((state: RootState) => state.adminAnalytics)
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if(user){
      dispatch(getAllPlans({params: {target: 'candidate'}, role: user?.role}))
      dispatch(getTestHistory({params: {page: hitoryPage || undefined, limit: 5}}))
      dispatch(getCandidateDashboardSummary())
    }
  }, [dispatch, user, hitoryPage])

  useEffect(() => {
    if(user){
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
      )
    }
  }, [debouncedSearchTerm, type, difficulty, user, page, dispatch]);

  const proPlan = plans.find(p => p.price > 0)

    const columns: Column<TestHistory>[] =  [
      {header: 'Type', key: 'company', render: (val) => <span className='font-bold text-gray-800'>{val}</span>},
      {header: 'Name', key: 'testName', render: (val) => <span className='font-bold text-gray-800'>{val}</span>},
      {header: 'Plan', key: 'jobRole', render: (val) => <span className='font-bold text-gray-800'>{val}</span>},
      {header: 'Date', key: 'date', render: (val) => <span className='font-bold text-gray-800'>{moment(val).format('DD MMM YYYY hh: mm: A')}</span>},
      {header: 'Status', key: 'status', render: (val) => (
         <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${val === 'success' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
            {val}
         </span>
      )},
    ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#021A30] to-[#0B0707]">
      <CandidateHeader />
      <Grid container spacing={2} sx={{ mt: 5, mx: 3}}>
        <Grid size={{xs: 10, md: 3}} >
          <SummeryCard label='Total Questions Attempted' value={candidateSummary?.totalQuestionsAttempted ?? 0} icon={CheckCircle2} color='#53601d' bg='#000'/>
        </Grid>
        <Grid size={{xs: 10, md: 3}}>
          <SummeryCard label='Accuracy' value={`${candidateSummary?.accuracy ?? 0}%`} icon={Target} color='#53601d' bg='#000'/>
        </Grid>
        <Grid size={{xs: 10, md: 3}}>
          <SummeryCard label='Total Tests Attended' value={candidateSummary?.totalTestAttended ?? 0} icon={ClipboardCheck} color='black' bg='black'/>
        </Grid>
        <Grid size={{xs: 10, md: 3}}>
          <SummeryCard label='Current Plan' value={candidateSummary?.currentPlan ?? 'Free'} icon={StarsIcon} color='black' bg='white'/>
        </Grid>
      </Grid>
      {testHistory.length !== 0 && (
      <Grid sx={{ mt: 3, mx: 3}}>
        <DataTable
          columns={columns}
          isLoading={loading}
          data={testHistory}
          emptyMessage='No payment history available'
          pagination={{
            currentPage: page ,
            totalPages: pagination.test.totalPages,
            totalCount: pagination.test.totalCount,
            onPageChange: (page) => setHistoryPage(page)
          }}
        >
        </DataTable>
      </Grid>
      )}
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
                onClick={() => navigate(ROUTES.CANDIDATE.SUBSCRIPTION)}
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