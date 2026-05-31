import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Clock3, Code2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const InterviewErrorPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box className="min-h-screen bg-slate-950 flex items-center justify-center px-6">
      <Box className="max-w-2xl w-full text-center bg-slate-900 border border-slate-800 rounded-3xl p-10 shadow-2xl">
        
        <Box className="flex justify-center mb-6">
          <Box className="h-20 w-20 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <Clock3 className="h-10 w-10 text-red-400" />
          </Box>
        </Box>

        <Typography
          variant="h4"
          className="font-bold text-white mb-3"
        >
          Interview Link Expired
        </Typography>

        <Typography
          variant="body1"
          className="text-slate-400 mb-8 leading-relaxed"
        >
          This interview session is no longer available or the invitation
          link has expired.
        </Typography>

        <Box className="bg-slate-950 border border-slate-800 rounded-2xl p-6 mt-5 mb-8">
          <Box className="flex justify-center mb-3">
            <Code2 className="h-8 w-8 text-indigo-400" />
          </Box>

          <Typography
            variant="h6"
            className="text-slate-200 font-semibold mt-3 mb-2"
          >
            Keep Practicing
          </Typography>

          <Typography
            variant="body2"
            className="text-slate-400 mt-4"
          >
            Prepare for your next interview with coding challenges,
            technical questions, mock tests, and real-world assessments.
            We have a large collection of practice questions to help you
            improve your skills and boost your confidence.
          </Typography>
        </Box>

        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/login')}
          sx={{
            borderRadius: '14px',
            textTransform: 'none',
            px: 4,
            py: 1.5,
            mb: 4,
          }}
        >
          Start Practicing
        </Button>
      </Box>
    </Box>
  );
};

export default InterviewErrorPage;