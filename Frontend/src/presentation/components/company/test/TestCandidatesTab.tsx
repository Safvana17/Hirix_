import React, { useMemo, useState } from "react";
import type { TestCandidate } from "../../../../types/test";
import { Box, Button, Chip, Divider, Paper, Stack, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs, Typography } from "@mui/material";

interface TestCandidatesTabProps {
  candidates: TestCandidate[];
  isEvaluating?: boolean;
  onEvaluateSubmitted?: () => void;
  onViewAnswers?: (candidateId: string) => void;
  onShortlist?: (candidateId: string) => void;
  onReject?: (candidateId: string) => void;
}

type CandidateTab = "attended" | "notAttended";

const TestCandidatesTab: React.FC<TestCandidatesTabProps> = ({
  candidates,
  isEvaluating = false,
  onEvaluateSubmitted,
  onViewAnswers,
  onShortlist,
  onReject,
}) => {
  const [activeTab, setActiveTab] = useState<CandidateTab>("attended");

  const attendedCandidates = useMemo(
    () => candidates.filter((c) => c.candidateTestStatus === "SUBMITTED"),
    [candidates]
  );

  const notAttendedCandidates = useMemo(
    () => candidates.filter((c) => c.candidateTestStatus !== "SUBMITTED"),
    [candidates]
  );

  const canEvaluate = useMemo(() => {
    return attendedCandidates.some(
      (candidate) =>
        !candidate.evaluationStatus ||
        candidate.evaluationStatus === "NOT_EVALUATED" ||
        candidate.evaluationStatus === "FAILED"
    );
  }, [attendedCandidates]);

  const visibleCandidates =
    activeTab === "attended" ? attendedCandidates : notAttendedCandidates;

  if (!candidates.length) {
    return (
      <EmptyState message="No candidates have been invited for this test." />
    );
  }

  return (
    <Box>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "center" }}
        spacing={2}
        mb={2.5}
      >
        <Box>
          <Typography variant="h6" fontWeight={700}>
            Candidates
          </Typography>

          <Typography variant="body2" color="text.secondary" mt={0.5}>
            Evaluate submitted candidates before shortlisting or rejecting.
          </Typography>
        </Box>

        <Button
          variant="contained"
          disabled={!canEvaluate || isEvaluating}
          onClick={onEvaluateSubmitted}
          sx={{
            backgroundColor: "#021A30",
            textTransform: "none",
            fontWeight: 700,
            borderRadius: 2,
            px: 2.5,
            alignSelf: { xs: "stretch", sm: "center" },
          }}
        >
          {isEvaluating ? "Evaluating..." : "Evaluate Submitted Candidates"}
        </Button>
      </Stack>

      <Paper
        elevation={0}
        sx={{
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
          overflow: "hidden",
          bgcolor: "#fff",
        }}
      >
        <Box
          sx={{
            px: { xs: 1, sm: 2 },
            pt: 1,
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Tabs
            value={activeTab}
            onChange={(_, value: CandidateTab) => setActiveTab(value)}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              minHeight: 44,
              "& .MuiTab-root": {
                textTransform: "none",
                fontWeight: 600,
                minHeight: 44,
                fontSize: { xs: 13, sm: 14 },
                px: { xs: 1.5, sm: 2 },
              },
            }}
          >
            <Tab
              value="attended"
              label={`Attended (${attendedCandidates.length})`}
            />
            <Tab
              value="notAttended"
              label={`Not Attended (${notAttendedCandidates.length})`}
            />
          </Tabs>
        </Box>

        {!visibleCandidates.length ? (
          <EmptyState
            message={
              activeTab === "attended"
                ? "No candidates have submitted the test yet."
                : "All invited candidates have submitted the test."
            }
          />
        ) : (
          <>
            <Stack
              spacing={1.5}
              sx={{
                display: { xs: "flex", md: "none" },
                p: 1.5,
              }}
            >
              {visibleCandidates.map((candidate) => (
                <CandidateMobileCard
                  key={candidate.id}
                  candidate={candidate}
                  onViewAnswers={onViewAnswers}
                  onShortlist={onShortlist}
                  onReject={onReject}
                />
              ))}
            </Stack>

            <TableContainer
              sx={{
                display: { xs: "none", md: "block" },
                width: "100%",
                overflowX: "auto",
              }}
            >
              <Table size="small" sx={{ minWidth: 1200 }}>
                <TableHead>
                  <TableRow
                    sx={{
                      bgcolor: "#F7F8FA",
                      "& th": {
                        fontWeight: 700,
                        color: "text.secondary",
                        borderBottom: "1px solid",
                        borderColor: "divider",
                        py: 1.4,
                        whiteSpace: "nowrap",
                      },
                    }}
                  >
                    <TableCell>Email</TableCell>
                    <TableCell>Test Status</TableCell>
                    <TableCell>Evaluation</TableCell>
                    <TableCell>Selection</TableCell>
                    <TableCell>Score</TableCell>
                    <TableCell>AI Rank</TableCell>
                    <TableCell>Started At</TableCell>
                    <TableCell>Submitted At</TableCell>
                    <TableCell>Warnings</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {visibleCandidates.map((candidate) => (
                    <TableRow
                      key={candidate.id}
                      hover
                      sx={{
                        "& td": {
                          py: 1.5,
                          borderBottom: "1px solid",
                          borderColor: "#F0F0F0",
                          whiteSpace: "nowrap",
                        },
                      }}
                    >
                      <TableCell>
                        <Typography variant="body2" fontWeight={500}>
                          {candidate.email}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <StatusChip status={candidate.candidateTestStatus} />
                      </TableCell>

                      <TableCell>
                        <EvaluationChip status={candidate.evaluationStatus} />
                      </TableCell>

                      <TableCell>
                        <SelectionChip status={candidate.selectionStatus} />
                      </TableCell>

                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          {formatScore(
                            candidate.marksObtained,
                            candidate.totalMarks
                          )}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          {candidate.aiRank ?? "-"}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {formatDateTime(candidate.startedAt)}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {formatDateTime(candidate.submittedAt)}
                        </Typography>
                      </TableCell>

                      <TableCell>{candidate.warningCount ?? 0}</TableCell>

                      <TableCell align="right">
                        <CandidateActions
                          candidate={candidate}
                          onViewAnswers={onViewAnswers}
                          onShortlist={onShortlist}
                          onReject={onReject}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </Paper>
    </Box>
  );
};

export default TestCandidatesTab;

const CandidateMobileCard = ({
  candidate,
  onViewAnswers,
  onShortlist,
  onReject,
}: {
  candidate: TestCandidate;
  onViewAnswers?: (candidateId: string) => void;
  onShortlist?: (candidateId: string) => void;
  onReject?: (candidateId: string) => void;
}) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 1.5,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
      }}
    >
      <Stack spacing={1.2}>
        <Box>
          <Typography
            variant="body2"
            fontWeight={700}
            sx={{ wordBreak: "break-word" }}
          >
            {candidate.email}
          </Typography>
        </Box>

        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <StatusChip status={candidate.candidateTestStatus} />
          <EvaluationChip status={candidate.evaluationStatus} />
          <SelectionChip status={candidate.selectionStatus} />
        </Stack>

        <Divider />

        <InfoRow
          label="Score"
          value={formatScore(candidate.marksObtained, candidate.totalMarks)}
        />
        <InfoRow label="AI Rank" value={String(candidate.aiRank ?? "-")} />
        <InfoRow label="Started At" value={formatDateTime(candidate.startedAt)} />
        <InfoRow
          label="Submitted At"
          value={formatDateTime(candidate.submittedAt)}
        />
        <InfoRow label="Warnings" value={String(candidate.warningCount ?? 0)} />

        <Box pt={0.5}>
          <CandidateActions
            candidate={candidate}
            onViewAnswers={onViewAnswers}
            onShortlist={onShortlist}
            onReject={onReject}
          />
        </Box>
      </Stack>
    </Paper>
  );
};

