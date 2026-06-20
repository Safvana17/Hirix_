import React, { useMemo, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from "@mui/material";
import { Grid } from "@mui/material";
import { Close } from "@mui/icons-material";
import toast from "react-hot-toast";
import type {
  ModalMode,
  ScheduleInterviewPayload,
  InterviewDTO,
} from "../../../types/interview";

interface InterviewModalProps {
  loading: boolean;
  isOpen: boolean;
  mode: ModalMode;
  initialData?: Partial<InterviewDTO> | null;
  defaultData?: Partial<ScheduleInterviewPayload>;
  onClose: () => void;
  onSave: (data: ScheduleInterviewPayload) => Promise<void> | void;
}

const createEmptyFormData = (): ScheduleInterviewPayload => ({
  name: "",
  description: "",
  testCandidateId: "",
  candidateName: "",
  candidateEmail: "",
  interviewerName: "",
  interviewerEmail: "",
  testId: "",
  jobRoleId: "",
  round: 1,
  startTime: "",
  endTime: "",
});

const buildFormData = (
  initialData?: Partial<InterviewDTO> | null,
  defaultData?: Partial<ScheduleInterviewPayload>
): ScheduleInterviewPayload => {
  if (initialData) {
    return {
      id: initialData._id,
      name: initialData.name || "",
      description: initialData.description || "",
      testCandidateId: initialData.testCandidateId || "",
      candidateName: initialData.candidateName || "",
      candidateEmail: initialData.candidateEmail || "",
      interviewerName: initialData.interviewerName || "",
      interviewerEmail: initialData.interviewerEmail || "",
      testId: initialData.testId || "",
      jobRoleId: initialData.jobRoleId || "",
      round: initialData.round || 1,
      startTime: initialData.scheduledStartTime || '',
      endTime: initialData.scheduledEndTime || '',
    };
  }

  return {
    ...createEmptyFormData(),
    ...defaultData,
  };
};

const formatDateTimeLocal = (value: string) => {
  if (!value) return "";

  const date = new Date(value);

  const offset = date.getTimezoneOffset();

  return new Date(date.getTime() - offset * 60000)
    .toISOString()
    .slice(0,16);
};

const InterviewModal: React.FC<InterviewModalProps> = (props) => {
  const formKey = useMemo(() => {
    return [
      props.mode,
      props.initialData?._id || "new",
      props.defaultData?.testCandidateId || "",
      props.defaultData?.candidateEmail || "",
      props.isOpen ? "open" : "closed",
    ].join("-");
  }, [
    props.mode,
    props.initialData?._id,
    props.defaultData?.testCandidateId,
    props.defaultData?.candidateEmail,
    props.isOpen,
  ]);

  return (
    <InterviewModalForm
      key={formKey}
      {...props}
      initialFormData={buildFormData(props.initialData, props.defaultData)}
    />
  );
};

interface InterviewModalFormProps extends InterviewModalProps {
  initialFormData: ScheduleInterviewPayload;
}

const InterviewModalForm: React.FC<InterviewModalFormProps> = ({
  loading,
  isOpen,
  mode,
  onClose,
  onSave,
  initialFormData,
}) => {
  const [formData, setFormData] = useState<ScheduleInterviewPayload>(initialFormData);
  const [localError, setLocalError] = useState<Record<string, string>>({});
  const isViewMode = mode === "view";

  const handleChange = <K extends keyof ScheduleInterviewPayload>(
    field: K,
    value: ScheduleInterviewPayload[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) errors.name = "Interview name is required";
    if (!formData.candidateName.trim())
      errors.candidateName = "Candidate name is required";
    if (!formData.candidateEmail.trim())
      errors.candidateEmail = "Candidate email is required";
    if (!formData.interviewerName.trim())
      errors.interviewerName = "Interviewer name is required";
    if (!formData.interviewerEmail.trim())
      errors.interviewerEmail = "Interviewer email is required";
    if (!formData.testId.trim()) errors.testId = "Test id is required";
    if (!formData.jobRoleId.trim()) errors.jobRoleId = "Job role id is required";

    if (!formData.round || formData.round < 1) {
      errors.round = "Round must be at least 1";
    }

    if (new Date(formData.endTime) <= new Date(formData.startTime)) {
      errors.endTime = "End time must be after start time";
    }

    setLocalError(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    try {
      if (!validate()) return;
      const payload = {
        ...formData,
        startTime: new Date(formData.startTime).toISOString(),
        endTime: new Date(formData.endTime).toISOString(),
      };
      await onSave(payload);
      onClose();
    } catch (error) {
      toast.error(
        typeof error === "string" ? error : "Failed to schedule interview"
      );
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ background: "#6B4705", color: "#fff" }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <span>
            {mode === "create" && "Schedule Interview"}
            {mode === "edit" && "Update Interview"}
            {mode === "view" && "View Interview"}
          </span>

          <IconButton onClick={onClose} sx={{ color: "#fff" }}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={3}>
          <Grid size={12}>
            <TextField
              label="Interview Name"
              fullWidth
              value={formData.name}
              InputProps={{ readOnly: isViewMode }}
              onChange={(e) => handleChange("name", e.target.value)}
              error={Boolean(localError.name)}
              helperText={localError.name}
            />
          </Grid>

          <Grid size={12}>
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={formData.description}
              InputProps={{ readOnly: isViewMode }}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </Grid>

          <Grid size={6}>
            <TextField
              label="Candidate Name"
              fullWidth
              value={formData.candidateName}
              InputProps={{ readOnly: isViewMode }}
              onChange={(e) => handleChange("candidateName", e.target.value)}
              error={Boolean(localError.candidateName)}
              helperText={localError.candidateName}
            />
          </Grid>

          <Grid size={6}>
            <TextField
              label="Candidate Email"
              fullWidth
              value={formData.candidateEmail}
              InputProps={{ readOnly: isViewMode }}
              onChange={(e) => handleChange("candidateEmail", e.target.value)}
              error={Boolean(localError.candidateEmail)}
              helperText={localError.candidateEmail}
            />
          </Grid>

          <Grid size={6}>
            <TextField
              label="Interviewer Name"
              fullWidth
              value={formData.interviewerName}
              InputProps={{ readOnly: isViewMode }}
              onChange={(e) => handleChange("interviewerName", e.target.value)}
              error={Boolean(localError.interviewerName)}
              helperText={localError.interviewerName}
            />
          </Grid>

          <Grid size={6}>
            <TextField
              label="Interviewer Email"
              fullWidth
              value={formData.interviewerEmail}
              InputProps={{ readOnly: isViewMode }}
              onChange={(e) => handleChange("interviewerEmail", e.target.value)}
              error={Boolean(localError.interviewerEmail)}
              helperText={localError.interviewerEmail}
            />
          </Grid>

          <Grid size={4}>
            <TextField
              label="Round"
              type="number"
              fullWidth
              value={formData.round}
              InputProps={{ readOnly: isViewMode }}
              onChange={(e) => handleChange("round", Number(e.target.value))}
              error={Boolean(localError.round)}
              helperText={localError.round}
            />
          </Grid>

          <Grid size={4}>
            <TextField
              label="Start Time"
              type="datetime-local"
              fullWidth
              value={formatDateTimeLocal(formData.startTime)}
              InputLabelProps={{ shrink: true }}
              InputProps={{ readOnly: isViewMode }}
              onChange={(e) =>
                handleChange("startTime", e.target.value)
              }
            />
          </Grid>

          <Grid size={4}>
            <TextField
              label="End Time"
              type="datetime-local"
              fullWidth
              value={formatDateTimeLocal(formData.endTime)}
              InputLabelProps={{ shrink: true }}
              InputProps={{ readOnly: isViewMode }}
              onChange={(e) =>
                handleChange("endTime", e.target.value)
              }
              error={Boolean(localError.endTime)}
              helperText={localError.endTime}
            />
          </Grid>
        </Grid>
      </DialogContent>

      {!isViewMode && (
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            variant="contained"
            sx={{ bgcolor: "#0B3358" }}
            onClick={handleSubmit}
          >
            {mode === "create" ? loading? "Scheduling..." : "Schedule Interview" : loading ? "Updating..." : "Update Interview"}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default InterviewModal;