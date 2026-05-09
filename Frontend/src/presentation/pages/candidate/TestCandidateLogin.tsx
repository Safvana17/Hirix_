import { Box, Button, Stack, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import type { AppDispatch } from '../../../redux/store'
import { testCandidateLogin } from '../../../redux/slices/features/test/CandidateTestSlice'
import { useNavigate, useParams } from 'react-router-dom'
import { ROUTES } from '../../../constants/routes'

const TestCandidateLogin: React.FC = () => {
    const { token } = useParams()
    const [formData, setFormData] = useState({
        name: '',
        email: '',
    })
    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate()

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleCandidateLogin = async() => {
        if (!formData.name.trim()) {
            toast.error('Please provide valid name')
            return
        }

        if (!formData.email.trim()) {
            toast.error('Please provide your email')
            return
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

        if (!emailRegex.test(formData.email)) {
            toast.error('Please provide a valid email')
            return
        }

       try {
         if(token){
            await dispatch(testCandidateLogin({data: formData, token: token})).unwrap()
            navigate(ROUTES.CANDIDATE.TEST_INSTRUCTIONS)
         }
       } catch (error) {
        toast.error(typeof error === 'string' ? error : 'Failed to login')
       }
    }

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
                    <Typography
                        sx={{
                            fontSize: { xs: 28, sm: 38 },
                            fontWeight: 700,
                            lineHeight: 1.2,
                        }}
                    >
                        Candidate Details
                    </Typography>

                    <Typography
                        sx={{
                            mt: 1.5,
                            color: 'rgba(234,244,255,0.82)',
                            fontSize: 16,
                        }}
                    >
                        Please provide your details to continue.
                    </Typography>
                </Box>

                <Box sx={{ px: { xs: 3, sm: 5 }, py: 4 }}>
                    <Stack spacing={2.5}>
                        <TextField
                            fullWidth
                            label="Full Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                        />

                        <TextField
                            fullWidth
                            label="Email Address"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email address"
                        />

                        <Button
                            fullWidth
                            variant="contained"
                            sx={{
                                borderRadius: 999,
                                px: 4,
                                py: 1.3,
                                mt: 1,
                                textTransform: 'none',
                                bgcolor: '#025614',
                                color: '#fff',
                                fontWeight: 700,
                                boxShadow: '0 10px 24px rgba(2,86,20,0.25)',
                                '&:hover': {
                                    bgcolor: '#087A27',
                                },
                            }}
                            onClick={handleCandidateLogin}
                        >
                            Continue
                        </Button>
                    </Stack>
                </Box>
            </Box>
        </Box>
    )
}

export default TestCandidateLogin