import { Box, Button, Card, Container, Tab, Tabs} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import InternalLayout from "../../layouts/InternalLayout";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../redux/store";
import { evaluateTest, getTestById, rejectCandidate, shortlistCandidate } from "../../../redux/slices/features/test/companyTestSlice";
import { companySidebarItems } from "../../../constants/sidebarItems";
import TestInfoTab from "../../components/company/test/TestInfoTab";
import TestQuestionsTab from "../../components/company/test/TestQuestionsTab";
import TestCandidatesTab from "../../components/company/test/TestCandidatesTab";
import { ArrowBack } from "@mui/icons-material";
import { ROUTES } from "../../../constants/routes";
import CandidateAnswersPage from "../../components/company/test/CandidateAnswerPage";
import toast from "react-hot-toast";
import ShortlistedCandidatesTab from "../../components/company/test/ShortlistedCandidatesTab";
import type { ModalMode, ScheduleInterviewPayload } from "../../../types/interview";
import InterviewModal from "../../components/modal/InterviewModal";
import { scheduleInterview } from "../../../redux/slices/features/interview/CompanyInterviewSlice";

type TabValue = "info" | "questions" | "candidates" | "shortlisted";

const TestDetailsPage = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { testId } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<TabValue>("info")
  const { selectedTest, loading } = useSelector((state: RootState) => state.companyTest) 
  const [selectedCandidateId, setSelectedCandidateId] = useState('')
  const [selectedInterviewCandidateId, setSelectedInterviewCandidateId] = useState('')
  const [interviewModalMode, setInterviewModalMode] = useState<ModalMode>('create')
  const [isModalOpen, setIsModalOpen] = useState(false)
 
  
  useEffect(() => {
    if(!testId) {
        console.log('test id not found')
        return
    }
    dispatch(getTestById({id: testId}))
  }, [dispatch, testId])

  if(!selectedTest) return
  
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary-600"></div>
      </div>
    )
  }

  const handleViewAnswer = (candidateId: string) => {
    setSelectedCandidateId(candidateId)
  }
  const selectedCandidate = selectedTest.candidates.find(
    (candidate) => candidate.id === selectedCandidateId
  )

  if(selectedCandidate){
    return (
      <CandidateAnswersPage candidate={selectedCandidate} questions={selectedTest.questions} onBack={() => navigate(ROUTES.COMPANY.TEST)} />
    )
  }

  const shortlistedCandidates = selectedTest.candidates.filter((candidate) => candidate.selectionStatus === 'SHORTLISTED')

  const handleEvaluation = async() => {
    try {
      if(testId){
        await dispatch(evaluateTest({testId})).unwrap()
        toast.success("Candidate answers evaluated successfully")
        await dispatch(getTestById({id: testId}))
      }
    } catch (error) {
      toast.error(typeof error === 'string' ? error : 'Failed to evaluate candidate answers')
    }
  }

  const handleShortlist = async(candidateId: string) => {
    try {
      if(candidateId && testId) {
        await dispatch(shortlistCandidate({testId, candidateId})).unwrap()
        toast.success("Candidate shortlisted successfully")
        await dispatch(getTestById({id: testId}))
      }
    } catch (error) {
      toast.error(typeof error === 'string' ? error : 'Failed to short list candidate')
    }
  }
  const handleRejectCandidate = async(candidateId: string) => {
    try {
      if(candidateId && testId){
        await dispatch(rejectCandidate({testId, candidateId})).unwrap()
        toast.success("Rejected candidate successfully")
        await dispatch(getTestById({id: testId}))
      }
    } catch (error) {
      toast.error(typeof error === 'string' ? error : 'Failed to reject candidate')
    }
  }

  const handleScheduleAgain = async() => {
    if(testId)
      navigate(`/company/test/reschedule/${testId}`)
  }

  const handleScheduleInterview = (candidateId: string) => {
    setSelectedInterviewCandidateId(candidateId)
    setInterviewModalMode('create')
    setIsModalOpen(true)
  }
  const selectedInterviewCandidate = shortlistedCandidates.find(candidate => candidate.id === selectedInterviewCandidateId)

  const handleInterviewSubmit = async(data: ScheduleInterviewPayload) => {
    try {
      await dispatch(scheduleInterview({data})).unwrap()
      toast.success('Interview scheduled successfully')
      navigate(ROUTES.COMPANY.INTERVIEWS)
    } catch (error) {
      toast.error(typeof error === 'string' ? error : 'Failed to schedule interview')
    }
  }
  return (
    <InternalLayout title={selectedTest.name} subTitle={selectedTest.jobrole} sidebarItems={companySidebarItems}>
      <Button
        onClick={() => navigate(ROUTES.COMPANY.TEST)}
      >
        <ArrowBack sx={{ color: '#3f3c3c'}}/>
      </Button>
        <Container maxWidth="lg" sx={{ py: 3 }}>
        <Card sx={{ mt: 3, borderRadius: 3 }}>
            <Tabs
                value={activeTab}
                onChange={(_, value) => setActiveTab(value)}
                sx={{
                    px: 2,
                    "& .MuiTab-root": {
                    textTransform: "none",
                    fontWeight: 700,
                    },
                    "& .Mui-selected": {
                    bgcolor: "#7A4F00",
                    color: "#fff !important",
                    borderRadius: 2,
                    },
                }}
            >
            <Tab label="Test Info" value="info" />
            <Tab label="Questions" value="questions" />
            <Tab label="Candidates" value="candidates" />
            <Tab label="Shortlisted Candidates" value="shortlisted" />
            </Tabs>

            <Box sx={{ p: 3 }}>
            {activeTab === "info" && <TestInfoTab test={selectedTest} />}
            {activeTab === "questions" && (
                <TestQuestionsTab questions={selectedTest.questions} />
            )}
            {activeTab === "candidates" && (
                <TestCandidatesTab candidates={selectedTest.candidates} onViewAnswers={handleViewAnswer} onEvaluateSubmitted={handleEvaluation} onShortlist={handleShortlist} onReject={handleRejectCandidate} onScheduleAgain={handleScheduleAgain}/>
            )}
            {activeTab === "shortlisted" && (
                <ShortlistedCandidatesTab candidates={shortlistedCandidates} onScheduleInterview={handleScheduleInterview} />
            )}
            </Box>
        </Card>
        </Container>
        <InterviewModal
          loading={loading}
          isOpen={isModalOpen}
          mode={interviewModalMode}
          onClose={() => setIsModalOpen(false)}
          defaultData={{
            testCandidateId: selectedInterviewCandidate?.id,
            candidateName: selectedInterviewCandidate?.name,
            candidateEmail: selectedInterviewCandidate?.email,
            testId: selectedTest.id,
            jobRoleId: selectedTest.jobRoleId,
            round: 1,
          }}
          onSave={handleInterviewSubmit}
        />
    </InternalLayout>
  );
};

export default TestDetailsPage;