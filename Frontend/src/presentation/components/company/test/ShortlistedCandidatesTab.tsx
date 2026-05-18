import React from 'react'
import type { TestCandidate } from '../../../../types/test'
import { Box, Button, Divider, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'

interface ShortlistedCandidatesTabProps{
    candidates: TestCandidate[]
    onScheduleInterview?: (candidateId: string) => void
}
const ShortlistedCandidatesTab: React.FC <ShortlistedCandidatesTabProps>= ({candidates, onScheduleInterview}) => {
  return (
    <Box>
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
        {!candidates.length ? (
            <Box
            sx={{
                p: { xs: 3, sm: 4 },
                textAlign: "center",
                bgcolor: "#fff",
            }}
            >
            <Typography variant="body2" color="text.secondary">
                No candidates shortlisted yet.
            </Typography>
            </Box>
        ) : (
          <>
            <Stack
              spacing={1.5}
              sx={{
                display: { xs: "flex", md: "none" },
                p: 1.5,
              }}
            >
              {candidates.map((candidate) => (
                <CandidateMobileCard
                  key={candidate.id}
                  candidate={candidate}
                  onScheduleInterview={onScheduleInterview}
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
              <Table size="small" sx={{ minWidth: 900 }}>
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
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Selection Status</TableCell>
                    <TableCell>AI Rank</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {candidates.map((candidate) => (
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
                          {candidate.name}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Typography variant="body2" fontWeight={500}>
                          {candidate.email}
                        </Typography>
                      </TableCell>

<TableCell>
  <Box
    sx={{
      display: "inline-flex",
      alignItems: "center",
      px: 1.5,
      py: 0.5,
      borderRadius: 10,
      bgcolor: "#E8F5E9",
      color: "#2E7D32",
      fontSize: 12,
      fontWeight: 700,
    }}
  >
    {candidate.selectionStatus}
  </Box>
</TableCell>

                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          {candidate.aiRank ?? "-"}
                        </Typography>
                      </TableCell>

                      <TableCell align="right">
                        <Button
                            size="small"
                            variant="contained"
                            onClick={() => onScheduleInterview?.(candidate.id)}
                            sx={{
                            textTransform: "none",
                            fontWeight: 600,
                            bgcolor: "#6B4705",
                            "&:hover": {
                                bgcolor: "#5A3B04"
                            }
                            }}
                        >
                            Schedule Interview
                        </Button>
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
  )
}

export default ShortlistedCandidatesTab

const CandidateMobileCard = ({candidate, onScheduleInterview}: {
  candidate: TestCandidate;
  onScheduleInterview?: (candidateId: string) => void
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
            {candidate.name}
          </Typography>
        </Box>
        <Box>
          <Typography
            variant="body2"
            fontWeight={700}
            sx={{ wordBreak: "break-word" }}
          >
            {candidate.email}
          </Typography>
        </Box>

        <InfoRow label="AI Rank" value={String(candidate.aiRank ?? "-")} />

        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <Box
            sx={{
                display: "inline-flex",
                alignItems: "center",
                px: 1.5,
                py: 0.5,
                borderRadius: 10,
                bgcolor: "#E8F5E9",
                color: "#2E7D32",
                fontSize: 12,
                fontWeight: 700,
            }}
            >
            {candidate.selectionStatus}
            </Box>
        </Stack>

                <Divider />
        <Box pt={0.5}>
                        <Button
                            size="small"
                            variant="contained"
                            onClick={() => onScheduleInterview?.(candidate.id)}
                            sx={{
                            textTransform: "none",
                            fontWeight: 600,
                            bgcolor: "#6B4705",
                            "&:hover": {
                                bgcolor: "#5A3B04"
                            }
                            }}
                        >
                            Schedule Interview
                        </Button>
        </Box>
      </Stack>
    </Paper>
  )
}

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
  )
}