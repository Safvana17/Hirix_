import { Check, InfoOutlined } from "@mui/icons-material"
import { Box, Button, Paper, Typography } from "@mui/material"
import React from "react"
import { useNavigate } from "react-router-dom"
import { ROUTES } from "../../../../constants/routes"
// import { useDispatch, useSelector } from "react-redux"
// import type { AppDispatch, RootState } from "../../../../redux/store"
// import toast from "react-hot-toast"
// import { publishTest } from "../../../../redux/slices/features/test/companyTestSlice"

const TestCreateSuccessPage: React.FC = () => {
  const navigate = useNavigate()
  // const dispatch = useDispatch<AppDispatch>()
  // const {selectedTest } = useSelector((state:RootState) => state.companyTest)
  // const location = useLocation()

  // const testId = location.state?.testId

  // const handlePublishTest = async() => {
  //   try {
  //     if (!selectedTest) {
  //       console.log('id not found')
  //       return
  //     }
  //     await dispatch(publishTest({id: selectedTest.id})).unwrap()
  //     toast.success('Your test has been published.')
  //     navigate(ROUTES.COMPANY.TEST)
  //   } catch (error) {
  //     toast.error(typeof error === 'string' ? error : 'Failed to publish test')
  //   }

  // }

  return (
    <Box
      sx={{
        backgroundColor: "#E6DECF",
        borderRadius: 3,
        p: { xs: 2, md: 4 },
      }}
    >
      <Paper
        elevation={0}
        sx={{
          maxWidth: 760,
          mx: "auto",
          p: { xs: 3, md: 5 },
          borderRadius: 1,
          backgroundColor: "#fff",
          textAlign: "center",
        }}
      >
        <Box
          sx={{
            width: 105,
            height: 105,
            borderRadius: "50%",
            backgroundColor: "#A9F7C8",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mx: "auto",
            mb: 3,
          }}
        >
          <Check sx={{ fontSize: 52, color: "#1F8F4D" }} />
        </Box>

        <Typography variant="h6" fontWeight={800} mb={2}>
          Test saved as draft successfully
        </Typography>

        <Typography variant="body2" sx={{ color: "#555", mb: 3 }}>
          Your test details, candidates, questions, and rules are saved safely.
        </Typography>

        <Box
          sx={{
            maxWidth: 560,
            mx: "auto",
            textAlign: "left",
            mb: 3,
          }}
        >
          <Instruction text="You can review and edit this test before publishing." />
          <Instruction text="Candidate links will be generated only after publishing." />
          <Instruction text="Invitation emails will be sent to candidates after publishing." />
          <Instruction text="Draft tests can be deleted before publishing." />
        </Box>

        <Box
          sx={{
            maxWidth: 560,
            mx: "auto",
            textAlign: "left",
            border: "1px solid #F36B6B",
            backgroundColor: "#FFEAEA",
            p: 2,
            mb: 3,
          }}
        >
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <InfoOutlined sx={{ color: "#C62828", fontSize: 20 }} />
            <Typography fontWeight={800} color="#C62828">
              Important
            </Typography>
          </Box>

          <Typography variant="body2" sx={{ color: "#C62828", fontSize: 13 }}>
            After publishing, candidate test links will be generated and the test
            cannot be deleted. You can only reschedule, cancel, or manage allowed
            updates.
          </Typography>
        </Box>

        <Box display="flex" justifyContent="center" gap={2} flexWrap="wrap">
          <Button
            variant="outlined"
            sx={{
              color: "#6B4705",
              borderColor: "#6B4705",
              textTransform: "none",
              fontWeight: 700,
              borderRadius: 2,
              px: 3,
              py: 1,
              "&:hover": {
                borderColor: "#563904",
                backgroundColor: "#F8EFE0",
              },
            }}
            onClick={() => navigate(ROUTES.COMPANY.TEST)}
          >
            View All Tests
          </Button>

          {/* <Button
            variant="contained"
            sx={{
              backgroundColor: "#6B4705",
              color: "#fff",
              textTransform: "none",
              fontWeight: 700,
              borderRadius: 2,
              px: 3,
              py: 1,
              "&:hover": {
                backgroundColor: "#563904",
              },
            }}
            onClick={handlePublishTest}
          >
            Publish Test
          </Button> */}
        </Box>
      </Paper>
    </Box>
  )
}

const Instruction = ({ text }: { text: string }) => {
  return (
    <Box display="flex" alignItems="flex-start" gap={1.5} mb={1.5}>
      <Box
        sx={{
          width: 9,
          height: 9,
          borderRadius: "50%",
          backgroundColor: "#6B4705",
          mt: "6px",
          flexShrink: 0,
        }}
      />

      <Typography variant="body2" sx={{ color: "#333" }}>
        {text}
      </Typography>
    </Box>
  )
}

export default TestCreateSuccessPage