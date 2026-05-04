import React, { useMemo, useState } from "react";
import type { TestCandidate } from "../../../../types/test";
import {
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

interface TestCandidatesTabProps {
  candidates: TestCandidate[];
  onViewAnswers?: (candidateId: string) => void;
  onShortlist?: (candidateId: string) => void;
  onReject?: (candidateId: string) => void;
}

type CandidateTab = "attended" | "notAttended";

const TestCandidatesTab: React.FC<TestCandidatesTabProps> = ({
  candidates,
  onViewAnswers,
  onShortlist,
  onReject,
}) => {
  const [activeTab, setActiveTab] = useState<CandidateTab>("attended");

  const attendedCandidates = useMemo(() => {
    return candidates.filter(
      (candidate) => candidate.candidateStatus === "SUBMITTED"
    );
  }, [candidates]);

  const notAttendedCandidates = useMemo(() => {
    return candidates.filter(
      (candidate) => candidate.candidateStatus !== "SUBMITTED"
    );
  }, [candidates]);

  const visibleCandidates =
    activeTab === "attended" ? attendedCandidates : notAttendedCandidates;

  if (!candidates.length) {
    return (
      <EmptyState message="No candidates have been invited for this test." />
    );
  }

  return (
    <Box>
      <Box mb={2.5}>
        <Typography variant="h6" fontWeight={700}>
          Candidates
        </Typography>

        <Typography variant="body2" color="text.secondary" mt={0.5}>
          Review candidate submissions and shortlist suitable candidates.
        </Typography>
      </Box>

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
            px: 2,
            pt: 1,
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Tabs
            value={activeTab}
            onChange={(_, value: CandidateTab) => setActiveTab(value)}
            sx={{
              minHeight: 44,
              "& .MuiTab-root": {
                textTransform: "none",
                fontWeight: 600,
                minHeight: 44,
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
          <Table size="small">
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
                  },
                }}
              >
                <TableCell>Email</TableCell>
                <TableCell>Test Status</TableCell>
                <TableCell>Selection</TableCell>
                <TableCell>Started At</TableCell>
                <TableCell>Submitted At</TableCell>
                <TableCell>Warnings</TableCell>
                <TableCell>AI Rank</TableCell>
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
                    },
                  }}
                >
                  <TableCell>
                    <Typography variant="body2" fontWeight={500}>
                      {candidate.email}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <StatusChip status={candidate.candidateStatus} />
                  </TableCell>

                  <TableCell>
                    <SelectionChip status={candidate.selectionStatus} />
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

                  <TableCell>{candidate.aiRank ?? "-"}</TableCell>

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
        )}
      </Paper>
    </Box>
  );
};

export default TestCandidatesTab;

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
  const isSubmitted = candidate.candidateStatus === "SUBMITTED";
  const selectionStatus = candidate.selectionStatus || "PENDING";

  if (!isSubmitted) {
    return (
      <Typography variant="body2" color="text.secondary">
        No actions
      </Typography>
    );
  }

  return (
    <Stack direction="row" spacing={1} justifyContent="flex-end">
      <Button
        size="small"
        variant="outlined"
        onClick={() => onViewAnswers?.(candidate.id)}
        sx={{ textTransform: "none", fontWeight: 600 }}
      >
        View Answers
      </Button>

      {selectionStatus === "PENDING" && (
        <>
          <Button
            size="small"
            variant="contained"
            color="success"
            onClick={() => onShortlist?.(candidate.id)}
            sx={{ textTransform: "none", fontWeight: 600 }}
          >
            Shortlist
          </Button>

          <Button
            size="small"
            variant="outlined"
            color="error"
            onClick={() => onReject?.(candidate.id)}
            sx={{ textTransform: "none", fontWeight: 600 }}
          >
            Reject
          </Button>
        </>
      )}

      {selectionStatus === "SHORTLISTED" && (
        <Chip
          label="Shortlisted"
          size="small"
          sx={{
            bgcolor: "#E8F5E9",
            color: "#2E7D32",
            fontWeight: 600,
          }}
        />
      )}

      {selectionStatus === "REJECTED" && (
        <Chip
          label="Rejected"
          size="small"
          sx={{
            bgcolor: "#FDECEA",
            color: "#D32F2F",
            fontWeight: 600,
          }}
        />
      )}
    </Stack>
  );
};

const EmptyState = ({ message }: { message: string }) => {
  return (
    <Box
      sx={{
        p: 4,
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
    INVITED: {
      bg: "#EEF2FF",
      color: "#3949AB",
      label: "Invited",
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