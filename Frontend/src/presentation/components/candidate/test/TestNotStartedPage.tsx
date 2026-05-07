import React, { useEffect, useState } from 'react'
import type { CandidateTest } from '../../../../types/test'
import { Box, Button, Stack, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../../../../constants/routes'

interface TestNotStartedPageProps {
    test: CandidateTest | null
}

const TestNotStartedPage: React.FC<TestNotStartedPageProps> = ({ test }) => {
    const navigate = useNavigate()
    const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(test?.startTime))

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(getTimeLeft(test?.startTime))
        }, 1000)

        return () => clearInterval(interval)
    }, [test?.startTime])

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
                    maxWidth: 520,
                    minHeight: 620,
                    px: { xs: 3, sm: 6 },
                    py: 6,
                    color: '#EAF4FF',
                    textAlign: 'center',
                    background: 'linear-gradient(180deg, #041C33 0%, #0B3D68 55%, #155A91 100%)',
                    boxShadow: '0 24px 80px rgba(0,0,0,0.45)',
                    border: '1px solid rgba(255,255,255,0.08)',
                }}
            >
                <Typography
                    sx={{
                        fontFamily: 'serif',
                        fontSize: { xs: 26, sm: 34 },
                        fontWeight: 500,
                        mb: 6,
                    }}
                >
                    Your Test has not started yet!
                </Typography>

                <Stack spacing={2.5} sx={{ maxWidth: 390, mx: 'auto', mb: 7 }}>
                    <InfoRow label="Test Name:" value={test?.name || '-'} />
                    <InfoRow label="Company:" value={test?.companyName || '-'} />
                    <InfoRow
                        label="Start Time:"
                        value={
                            test?.startTime
                                ? new Date(test.startTime).toLocaleTimeString('en-IN', {
                                      hour: '2-digit',
                                      minute: '2-digit',
                                  })
                                : '-'
                        }
                    />
                    <InfoRow 
                        label="Duration:" 
                        value={
                            test?.startTime && test.endTime
                              ? `${Math.round(
                                  (new Date(test?.endTime).getTime() - new Date(test?.startTime).getTime()) / 60000
                                )} Minutes`
                              : "60 Minutes" 
                        }
                    />
                </Stack>

                <Typography sx={{ fontSize: 20, mb: 1 }}>
                    Test Starts in
                </Typography>

                <Typography
                    sx={{
                        fontSize: { xs: 34, sm: 42 },
                        letterSpacing: 4,
                        fontWeight: 300,
                        mb: 8,
                    }}
                >
                    {timeLeft.hours} : {timeLeft.minutes} : {timeLeft.seconds}
                </Typography>

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
                    Goto Practice
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
                gridTemplateColumns: '110px 1fr',
                columnGap: 2,
                textAlign: 'left',
                alignItems: 'center',
            }}
        >
            <Typography sx={{ fontSize: 17, fontWeight: 600 }}>
                {label}
            </Typography>

            <Typography sx={{ fontSize: 17, fontWeight: 500 }}>
                {value}
            </Typography>
        </Box>
    )
}

export default TestNotStartedPage

    const getTimeLeft = (time?: string | Date ) => {
        if(!time){
            return {
                hours: "00",
                minutes: "00",
                seconds: "00"
            }
        }

        const now = new Date().getTime()
        const target = new Date(time).getTime()
        const difference = target - now

        if(difference <= 0 ){
            return {
                hours: "00",
                minutes: "00",
                seconds: "00"
            }
        }

        const hours = Math.floor(difference/ (1000 * 60 * 60))
        const minutes = Math.floor(difference/ (1000 * 60)) % 60
        const seconds = Math.floor(difference / 1000 ) % 60

        return {
            hours: String(hours).padStart(2, '0'),
            minutes: String(minutes).padStart(2, '0'),
            seconds: String(seconds).padStart(2, '0')
        }
    }