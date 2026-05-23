import React, { useState } from 'react'
import { Box, Button, Divider, Stack, Typography } from '@mui/material'
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded'
import AssignmentTurnedInRoundedIcon from '@mui/icons-material/AssignmentTurnedInRounded'
import LibraryAddRoundedIcon from '@mui/icons-material/LibraryAddRounded'
import PersonAddAltRoundedIcon from '@mui/icons-material/PersonAddAltRounded'
import { useNavigate, useParams } from 'react-router-dom'
import { ROUTES } from '../../../../constants/routes'
import QuestionModal from '../../modal/QuestionModal'
import type { ModalMode, QuestionFormData } from '../../../../types/question'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../../../redux/store'
import toast from 'react-hot-toast'
import { getAllPublicCategories, submitQuestion } from '../../../../redux/slices/features/test/CandidateTestSlice'


const TestSubmittedPage: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalMode, setModalMode] = useState<ModalMode>('create')
    const { categories } = useSelector((state: RootState) => state.candidateTest)
    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    const { token } = useParams()

    // useEffect(() => {
    //     if(token)
    //       dispatch(getAllPublicCategories({token}))
    // }, [dispatch, token])

    const handleAddQuestion = () => {
        try {
            setModalMode('create')
            if(!token){
                toast.error('Token is not available')
                return
            }
            if(categories.length === 0){
                dispatch(getAllPublicCategories({token})).unwrap()
            }
            setIsModalOpen(true)
        } catch (error) {
            toast.error(typeof error === 'string' ? error : 'failed to open add question modal')
        }
    }
    
    const handleSaveQuestion = async(data: QuestionFormData) => {
        try {
            if(!token){
               toast.error("No token available")
               return
            }
            if(modalMode === 'create' && token){
                console.log('from create')
                await dispatch(submitQuestion({data, token})).unwrap()
                console.log('reached here')
                setIsModalOpen(false)
                toast.success('Question added successfully')
                navigate(ROUTES.CANDIDATE.QUESTION_SUBMITTED)
            }
        } catch (error) {
            toast.error(typeof error === 'string' ? error : 'Failed to create question')
        }
    }
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
                    border: '5px solid #0EA5E9',
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
                        bgcolor: '#BBF7D0',
                        mx: 'auto',
                        mb: 3,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <CheckCircleOutlineRoundedIcon
                        sx={{ fontSize: 52, color: '#16A34A' }}
                    />
                </Box>

                <Typography
                    sx={{
                        fontFamily: 'serif',
                        fontSize: { xs: 28, sm: 34 },
                        color: '#166534',
                        fontWeight: 700,
                    }}
                >
                    Test Submitted Successfully
                </Typography>

                <Typography sx={{ mt: 1, color: '#374151', fontSize: 15 }}>
                    Thank you for completing the assessment.
                </Typography>

                <Box
                    sx={{
                        mt: 4,
                        p: 3,
                        bgcolor: '#F4F1F1',
                        textAlign: 'left',
                    }}
                >
                    <Stack spacing={2}>
                        <Box sx={{ display: 'flex', gap: 1.5 }}>
                            <AssignmentTurnedInRoundedIcon sx={{ color: '#6B7280' }} />
                            <Box>
                                <Typography sx={{ fontWeight: 700 }}>
                                    Status
                                </Typography>
                                <Typography sx={{ fontSize: 14 }}>
                                    Submitted
                                </Typography>
                            </Box>
                        </Box>

                        <Box sx={{ display: 'flex', gap: 1.5 }}>
                            <AssignmentTurnedInRoundedIcon sx={{ color: '#6B7280' }} />
                            <Box>
                                <Typography sx={{ fontWeight: 700 }}>
                                    Evaluation
                                </Typography>
                                <Typography sx={{ fontSize: 14 }}>
                                    Under Review
                                </Typography>
                            </Box>
                        </Box>
                    </Stack>
                </Box>

                <Divider sx={{ my: 4 }} />

                <Box sx={{ textAlign: 'left' }}>
                    <Typography sx={{ fontWeight: 800, mb: 2 }}>
                        What Next?
                    </Typography>

                    <Typography component="ul" sx={{ color: '#374151', fontSize: 14, lineHeight: 2 }}>
                        <li>Your responses are being evaluated by the team.</li>
                        <li>You will receive result updates through email.</li>
                        <li>You can create an account to practice more questions.</li>
                    </Typography>
                </Box>

                <Stack spacing={2} sx={{ mt: 4 }}>
                    <Button
                        variant="contained"
                        startIcon={<PersonAddAltRoundedIcon />}
                        sx={{
                            py: 1.3,
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 700,
                            bgcolor: '#02182C',
                            '&:hover': {
                                bgcolor: '#0A2E4E',
                            },
                        }}
                        onClick={() => navigate(ROUTES.PUBLIC.HOME)}
                    >
                        Create Account for Practice
                    </Button>

                    <Button
                        variant="outlined"
                        startIcon={<LibraryAddRoundedIcon />}
                        sx={{
                            py: 1.3,
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 700,
                            borderColor: '#02182C',
                            color: '#02182C',
                        }}
                        onClick={handleAddQuestion}
                    >
                        Submit a Question to Practice Library
                    </Button>
                </Stack>

                <Typography sx={{ mt: 4, fontWeight: 700, fontSize: 14 }}>
                    You can close this window
                </Typography>
            </Box>
            <QuestionModal
                key={modalMode}
                isOpen={isModalOpen}
                mode={modalMode}
                categories={categories}
                role='Candidate'
                initialData={null}
                onClose={() => {
                  setIsModalOpen(false)
                }}
                onSave={handleSaveQuestion}
            />
        </Box>
    )
}

export default TestSubmittedPage