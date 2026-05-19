import React from "react"
import {
  Box,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from "@mui/material"
import type { PracticeQuestion } from "../../../../types/question"


export interface CommonQuestionProps {
  question: PracticeQuestion
  value: string
  onChange: (value: string) => void
}

const PracticeMcqQuestion: React.FC<CommonQuestionProps> = ({ question, value, onChange }) => {
  const options = question.options ?? []

  return (
    <Box>
      <FormControl fullWidth sx={{ mt: 3 }}>
        <RadioGroup value={value} onChange={(e) => onChange(e.target.value)}>
          <Stack spacing={1.5}>
            {options.map((option) => (
              <Box
                key={option}
                sx={{
                  border: "1px solid #E5E7EB",
                  borderRadius: 3,
                  bgcolor: value === option ? "#EAF4FF" : "#FFFFFF",
                  px: 2,
                  py: 1,
                  transition: "0.2s",
                  "&:hover": {
                    bgcolor: "#F8FAFC",
                  },
                }}
              >
                <FormControlLabel
                  value={option}
                  control={<Radio />}
                  label={
                    <Typography sx={{ fontWeight: 500 }}>{option}</Typography>
                  }
                  sx={{ m: 0, width: "100%" }}
                />
              </Box>
            ))}
          </Stack>
        </RadioGroup>
      </FormControl>
    </Box>
  )
}

export default PracticeMcqQuestion