import React, { useMemo, useState } from "react"
import { Box, Button, CircularProgress, FormControl, MenuItem, Select, Stack, TextField, Typography } from "@mui/material"
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded"
import QuestionText from "./QuestionText"
import type { CommonQuestionProps } from "./McqQuestionCard"
import type { TestCase } from "../../../../types/question"
import Editor from '@monaco-editor/react'
import { useParams } from "react-router-dom"
import { CODING_LANGUAGES, type CodingLanguages } from "../../../../constants/codingLanguages"
import toast from "react-hot-toast"
import { useDispatch } from "react-redux"
import type { AppDispatch } from "../../../../redux/store"
import { testRunCode } from "../../../../redux/slices/features/test/CandidateTestSlice"


const CodingQuestion: React.FC<CommonQuestionProps> = ({ question, value, onChange }) => {
  const testCases = question.testCase ?? []
  const { token } = useParams()
  const dispatch= useDispatch<AppDispatch>()
  const [language, setLanguage] = useState<CodingLanguages>('javascript')
  const [output, setOutput] = useState('Output will appear here...')
  const [running, setRunning] = useState(false)

  const selectedLanguage = useMemo(() => {
    return CODING_LANGUAGES.find((item) => item.value === language)!
  }, [language])

  const editorValue = value || selectedLanguage.defaultCode

  const handleLanguageChange = (newLanguage: CodingLanguages) => {
    setLanguage(newLanguage)
    const selected = CODING_LANGUAGES.find((item) => item.value === newLanguage)
    onChange(selected?.defaultCode || '')
    setOutput('Output will appear here...')
  }

  const handleRunCode = async () => {
    if(!token) return
    try {
      setRunning(true)
      const result = await dispatch(testRunCode({ data: { language, sourceCode: editorValue, }, token })).unwrap()
      setOutput( result.stdout || result.stderr || result.error || 'Program executed with no output')
    } catch (error) {
      setOutput('Failed to run code')
      toast.error(typeof error === 'string' ? error : 'Failed to run code')
    }finally{
      setRunning(false)
    }
  }

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
      <Stack
         direction={{xs: 'column', sm: 'row'}}
         justifyContent="space-between"
         alignItems={{xs: 'stretch', sm: 'center'}}
         spacing={2}
         sx={{ mt: 3, mb: 1.5}}
      >
        <Typography sx={{ fontWeight: 700 }}>
          Code Editor
        </Typography>
        <FormControl size="small" sx={{ minWidth: 180 }}>
           <Select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
           >
             {CODING_LANGUAGES.map((item) => (
              <MenuItem key={item.value} value={item.value}>
                {item.label}
              </MenuItem>
             ))}
           </Select>
        </FormControl>
      </Stack>

      <Box
        sx={{
          border: '1px solid #1F2937',
          borderRadius: 3,
          overflow: 'hidden'
        }}
      >
        <Editor 
           height="420px"
           language={language} 
           theme="vs-dark"
           value={editorValue}
           onChange={(newValue) =>{ onChange(newValue || '')}}
           options={{
            minimap: { enabled: false},
            fontSize: 14,
            wordWrap: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 4
           }}       
        />
      </Box>
      {/* <TextField
        fullWidth
        multiline
        minRows={5}
        value={customInput}
        placeholder="Custom input..."
        onChange={(e) => setCustomInput(e.target.value)}
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
      /> */}
      <Stack direction="row" justifyContent="flex-end" sx={{ mt: 2 }}>
        <Button
          type="button"
          variant="contained"
          startIcon={running ? (
                <CircularProgress size={18} color="inherit" />
              ): (
                 <PlayArrowRoundedIcon />
               )}
          disabled={running}
          onClick={handleRunCode}
          sx={{
            borderRadius: 999,
            bgcolor: "#025614",
            textTransform: "none",
            "&:hover": {
              bgcolor: "#087A27",
            },
          }}
        >
          {running ? 'Running...' : 'Run Code'}
        </Button>
      </Stack>
      <TextField
        fullWidth
        multiline
        minRows={8}
        value={output}
        InputProps={{
          readOnly: true,
        }}
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
            WebkitTextFillColor: "#E5E7EB",
          },
        }}
      />
    </Box>
  )
}

export default CodingQuestion