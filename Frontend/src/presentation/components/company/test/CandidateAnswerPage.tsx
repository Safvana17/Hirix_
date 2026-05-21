import React, { useMemo } from "react";
import { Box, Chip, Divider, Paper, Stack, Typography, Button} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import type { TestCandidate, TestQuestions } from "../../../../types/test";

interface CandidateAnswerPageProps {
  candidate: TestCandidate;
  questions: TestQuestions[];
  onBack: () => void;
}

const CandidateAnswersPage: React.FC<CandidateAnswerPageProps> = ({ candidate, questions, onBack }) => {
  const questionMap = useMemo(() => {
    return new Map(
      questions.map((question) => [question.id, question])
    );
  }, [questions]);

  const timeTaken = useMemo(() => {
    if (!candidate.startedAt || !candidate.submittedAt) {
      return "-";
    }
    const start = new Date(candidate.startedAt).getTime();
    const end = new Date(candidate.submittedAt).getTime();
    if (isNaN(start) || isNaN(end)) {
      return "-";
    }
    const minutes = Math.round((end - start) / 1000 / 60);
    return `${minutes} min`;
  }, [candidate]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#E9DFC9",
        py: { xs: 2, md: 4 },
        px: { xs: 1.5, md: 4 },
      }}
    >
      <Paper
        elevation={0}
        sx={{
          maxWidth: 900,
          mx: "auto",
          bgcolor: "#fff",
          p: { xs: 2, md: 4 },
          borderRadius: 1,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1} mb={3}>
          <Button
            startIcon={<ArrowBackRoundedIcon />}
            onClick={onBack}
            sx={{
              textTransform: "none",
              fontWeight: 700,
            }}
          >
            Back
          </Button>

          <Typography variant="h5" fontWeight={900}>
            ANSWERS
          </Typography>
        </Stack>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
            },
            gap: 1.5,
            mb: 2,
          }}
        >
          <Info label="Name" value={candidate.name || "-"} />
          <Info label="Email" value={candidate.email} />
          <Info label="Correct Answers" value={`${candidate.correctAnswerCount ?? "-"} / ${candidate.totalQuestions ?? "-"}`} />
          <Info label="Warnings" value={String(candidate.warningCount ?? 0)}/>
          <Info label="Time Taken" value={timeTaken} />
          <Info label="Rank" value={String(candidate.aiRank ?? "-")}/>
          <Info label="Score" value={ candidate.marksObtained !== undefined ? `${candidate.marksObtained} / ${candidate.totalMarks ?? "-"}` : "-"}/>
          <Info label="Status" value={ candidate.selectionStatus || candidate.candidateTestStatus } chip />
        </Box>
        <Divider sx={{ my: 3 }} />
        <Stack spacing={3}>
          {candidate.candidateAnswers.map((answer, index) => {
            const question = questionMap.get(answer.testQuestionId)
            const type = answer.questionType .toString().toUpperCase();
            return (
              <Box
                key={answer.id}
                sx={{
                  bgcolor: "#D9D9D9",
                  p: 2,
                  borderRadius: 1,
                }}
              >
                <Stack
                  direction="row"
                  alignItems="flex-start"
                  spacing={1.5}
                >
                  <Box
                    sx={{
                      minWidth: 28,
                      height: 28,
                      bgcolor: "#fff",
                      display: "grid",
                      placeItems: "center",
                      fontWeight: 800,
                    }}
                  >
                    {index + 1}
                  </Box>
                  <Box flex={1}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="flex-start"
                      spacing={2}
                    >
                      <Typography variant="subtitle2" fontWeight={800}>
                        {question?.title || "Question"}
                      </Typography>
                      {candidate.evaluationStatus === "NOT_EVALUATED" ? (
                        <Chip label="Not Evaluated"/>
                      ): (
                        <EvaluationResultChip
                            isCorrect={answer.isCorrect}
                            marksObtained={answer.marksObtained}
                            totalMarks={answer.totalMarks}
                            questionType={type}
                        />                        
                      )}
                    </Stack>
                      <Typography variant="body2" fontWeight={800}>
                        {question?.description || "Question"}
                      </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Answer:
                    </Typography>
                    <Box
                      sx={{
                        mt: 1,
                        bgcolor: "#fff",
                        p: 2,
                        maxWidth: 600,
                        fontSize: 13,
                        whiteSpace: "pre-wrap",
                        overflowX: "auto",
                        fontFamily:
                          type === "CODING"
                            ? "monospace"
                            : "inherit",
                      }}
                    >
                      {type === "MCQ" && (
                        answer.selectedOptionIds?.join(", ") ||
                        "Not answered"
                      )}
                      {type === "DESCRIPTIVE" && (
                        answer.descriptiveAnswer ||
                        "Not answered"
                      )}
                      {type === "CODING" && (
                        <>
                          <Typography
                            variant="caption"
                            fontWeight={800}
                            sx={{
                              display: "block",
                              mb: 1,
                            }}
                          >
                            {answer.codingAnswer?.language ||
                              "Language not selected"}
                          </Typography>
                          {answer.codingAnswer?.code ||
                            "Not answered"}
                        </>
                      )}
                    </Box>
                        {answer.aiFeedback && (
                          <Typography sx={{color: "red"}}>
                           Feedback: {answer.aiFeedback}
                          </Typography>
                        )}
                  </Box>
                </Stack>
              </Box>
            );
          })}
        </Stack>
      </Paper>
    </Box>
  );
};

export default CandidateAnswersPage;

const Info = ({ label, value, chip = false }: { label: string; value: string; chip?: boolean }) => {
  return (
    <Stack
      direction="row"
      spacing={1}
      alignItems="center"
    >
      <Typography variant="body2" fontWeight={700} >
        {label}:
      </Typography>
      {chip ? (
        <Chip label={value} size="small" sx={{ fontWeight: 700 }} />
      ) : (
        <Typography variant="body2">
          {value}
        </Typography>
      )}
    </Stack>
  );
};

const EvaluationResultChip = ({
  isCorrect,
  marksObtained,
  totalMarks,
  questionType,
}: {
  isCorrect?: boolean;
  marksObtained?: number;
  totalMarks?: number;
  questionType: string;
}) => {
  if (isCorrect === undefined && marksObtained === undefined) {
    return (
      <Chip
        label="Not Evaluated"
        size="small"
        sx={{fontWeight: 700}}
      />
    )
  }
  if (questionType === "CODING") {
    return (
      <Chip
        label={`${marksObtained ?? 0} / ${totalMarks ?? 0}`}
        size="small"
        color={(marksObtained ?? 0) ===  (totalMarks ?? 0)  ? "success"  : "warning" }
       sx={{ fontWeight: 700 }}
       />
    )
  }
    if (questionType === "DESCRIPTIVE") {
    return (
      <Chip
        label={`${marksObtained ?? 0} / ${totalMarks ?? 0}`}
        size="small"
        color={(marksObtained ?? 0) ===  (totalMarks ?? 0)  ? "success"  : "warning" }
       sx={{ fontWeight: 700 }}
       />
    )
  }
  return (
    <Chip
      label={ isCorrect ? "Correct" : "Incorrect" }
      size="small"
      color={ isCorrect ? "success" : "error"}
      sx={{fontWeight: 700}}
    />
  )
}