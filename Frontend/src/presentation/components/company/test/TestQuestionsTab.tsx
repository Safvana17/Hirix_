import React from "react";
import type { TestQuestions } from "../../../../types/test";
import { Box, Chip, Paper, Stack, Typography } from "@mui/material";

export interface TestQuestionsTabProps {
  questions: TestQuestions[];
}

const TestQuestionsTab: React.FC<TestQuestionsTabProps> = ({ questions }) => {
  if (!questions.length) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 2,
          bgcolor: "#fff",
          border: "1px solid",
          borderColor: "divider",
          textAlign: "center",
        }}
      >
        <Typography variant="body2" color="text.secondary">
          No questions added.
        </Typography>
      </Paper>
    );
  }

  return (
    <Box>
      <Box mb={2.5}>
        <Typography variant="h6" fontWeight={700}>
          Questions
        </Typography>

        <Typography variant="body2" color="text.secondary" mt={0.5}>
          {questions.length} questions are included in this assessment.
        </Typography>
      </Box>

      <Stack spacing={1.5}>
        {questions.map((question, index) => (
          <Paper
            key={question.id}
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: "#fff",
              border: "1px solid",
              borderColor: "#E8E8E8",
              display: "flex",
              gap: 1.5,
              alignItems: "flex-start",
            }}
          >
            <Box
              sx={{
                width: 30,
                height: 30,
                borderRadius: "8px",
                bgcolor: "#F5F6F8",
                color: "text.secondary",
                display: "grid",
                placeItems: "center",
                fontSize: 13,
                fontWeight: 600,
                flexShrink: 0,
              }}
            >
              {index + 1}
            </Box>

            <Box flex={1} minWidth={0}>
              <Typography
                variant="body1"
                fontWeight={600}
                color="text.primary"
                sx={{
                  lineHeight: 1.5,
                  wordBreak: "break-word",
                }}
              >
                {question.title || "-"}
              </Typography>

              <Stack
                direction="row"
                spacing={1}
                flexWrap="wrap"
                useFlexGap
                mt={1.2}
              >
                <SoftChip label={question.type || "-"} />
                <SoftChip label={question.source || "-"} />
              </Stack>
            </Box>
          </Paper>
        ))}
      </Stack>
    </Box>
  );
};

export default TestQuestionsTab;

const SoftChip = ({ label }: { label: string }) => {
  return (
    <Chip
      label={label}
      size="small"
      sx={{
        height: 24,
        bgcolor: "#F5F6F8",
        color: "text.secondary",
        fontSize: 12,
        fontWeight: 500,
        borderRadius: 1.5,
      }}
    />
  );
};