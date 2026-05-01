import { EditNote } from "@mui/icons-material"
import { Box, Paper, Typography } from "@mui/material"
import React from "react"

const CompanyTestPublishPage: React.FC = () => {
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
          <EditNote
            sx={{
              fontSize: 52,
              color: "#795003",
            }}
          />
        </Box>

        <Typography variant="h5" fontWeight={800} mb={1.5}>
          Save test as draft
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: "#8A8A8A",
            mb: 1,
            maxWidth: 520,
          }}
        >
          Store your test details, candidates, questions, and rules as a draft.
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: "#8A8A8A",
            maxWidth: 560,
          }}
        >
          You can review, edit, publish, or delete this test while it is in draft.
          Once published, candidate links will be generated and the test cannot be deleted.
        </Typography>
      </Paper>
    </Box>
  )
}

export default CompanyTestPublishPage