const CandidateActions = ({
  candidate,
  onViewAnswers,
  onShortlist,
  onReject,
}: {
  candidate: TestCandidate;
  onViewAnswers?: (candidateId: string) => void;
  onShortlist?: (candidateId: string) => void;
  onReject?: (candidateId: string) => void;
}) => {
  const isSubmitted = candidate.candidateTestStatus === "SUBMITTED";
  const selectionStatus = candidate.selectionStatus || "PENDING";
  const isEvaluated = candidate.evaluationStatus === "EVALUATED";
  const isEvaluating = candidate.evaluationStatus === "EVALUATING";

  if (!isSubmitted) {
    return (
      <Typography variant="body2" color="text.secondary">
        No actions
      </Typography>
    );
  }

  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={1}
      justifyContent="flex-end"
      sx={{ width: { xs: "100%", sm: "auto" } }}
    >
      <Button
        size="small"
        variant="outlined"
        fullWidth
        onClick={() => onViewAnswers?.(candidate.id)}
        sx={{
          textTransform: "none",
          fontWeight: 600,
          width: { xs: "100%", sm: "auto" },
        }}
      >
        View Answers
      </Button>

      {selectionStatus === "PENDING" && isEvaluated && (
        <>
          <Button
            size="small"
            variant="contained"
            color="success"
            fullWidth
            onClick={() => onShortlist?.(candidate.id)}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              width: { xs: "100%", sm: "auto" },
            }}
          >
            Shortlist
          </Button>

          <Button
            size="small"
            variant="outlined"
            color="error"
            fullWidth
            onClick={() => onReject?.(candidate.id)}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              width: { xs: "100%", sm: "auto" },
            }}
          >
            Reject
          </Button>
        </>
      )}

      {selectionStatus === "PENDING" && !isEvaluated && (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: { xs: "center", sm: "flex-end" },
            minWidth: 90,
          }}
        >
          {isEvaluating ? "Evaluating..." : "Evaluate first"}
        </Typography>
      )}
    </Stack>
  );
};

