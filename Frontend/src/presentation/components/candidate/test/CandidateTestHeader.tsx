import React, { useEffect, useState } from 'react'
import type { CandidateTest } from '../../../../types/test'
import {
    AppBar,
    Box,
    Button,
    Stack,
    Toolbar,
    Typography,
} from '@mui/material'
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled'
import SendRoundedIcon from '@mui/icons-material/SendRounded'

interface CandidateTestHeaderProps {
    test: CandidateTest
    onSubmit?: () => void
}

const getTimeLeft = (time? : Date | string) => {
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

    if(difference <= 0){
        return {
            hours: "00",
            minutes: "00",
            seconds: "00"
        }
    }

    const hours = Math.floor(difference/(1000 * 60 * 60))
    const minutes = Math.floor(difference/ (1000 * 60)) % 60
    const seconds = Math.floor(difference/1000) % 60

    return{
        hours: String(hours).padStart(2, '0'),
        minutes: String(minutes).padStart(2, '0'),
        seconds: String(seconds).padStart(2, '0')
    }
}

const CandidateTestHeader: React.FC<CandidateTestHeaderProps> = ({ test, onSubmit}) => {
    const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(test.endTime))

    console.log('test from header: ', test)
    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(getTimeLeft(test.endTime))
        }, 1000)
        return () => clearInterval(interval)
    }, [test.endTime])

    return (
        <AppBar
            position="sticky"
            elevation={0}
            sx={{
                background:
                    'linear-gradient(135deg, #18344F 0%, #274E72 55%, #325E87 100%)',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.28)',
            }}
        >
            <Toolbar
                sx={{
                    minHeight: '108px !important',
                    px: { xs: 2, sm: 4 },
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: 2,
                }}
            >
                <Box>
                    <Typography
                        sx={{
                            fontSize: { xs: 22, sm: 30 },
                            fontWeight: 700,
                            color: '#FFFFFF',
                            letterSpacing: 0.5,
                            lineHeight: 1.2,
                        }}
                    >
                        {test.name}
                    </Typography>
                    <Typography sx={{ color: '#D9ECFF', fontSize: 14 }} >
                        Stay focused and complete all questions
                    </Typography>
                </Box>
                <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                    flexShrink={0}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            px: 2,
                            py: 1.2,
                            borderRadius: 2,
                            bgcolor: '#FFFFFF',
                            color: '#111827',
                            boxShadow: '0 4px 14px rgba(0,0,0,0.18)',
                        }}
                    >
                        <AccessTimeFilledIcon
                            sx={{
                                fontSize: 22,
                                color: '#1F2937',
                            }}
                        />

                        <Typography
                            sx={{
                                fontSize: { xs: 18, sm: 22 },
                                fontWeight: 700,
                                letterSpacing: 1,
                            }}
                        >
                            {timeLeft.hours} : {timeLeft.minutes} : {timeLeft.seconds}
                        </Typography>
                    </Box>

                    <Button
                        variant="contained"
                        startIcon={<SendRoundedIcon />}
                        onClick={onSubmit}
                        sx={{
                            height: 52,
                            px: 3,
                            borderRadius: 2,
                            textTransform: 'none',
                            fontSize: 17,
                            fontWeight: 700,
                            bgcolor: '#0F172A',
                            color: '#FFFFFF',
                            boxShadow: '0 8px 20px rgba(0,0,0,0.25)',
                            '&:hover': {
                                bgcolor: '#111827',
                            },
                        }}
                    >
                        Submit
                    </Button>
                </Stack>
            </Toolbar>
        </AppBar>
    )
}

export default CandidateTestHeader