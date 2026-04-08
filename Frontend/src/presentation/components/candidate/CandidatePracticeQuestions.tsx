import React from 'react';
import { Box, Tab, Tabs, TextField, MenuItem, Typography } from '@mui/material';
import type { QuestionType, QuestionDifficulty, Question } from '../../../types/question';
import CandidateQuestionCard from '../../pages/candidate/CandidateQuestionCard';

const questionType: QuestionType[] = ['mcq', 'coding', 'descriptive'];
const questionDifficulty: QuestionDifficulty[] = ['easy', 'medium', 'hard'];

interface CandidatePracticeQuestionsProps {
  questions: Question[];
  type: QuestionType | '';
  setType: React.Dispatch<React.SetStateAction<QuestionType | ''>>;
  difficulty: QuestionDifficulty | '';
  setDifficulty: React.Dispatch<React.SetStateAction<QuestionDifficulty | ''>>;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}

const CandidatePracticeQuestions: React.FC<CandidatePracticeQuestionsProps> = ({
  questions,
  type,
  setType,
  difficulty,
  setDifficulty,
  searchTerm,
  setSearchTerm,
}) => {
  return (
    <Box p={4}>
      <Box mb={3}>
        <TextField
          placeholder="Search questions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          fullWidth
          sx={{
            background: '#fff',
            borderRadius: 3,
            "& .MuiInputBase-input": { color: '#333' },
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: '#6B4705' },
              "&:hover fieldset": { borderColor: '#6B4705' },
              "&.Mui-focused fieldset": { borderColor: '#6B4705' },
            },
          }}
        />
      </Box>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Tabs
          value={type}
          onChange={(_, v) => setType(v)}
          sx={{
            p: 1,
            background: '#efe7e7',
            borderRadius: 3,
            minHeight: 48,
            "& .MuiTabs-indicator": { display: 'none' },
          }}
        >
          <Tab
            label="All"
            value=""
            sx={{
              textTransform: 'none',
              borderRadius: 2,
              minHeight: 36,
              px: 2,
              backgroundColor: type === '' ? '#000' : 'transparent',
              color: type === '' ? '#fff' : '#333',
              "&.Mui-selected": { color: '#fff' },
            }}
          />
          {questionType.map((t) => (
            <Tab
              key={t}
              label={t.toUpperCase()}
              value={t}
              sx={{
                textTransform: 'none',
                borderRadius: 2,
                minHeight: 36,
                px: 2,
                backgroundColor: type === t ? '#000' : 'transparent',
                color: type === t ? '#fff' : '#333',
                "&.Mui-selected": { color: '#fff' },
              }}
            />
          ))}
        </Tabs>

        <TextField
          select
          label="Difficulty"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value as QuestionDifficulty)}
          sx={{
            width: 180,
            background: '#fff',
            borderRadius: 3,
            "& .MuiSelect-select": { color: '#333' },
            "& .MuiInputLabel-root": { color: '#333' },
            "& .MuiInputLabel-root.Mui-focused": { color: '#333' },
            "& .MuiSvgIcon-root": { color: '#333' },
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: '#6B4705' },
              "&:hover fieldset": { borderColor: '#6B4705' },
              "&.Mui-focused fieldset": { borderColor: '#6B4705' },
            },
          }}
        >
          <MenuItem value="">Select Difficulty</MenuItem>
          {questionDifficulty.map((d) => (
            <MenuItem key={d} value={d}>
              {d.toUpperCase()}
            </MenuItem>
          ))}
        </TextField>
      </Box>
      <Box>
        {questions.length > 0 ? (
          questions.map((q) => <CandidateQuestionCard key={q.id} question={q} />)
        ) : (
          <Box display="flex" justifyContent="center" py={10}>
            <Typography variant="h6" color="text.secondary">
              No questions available
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default CandidatePracticeQuestions;