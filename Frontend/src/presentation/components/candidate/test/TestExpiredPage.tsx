import React from 'react'
import type { CandidateTest } from '../../../../types/test'
import { Box, Button, Stack, Typography } from '@mui/material'
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled'
import { ROUTES } from '../../../../constants/routes'
import { useNavigate } from 'react-router-dom'

interface TestExpiredPageProps {
    test: CandidateTest | null
}

const TestExpiredPage: React.FC<TestExpiredPageProps> = ({ test }) => {
    const navigate = useNavigate()
    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #020B13 0%, #02182C 45%, #050505 100%)',
                px: 2,
            }}
        >
            <Box
                sx={{
                    width: '100%',
                    maxWidth: 540,
                    px: { xs: 3, sm: 6 },
                    py: 7,
                    textAlign: 'center',
                    color: '#EAF4FF',
                    background: 'linear-gradient(180deg, #041C33 0%, #143B5F 55%, #1C4F7A 100%)',
                    boxShadow: '0 24px 80px rgba(0,0,0,0.45)',
                    border: '1px solid rgba(255,255,255,0.08)',
                }}
            >
                <Box
                    sx={{
                        width: 76,
                        height: 76,
                        borderRadius: '50%',
                        mx: 'auto',
                        mb: 3,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(255,255,255,0.1)',
                    }}
                >
                    <AccessTimeFilledIcon sx={{ fontSize: 40 }} />
                </Box>

                <Typography
                    sx={{
                        fontFamily: 'serif',
                        fontSize: { xs: 28, sm: 36 },
                        fontWeight: 500,
                        mb: 2,
                    }}
                >
                    Test Link Expired
                </Typography>

                <Typography
                    sx={{
                        fontSize: 16,
                        color: 'rgba(234,244,255,0.75)',
                        mb: 5,
                        lineHeight: 1.7,
                    }}
                >
                    This assessment is no longer available. The allowed test window has already ended.
                </Typography>

                <Stack spacing={2.5} sx={{ maxWidth: 390, mx: 'auto', mb: 5 }}>
                    <InfoRow label="Test Name:" value={test?.name || '-'} />
                    <InfoRow
                        label="Ended At:"
                        value={
                            test?.endTime
                                ? new Date(test.endTime).toLocaleString('en-IN', {
                                      day: '2-digit',
                                      month: 'short',
                                      year: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit',
                                  })
                                : '-'
                        }
                    />
                    <InfoRow label="Status:" value="Expired" />
                </Stack>

                <Button
                    variant="contained"
                    sx={{
                        borderRadius: 999,
                        px: 4,
                        py: 1.2,
                        textTransform: 'none',
                        backgroundColor: '#EAF4FF',
                        color: '#02182C',
                        fontWeight: 700,
                        '&:hover': {
                            backgroundColor: '#D9ECFF',
                        },
                    }}
                    onClick={() => navigate(ROUTES.CANDIDATE.DASHBOARD)}
                >
                    Go to Practice
                </Button>
            </Box>
        </Box>
    )
}

interface InfoRowProps {
    label: string
    value: string
}

const InfoRow: React.FC<InfoRowProps> = ({ label, value }) => {
    return (
        <Box
            sx={{
                display: 'grid',
                gridTemplateColumns: '105px 1fr',
                columnGap: 2,
                textAlign: 'left',
            }}
        >
            <Typography sx={{ fontSize: 16, fontWeight: 600 }}>
                {label}
            </Typography>

            <Typography sx={{ fontSize: 16, fontWeight: 500 }}>
                {value}
            </Typography>
        </Box>
    )
}

export default TestExpiredPage