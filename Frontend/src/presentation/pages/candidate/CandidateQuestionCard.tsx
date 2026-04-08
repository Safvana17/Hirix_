import React from 'react';
import { Card, Box, Typography, Chip, Button } from '@mui/material';
import type { Question } from '../../../types/question';

interface QuestionCardProps {
  question: Question;
}

const CandidateQuestionCard: React.FC<QuestionCardProps> = ({ question }) => (
  <Card
    sx={{
      p: 2,
      mb: 2,
      borderRadius: 3,
      background: '#fff',
      boxShadow: 'none',
      border: '1px solid #e0c89f',
    }}
  >
    <Box display="flex" justifyContent="space-between" alignItems="flex-start">
      <Box>
        <Box display="flex" alignItems="center" gap={2}>
          <Typography fontWeight="bold" fontSize={16}>
            {question.title}
          </Typography>
          {question.isPremium ? (
            <Chip
              label="Premium"
              size="small"
              sx={{
                background: 'linear-gradient(to right, #8822F5, #feb47b)',
                color: '#fff',
                fontWeight: 500,
              }}
            />
          ): (
            <Chip
              label="Free"
              size="small"
              sx={{
                background: 'linear-gradient(to right, #8822F5, #feb47b)',
                color: '#fff',
                fontWeight: 500,
              }}
            /> 
          )}
        </Box>

        <Box display="flex" gap={1.5} mt={1} alignItems="center">
          <Typography variant="body2" color="text.secondary">
            {question.categoryName}
          </Typography>
        </Box>

        <Box display="flex" gap={1} mt={1.5}>
          <Chip label={question.type} size="small" sx={{ background: '#6B4705', color: '#fff' }} />
          <Chip
            label={question.difficulty}
            size="small"
            sx={{ background: '#274E72', color: '#fff' }}
          />
        </Box>
      </Box>

      <Box display="flex" alignItems="center" gap={1}>
        <Button sx={{background: '#000', borderRadius:2, color: "#FFF"}}>Try</Button>
      </Box>
    </Box>
  </Card>
);

export default CandidateQuestionCard;