const InfoRow = ({ label, value }: { label: string; value: string }) => {
  return (
    <Stack direction="row" justifyContent="space-between" spacing={2}>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="caption" fontWeight={600} textAlign="right">
        {value}
      </Typography>
    </Stack>
  );
};

const EmptyState = ({ message }: { message: string }) => {
  return (
    <Box
      sx={{
        p: { xs: 3, sm: 4 },
        textAlign: "center",
        bgcolor: "#fff",
      }}
    >
      <Typography variant="body2" color="text.secondary">
        {message}
      </Typography>
    </Box>
  );
};

const StatusChip = ({ status }: { status?: string }) => {
  const config: Record<string, { bg: string; color: string; label: string }> = {
    DRAFT: {
      bg: "#F5F5F5",
      color: "#616161",
      label: "Draft",
    },
    INVITED: {
      bg: "#EEF2FF",
      color: "#3949AB",
      label: "Invited",
    },
    IN_PROGRESS: {
      bg: "#FFF4E5",
      color: "#B26A00",
      label: "In Progress",
    },
    STARTED: {
      bg: "#FFF4E5",
      color: "#B26A00",
      label: "Started",
    },
    SUBMITTED: {
      bg: "#E8F5E9",
      color: "#2E7D32",
      label: "Submitted",
    },
    EXPIRED: {
      bg: "#F5F5F5",
      color: "#616161",
      label: "Expired",
    },
    DISQUALIFIED: {
      bg: "#FDECEA",
      color: "#D32F2F",
      label: "Disqualified",
    },
  };

  const selectedConfig =
    config[status || ""] || {
      bg: "#F5F5F5",
      color: "#616161",
      label: status || "-",
    };

  return (
    <Chip
      label={selectedConfig.label}
      size="small"
      sx={{
        bgcolor: selectedConfig.bg,
        color: selectedConfig.color,
        fontWeight: 600,
      }}
    />
  );
};

const EvaluationChip = ({ status }: { status?: string }) => {
  const config: Record<string, { bg: string; color: string; label: string }> = {
    NOT_EVALUATED: {
      bg: "#F5F5F5",
      color: "#616161",
      label: "Not Evaluated",
    },
    EVALUATING: {
      bg: "#FFF4E5",
      color: "#B26A00",
      label: "Evaluating",
    },
    EVALUATED: {
      bg: "#E8F5E9",
      color: "#2E7D32",
      label: "Evaluated",
    },
    FAILED: {
      bg: "#FDECEA",
      color: "#D32F2F",
      label: "Failed",
    },
  };

  const selectedConfig = config[status || "NOT_EVALUATED"];

  return (
    <Chip
      label={selectedConfig.label}
      size="small"
      sx={{
        bgcolor: selectedConfig.bg,
        color: selectedConfig.color,
        fontWeight: 600,
      }}
    />
  );
};

const SelectionChip = ({ status }: { status?: string }) => {
  const config: Record<string, { bg: string; color: string; label: string }> = {
    PENDING: {
      bg: "#F5F5F5",
      color: "#616161",
      label: "Pending",
    },
    SHORTLISTED: {
      bg: "#E8F5E9",
      color: "#2E7D32",
      label: "Shortlisted",
    },
    REJECTED: {
      bg: "#FDECEA",
      color: "#D32F2F",
      label: "Rejected",
    },
  };

  const selectedConfig = config[status || "PENDING"] || config.PENDING;

  return (
    <Chip
      label={selectedConfig.label}
      size="small"
      sx={{
        bgcolor: selectedConfig.bg,
        color: selectedConfig.color,
        fontWeight: 600,
      }}
    />
  );
};

const formatScore = (marksObtained?: number, totalMarks?: number) => {
  if (marksObtained === undefined || marksObtained === null) return "-";

  if (totalMarks === undefined || totalMarks === null) {
    return String(marksObtained);
  }

  return `${marksObtained} / ${totalMarks}`;
};

const formatDateTime = (date?: string | Date) => {
  if (!date) return "-";

  const parsedDate = new Date(date);

  if (isNaN(parsedDate.getTime())) return "-";

  return parsedDate.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};