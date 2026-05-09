import React from "react"
import { Box, Button, Stack, TextField, Typography } from "@mui/material"
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded"
import QuestionText from "./QuestionText"
import type { CommonQuestionProps } from "./McqQuestionCard"
import type { TestCase } from "../../../../types/question"



const CodingQuestion: React.FC<CommonQuestionProps> = ({ question, value, onChange }) => {
  const testCases = question.testCase ?? []

  return (
    <Box>
      <QuestionText question={question} />
      {testCases.length > 0 && (
        <Box
          sx={{
            mt: 3,
            border: "1px solid #E5E7EB",
            borderRadius: 3,
            bgcolor: "#F8FAFC",
            p: 2,
          }}
        >
          <Typography sx={{ mb: 1, fontWeight: 700 }}>
            Sample Test Cases
          </Typography>

          <Stack spacing={1}>
            {testCases.slice(0, 2).map((testCase: TestCase, index) => (
              <Box key={index}>
                <Typography sx={{ fontSize: 13 }}>
                  <strong>Input:</strong> {testCase.input || "-"}
                </Typography>

                <Typography sx={{ fontSize: 13 }}>
                  <strong>Expected Output:</strong>{" "}
                  {testCase.expectedOutput || "-"}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Box>
      )}

      <TextField
        fullWidth
        multiline
        minRows={14}
        value={value}
        placeholder="Write your code here..."
        onChange={(e) => onChange(e.target.value)}
        sx={{
          mt: 3,
          "& .MuiOutlinedInput-root": {
            borderRadius: 3,
            bgcolor: "#0B1120",
            color: "#E5E7EB",
            fontFamily: 'Consolas, Monaco, "Courier New", monospace',
            fontSize: 14,
          },
          "& textarea": {
            color: "#E5E7EB",
          },
        }}
      />

      <Stack direction="row" justifyContent="flex-end" sx={{ mt: 2 }}>
        <Button
          variant="contained"
          startIcon={<PlayArrowRoundedIcon />}
          onClick={() => console.log("run code:", value)}
          sx={{
            borderRadius: 999,
            bgcolor: "#025614",
            textTransform: "none",
            "&:hover": {
              bgcolor: "#087A27",
            },
          }}
        >
          Run Code
        </Button>
      </Stack>

      <TextField
        fullWidth
        multiline
        minRows={14}
        value={value ?? 'Output'}
        placeholder="Output..."
        disabled
        sx={{
          mt: 3,
          "& .MuiOutlinedInput-root": {
            borderRadius: 3,
            bgcolor: "#0B1120",
            color: "#E5E7EB",
            fontFamily: 'Consolas, Monaco, "Courier New", monospace',
            fontSize: 14,
          },
          "& textarea": {
            color: "#E5E7EB",
          },
        }}
      />
    </Box>
  )
}

export default CodingQuestion