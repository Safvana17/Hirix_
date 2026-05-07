import React from 'react'
import type { CandidateTest } from '../../../../types/test'
import {
    Box,
    Button,
    Chip,
    Divider,
    Stack,
    Typography,
} from '@mui/material'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import QuizIcon from '@mui/icons-material/Quiz'
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined'
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded'
import { ROUTES } from '../../../../constants/routes'
import { useNavigate } from 'react-router-dom'

interface TestStartPageProps {
    test: CandidateTest | null
}

const TestStartPage: React.FC<TestStartPageProps> = ({ test }) => {
    const navigate = useNavigate()
    const duration =
        test?.startTime && test?.endTime
            ? Math.round(
                  (new Date(test.endTime).getTime() -
                      new Date(test.startTime).getTime()) /
                      60000
              )
            : 60
    const totalQuestions = test?.questions?.length ?? 0
    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background:
                    'radial-gradient(circle at top, #123B63 0%, #02182C 42%, #050505 100%)',
                px: 2,
                py: 5,
            }}
        >
            <Box
                sx={{
                    width: '100%',
                    maxWidth: 680,
                    borderRadius: 5,
                    overflow: 'hidden',
                    bgcolor: '#FFFFFF',
                    boxShadow: '0 30px 90px rgba(0,0,0,0.45)',
                }}
            >
                <Box
                    sx={{
                        px: { xs: 3, sm: 5 },
                        py: 4,
                        color: '#fff',
                        background:
                            'linear-gradient(135deg, #02182C 0%, #0A2E4E 55%, #155A91 100%)',
                    }}
                >
                    <Chip
                        label="Assessment Invitation"
                        sx={{
                            mb: 2,
                            bgcolor: 'rgba(255,255,255,0.14)',
                            color: '#EAF4FF',
                            fontWeight: 600,
                        }}
                    />

                    <Typography
                        sx={{
                            fontSize: { xs: 28, sm: 38 },
                            fontWeight: 700,
                            lineHeight: 1.2,
                        }}
                    >
                        {test?.name || 'Technical Assessment'}
                    </Typography>

                    <Typography
                        sx={{
                            mt: 1.5,
                            color: 'rgba(234,244,255,0.82)',
                            fontSize: 16,
                        }}
                    >
                        You have been invited to take a technical assessment.
                    </Typography>
                </Box>

                <Box sx={{ px: { xs: 3, sm: 5 }, py: 4 }}>
                    <Stack spacing={2.5}>
                        <InfoCard
                            icon={<AccessTimeIcon />}
                            title="Duration"
                            value={`${duration} Minutes`}
                        />

                        <InfoCard
                            icon={<QuizIcon />}
                            title="Total Questions"
                            value={`${totalQuestions} Questions`}
                            description="Includes MCQ, descriptive, and coding questions."
                        />

                        <Box
                            sx={{
                                p: 2.5,
                                borderRadius: 3,
                                bgcolor: '#F6F8FA',
                                border: '1px solid #E5E7EB',
                                display: 'flex',
                                gap: 1.5,
                            }}
                        >
                            <ShieldOutlinedIcon sx={{ color: '#025614', mt: 0.3 }} />

                            <Typography
                                sx={{
                                    color: '#374151',
                                    fontSize: 14.5,
                                    lineHeight: 1.7,
                                }}
                            >
                                <Box
                                    component="span"
                                    sx={{ fontWeight: 700, color: '#111827' }}
                                >
                                    Important:{' '}
                                </Box>
                                This test link is secure and can only be used once.
                                Make sure you have a stable internet connection before
                                proceeding.
                            </Typography>
                        </Box>
                    </Stack>

                    <Divider sx={{ my: 4 }} />

                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        alignItems={{ xs: 'stretch', sm: 'center' }}
                        justifyContent="space-between"
                        spacing={2}
                    >
                        <Typography sx={{ color: '#6B7280', fontSize: 14 }}>
                            Read the instructions carefully before starting.
                        </Typography>

                        <Button
                            variant="contained"
                            startIcon={<PlayArrowRoundedIcon />}
                            sx={{
                                borderRadius: 999,
                                px: 4,
                                py: 1.3,
                                textTransform: 'none',
                                bgcolor: '#025614',
                                color: '#fff',
                                fontWeight: 700,
                                boxShadow: '0 10px 24px rgba(2,86,20,0.25)',
                                '&:hover': {
                                    bgcolor: '#087A27',
                                },
                            }}
                            onClick={() => navigate(ROUTES.CANDIDATE.TEST_LOGIN)}
                        >
                            Proceed to Test
                        </Button>
                    </Stack>
                </Box>
            </Box>
        </Box>
    )
}

interface InfoCardProps {
    icon: React.ReactNode
    title: string
    value: string
    description?: string
}

const InfoCard: React.FC<InfoCardProps> = ({
    icon,
    title,
    value,
    description,
}) => {
    return (
        <Box
            sx={{
                p: 2.5,
                borderRadius: 3,
                border: '1px solid #E5E7EB',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                bgcolor: '#fff',
            }}
        >
            <Box
                sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: '#EAF4FF',
                    color: '#0A2E4E',
                    flexShrink: 0,
                }}
            >
                {icon}
            </Box>

            <Box>
                <Typography sx={{ fontSize: 14, color: '#6B7280', mb: 0.3 }}>
                    {title}
                </Typography>

                <Typography sx={{ fontSize: 19, fontWeight: 700, color: '#111827' }}>
                    {value}
                </Typography>

                {description && (
                    <Typography sx={{ fontSize: 14, color: '#6B7280', mt: 0.4 }}>
                        {description}
                    </Typography>
                )}
            </Box>
        </Box>
    )
}

export default TestStartPage