import { CalendarMonth, EditNote, Save } from "@mui/icons-material"
import { Box, Paper, Typography } from "@mui/material"
import React from "react"
import type { ModalMode } from "../../../../types/test"


interface CompanyTestPublishPageProps {
  mode: ModalMode
}
const CompanyTestPublishPage: React.FC <CompanyTestPublishPageProps> = ({mode}) => {
  const isEdit = mode === 'edit'
  const isReschedule = mode === 'reschedule'

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
          minHeight: 360,
          mx: "auto",
          p: { xs: 3, md: 6 },
          borderRadius: 1,
          backgroundColor: "#fff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <Box
          sx={{
            width: 105,
            height: 105,
            borderRadius: "50%",
            backgroundColor: "#F5E6C8",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 3,
          }}
        >
          {isEdit ? (
            <Save sx={{ fontSize: 52, color: '#795003'}} />
          ): ( isReschedule ? (
             <CalendarMonth sx={{ fontSize: 52, color: '#795003'}} />
          ):(
            <EditNote sx={{ fontSize: 52, color: "#795003" }} />
          ))}
        </Box>

        <Typography variant="h5" fontWeight={800} mb={1.5}>
          { isEdit ? 'Update test changes' : isReschedule ? 'Schedule test again' :'Save test as draft' }
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: "#8A8A8A",
            mb: 1,
            maxWidth: 520,
          }}
        >
          { isEdit 
            ? 'Review your updated test details, candidates, questions and rules before saving'
            : isReschedule 
            ? 'Review the copied test details, candidates, questions, and rules before scheduling this test again with the new time.'
            : 'Store your test details, candidates, questions, and rules as a draft.'
          }
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: "#8A8A8A",
            maxWidth: 560,
          }}
        >
          {isEdit
            ? "If this test is already published, affected candidates may be notified based on the changes made."
            : isReschedule
            ? 'This will create a new scheduled test. The original test and its candidate history will remain unchanged.'
            : "You can review, edit, publish, or delete this test while it is in draft. Once published, candidate links will be generated and the test cannot be deleted."
          }
        </Typography>
      </Paper>
    </Box>
  )
}

export default CompanyTestPublishPage