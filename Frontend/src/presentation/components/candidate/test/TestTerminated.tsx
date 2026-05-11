import React from 'react'
import { Box, Button, Divider, Stack, Typography } from '@mui/material'
import BlockRoundedIcon from '@mui/icons-material/BlockRounded'
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded'
import { useNavigate } from 'react-router-dom'

const TestTerminatedPage: React.FC = () => {
    const navigate = useNavigate()

    return (
        <Box
            sx={{
                minHeight: '100vh',
                bgcolor: '#0B0707',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                px: 2,
                py: 4,
            }}
        >
            <Box
                sx={{
                    width: '100%',
                    maxWidth: 560,
                    bgcolor: '#fff',
                    border: '5px solid #C90000',
                    px: { xs: 3, sm: 5 },
                    py: 5,
                    textAlign: 'center',
                    boxShadow: '0 24px 70px rgba(0,0,0,0.4)',
                }}
            >
                <Box
                    sx={{
                        width: 86,
                        height: 86,
                        borderRadius: '50%',
                        bgcolor: '#FEE2E2',
                        mx: 'auto',
                        mb: 3,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <BlockRoundedIcon sx={{ fontSize: 48, color: '#B42318' }} />
                </Box>

                <Typography
                    sx={{
                        fontFamily: 'serif',
                        fontSize: { xs: 28, sm: 34 },
                        color: '#7F1D1D',
                        fontWeight: 700,
                    }}
                >
                    Test Terminated
                </Typography>

                <Typography sx={{ mt: 1, color: '#374151', fontSize: 15 }}>
                    Your assessment has been terminated due to repeated policy violations.
                </Typography>

                <Box
                    sx={{
                        mt: 4,
                        p: 3,
                        bgcolor: '#FEF2F2',
                        border: '1px solid #FCA5A5',
                        textAlign: 'left',
                    }}
                >
                    <Stack spacing={2}>
                        <Box sx={{ display: 'flex', gap: 1.5 }}>
                            <WarningAmberRoundedIcon sx={{ color: '#B42318' }} />
                            <Box>
                                <Typography sx={{ fontWeight: 700 }}>
                                    Reason
                                </Typography>
                                <Typography sx={{ fontSize: 14 }}>
                                    Maximum warning limit reached.
                                </Typography>
                            </Box>
                        </Box>

                        <Box sx={{ display: 'flex', gap: 1.5 }}>
                            <WarningAmberRoundedIcon sx={{ color: '#B42318' }} />
                            <Box>
                                <Typography sx={{ fontWeight: 700 }}>
                                    Status
                                </Typography>
                                <Typography sx={{ fontSize: 14 }}>
                                    Terminated
                                </Typography>
                            </Box>
                        </Box>
                    </Stack>
                </Box>

                <Divider sx={{ my: 4 }} />

                <Typography sx={{ fontWeight: 700, mb: 1 }}>
                    What happens next?
                </Typography>

                <Typography sx={{ color: '#4B5563', fontSize: 14, lineHeight: 1.8 }}>
                    Your activity will be reviewed by the assessment team. Please contact the company or test administrator if you believe this happened by mistake.
                </Typography>

                <Button
                    variant="contained"
                    sx={{
                        mt: 4,
                        borderRadius: 999,
                        px: 4,
                        textTransform: 'none',
                        bgcolor: '#B42318',
                        '&:hover': {
                            bgcolor: '#991B1B',
                        },
                    }}
                    onClick={() => navigate('/candidate/practice')}
                >
                    Go to Practice
                </Button>
            </Box>
        </Box>
    )
}

export default TestTerminatedPage