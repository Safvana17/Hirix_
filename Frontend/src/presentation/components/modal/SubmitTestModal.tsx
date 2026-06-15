import React from "react";
import {
  Dialog,
  DialogContent,
  Typography,
  Box,
  Stack,
  Button,
  Divider,
  Chip,
} from "@mui/material";

export type TestFinishType = | "MANUAL" | "AUTO_SUBMIT" | "TERMINATED";

interface SubmitSummary {
  totalQuestions: number;
  answered: number;
  unanswered: number;
  markedForReview?: number;
}

interface SubmitTestModalProps {
  open: boolean;
  type: TestFinishType;
  summary: SubmitSummary;
  terminationReason?: string;
  loading?: boolean;
  onClose?: () => void;
  onReview?: () => void;
  onSubmit?: () => void;
}

const SubmitTestModal: React.FC<SubmitTestModalProps> = ({
  open,
  type,
  summary,
  terminationReason,
  loading = false,
  onClose,
  onReview,
  onSubmit,
}) => {
  const isManual = type === "MANUAL";
  const isAutoSubmit = type === "AUTO_SUBMIT";
  const isTerminated = type === "TERMINATED";

  const title = isManual
    ? "Submit Test?"
    : isAutoSubmit
    ? "Time is Up"
    : "Test Terminated";

  const subtitle = isManual
    ? "Are you sure you want to submit your test?"
    : isAutoSubmit
    ? "Your test is being submitted automatically."
    : "Your test has been terminated automatically.";

  return (
    <Dialog
      open={open}
      onClose={isManual ? onClose : undefined}
      disableEscapeKeyDown={!isManual}
      maxWidth="sm"
      fullWidth
    >
      <DialogContent sx={{ p: 4 }}>
        <Typography
          variant="h6"
          fontWeight={700}
          gutterBottom
        >
          {title}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 3 }}
        >
          {subtitle}
        </Typography>

        {isTerminated && terminationReason && (
          <Chip
            label={`Reason: ${terminationReason}`}
            color="error"
            sx={{ mb: 2 }}
          />
        )}

        <Divider sx={{ mb: 3 }} />

        <Stack spacing={2}>
          <SummaryRow
            label="Total Questions"
            value={summary.totalQuestions}
          />

          <SummaryRow
            label="Answered"
            value={summary.answered}
          />

          <SummaryRow
            label="Not Answered"
            value={summary.unanswered}
          />

          {summary.markedForReview !== undefined && (
            <SummaryRow
              label="Marked For Review"
              value={summary.markedForReview}
            />
          )}
        </Stack>

        {summary.unanswered > 0 && (
          <Box
            sx={{
              mt: 3,
              p: 2,
              borderRadius: 2,
              bgcolor: "#FFF7E6",
              border: "1px solid #FFD591",
            }}
          >
            <Typography
              variant="body2"
              color="#8C6D1F"
            >
              You have {summary.unanswered} unanswered
              question(s). Are you sure you want to
              continue?
            </Typography>
          </Box>
        )}

        <Stack
          direction="row"
          justifyContent="flex-end"
          spacing={2}
          sx={{ mt: 4 }}
        >
          {isManual && (
            <>
              <Button
                variant="outlined"
                onClick={onReview}
              >
                Review Again
              </Button>

              <Button
                variant="contained"
                color="success"
                onClick={onSubmit}
                disabled={loading}
              >
                Submit
              </Button>
            </>
          )}

          {(isAutoSubmit || isTerminated) && (
            <Button
              variant="contained"
              disabled
            >
              Processing...
            </Button>
          )}
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default SubmitTestModal;

interface SummaryRowProps {
  label: string;
  value: number;
}

const SummaryRow: React.FC<SummaryRowProps> = ({
  label,
  value,
}) => (
  <Box
    display="flex"
    justifyContent="space-between"
  >
    <Typography>{label}</Typography>
    <Typography fontWeight={600}>
      {value}
    </Typography>
  </Box>
);