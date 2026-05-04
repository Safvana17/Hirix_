import React from "react";
import type { SelectedTest } from "../../../../types/test";
import { Box, Chip, Paper, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";

interface TestInfoTabProps {
  test: SelectedTest;
}

const TestInfoTab: React.FC<TestInfoTabProps> = ({ test }) => {
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

  return (
    <Box>
      <Box mb={3}>
        <Typography variant="h6" fontWeight={700}>
          Test Information
        </Typography>

        <Typography variant="body2" color="text.secondary" mt={0.5}>
          Basic details and schedule of this test.
        </Typography>
      </Box>

      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          borderRadius: 2,
          bgcolor: "#fff",
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12, md: 6 }}>
            <InfoField label="Test Name" value={test.name} />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <InfoField label="Company Name" value={test.companyName} />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <InfoField label="Job Role" value={test.jobrole} />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <InfoField label="Start Time" value={formatDateTime(test.startTime)} />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <InfoField label="End Time" value={formatDateTime(test.endTime)} />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <InfoField label="Description" value={test.description} multiline />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Typography variant="body2" color="text.secondary" mb={0.8}>
              Status
            </Typography>

            <Chip
              label={test.testStatus || "-"}
              size="small"
              sx={{
                fontWeight: 600,
                bgcolor: getStatusBg(test.testStatus),
                color: getStatusColor(test.testStatus),
              }}
            />
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default TestInfoTab;

interface InfoFieldProps {
  label: string;
  value?: string;
  multiline?: boolean;
}

const InfoField: React.FC<InfoFieldProps> = ({
  label,
  value,
  multiline = false,
}) => {
  return (
    <Box>
      <Typography variant="body2" color="text.secondary" mb={0.8}>
        {label}
      </Typography>

      <Box
        sx={{
          px: 1.5,
          py: 1.2,
          borderRadius: 1.5,
          bgcolor: "#F7F8FA",
          minHeight: multiline ? 86 : 44,
          display: "flex",
          alignItems: multiline ? "flex-start" : "center",
        }}
      >
        <Typography
          variant="body2"
          color="text.primary"
          sx={{
            fontWeight: 500,
            lineHeight: 1.6,
            wordBreak: "break-word",
          }}
        >
          {value || "-"}
        </Typography>
      </Box>
    </Box>
  );
};

const getStatusBg = (status?: string) => {
  switch (status) {
    case "DRAFT":
      return "#EEEEEE";
    case "PUBLISHED":
    case "ACTIVE":
      return "#E8F5E9";
    case "COMPLETED":
      return "#FFF4E5";
    case "CANCELLED":
      return "#FDECEA";
    default:
      return "#EEEEEE";
  }
};

const getStatusColor = (status?: string) => {
  switch (status) {
    case "DRAFT":
      return "#616161";
    case "PUBLISHED":
    case "ACTIVE":
      return "#2E7D32";
    case "COMPLETED":
      return "#B26A00";
    case "CANCELLED":
      return "#D32F2F";
    default:
      return "#616161";
  }
};