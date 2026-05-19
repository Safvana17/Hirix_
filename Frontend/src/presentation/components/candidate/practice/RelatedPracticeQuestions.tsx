import React, { useState } from 'react';
import {
  Button,
  Card,
  Chip,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import type { Question } from '../../../../types/question';

interface RelatedPracticeQuestionsProps {
  questions?: Question[];
  onTry: (questionId: string) => void;
}

const RelatedPracticeQuestions: React.FC<RelatedPracticeQuestionsProps> = ({
  questions = [],
  onTry,
}) => {
  const [startIndex, setStartIndex] = useState(0);
  const visibleQuestions = questions?.slice(startIndex, startIndex + 3);

  if (questions?.length === 0) return null
  const handlePrev = () => {
    setStartIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setStartIndex((prev) => Math.min(prev + 1, questions.length - 3));
  };

  if (!questions.length) return null;

  return (
    <Card sx={{ mt: 3, p: 3, borderRadius: 3, background: '#fff' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" fontWeight={800}>
          Related Questions
        </Typography>

        <Stack direction="row" spacing={1}>
          <IconButton disabled={startIndex === 0} onClick={handlePrev}>
            <ChevronLeft />
          </IconButton>

          <IconButton disabled={startIndex >= questions.length - 3} onClick={handleNext}>
            <ChevronRight />
          </IconButton>
        </Stack>
      </Stack>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
        {visibleQuestions.map((question) => (
          <Card
            key={question.id}
            sx={{
              flex: 1,
              p: 2,
              borderRadius: 3,
              boxShadow: 'none',
              border: '1px solid #E5E7EB',
            }}
          >
            <Stack direction="row" spacing={1} mb={1}>
              <Chip
                label={question.isPremium ? 'Premium' : 'Free'}
                size="small"
                sx={{ background: '#D9B46F' }}
              />
              <Chip
                label={question.type}
                size="small"
                sx={{ background: '#6B4705', color: '#fff' }}
              />
            </Stack>

            <Typography fontWeight={700} fontSize={14} minHeight={45}>
              {question.title}
            </Typography>

            <Typography fontSize={13} color="text.secondary" mt={1}>
              {question.difficulty}
            </Typography>

            <Button
              fullWidth
              onClick={() => onTry(question.id)}
              sx={{
                mt: 2,
                background: '#001E33',
                color: '#fff',
                borderRadius: 2,
                textTransform: 'none',
                '&:hover': { background: '#003A5C' },
              }}
            >
              Try
            </Button>
          </Card>
        ))}
      </Stack>
    </Card>
  );
};

export default RelatedPracticeQuestions