import {
  Box,
  Card,
  CircularProgress,
  Container,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import InternalLayout from "../../layouts/InternalLayout";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../redux/store";
import { getTestById } from "../../../redux/slices/features/test/companyTestSlice";
import { companySidebarItems } from "../../../constants/sidebarItems";
import TestInfoTab from "../../components/company/test/TestInfoTab";
import TestQuestionsTab from "../../components/company/test/TestQuestionsTab";
import TestCandidatesTab from "../../components/company/test/TestCandidatesTab";

type TabValue = "info" | "questions" | "candidates" | "shortlisted";

const TestDetailsPage = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { testId } = useParams();
  const [activeTab, setActiveTab] = useState<TabValue>("info")
  const { selectedTest, loading, error } = useSelector((state: RootState) => state.companyTest) 
  
  useEffect(() => {
    if(!testId) {
        console.log('test id not found')
        return
    }
    dispatch(getTestById({id: testId}))
  }, [dispatch, testId])

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={8}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !selectedTest) {
    return <Typography color="error">Failed to load test details</Typography>;
  }

  return (
    <InternalLayout title={selectedTest.name} subTitle="" sidebarItems={companySidebarItems}>
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
                <TestCandidatesTab candidates={selectedTest.candidates} />
            )}
            {/* {activeTab === "shortlisted" && (
                <TestCandidatesTab candidates={test.shortlistedCandidates} />
            )} */}
            </Box>
        </Card>
        </Container>
    </InternalLayout>
  );
};

export default TestDetailsPage;