import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Stepper, Step, StepLabel, Button, Typography, Paper } from '@mui/material';
import type { AppDispatch, RootState } from '../../../redux/store';
import CompanyTestBasicInfo from '../../components/company/test/CompanyTestBasicInfo';
import { createTest, getTestById, scheduleAgainTest } from '../../../redux/slices/features/test/companyTestSlice';
import CompanyAddCandidates from '../../components/company/test/CompanyAddCandidates';
import CompanyAddQuestions from '../../components/company/test/CompanyAddQuestions';
import CompanyTestPublishPage from '../../components/company/test/CompanyTestPublishPage';
import CompanyTestRules from '../../components/company/test/CompanyTestRules';
import type { CreateTestPayload, ModalMode } from '../../../types/test';
import { createDefaultTestRules } from '../../../utils/DefaultTestRules';
import toast from 'react-hot-toast';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';
import { createTestValidator } from '../../../lib/validation/testValidation';




const steps = ['Test Details', 'Candidates', 'Questions', 'Rules', 'Publish']

const CreateTestPage: React.FC = () => {
    const {id} = useParams()
    const location = useLocation()
    const dispatch = useDispatch<AppDispatch>();
    const { loading, selectedTest } = useSelector((state: RootState) => state.companyTest)
    const navigate = useNavigate()
    const [currentStep, setCurrentStep] = useState(0)
    const mode: ModalMode = location.pathname.includes("reschedule") ? 'reschedule' : 'create'
    const isRescheduleMode = mode === 'reschedule'

    useEffect(() => {
        if(isRescheduleMode && id){
            dispatch(getTestById({id}))
        }
    }, [dispatch, id, isRescheduleMode])

    const [formData, setFormData] = useState<CreateTestPayload>({
        jobRoleId: selectedTest?.jobRoleId || '',
        name: isRescheduleMode ? `${selectedTest?.name} - Rescheduled` : selectedTest?.name || '',
        description: selectedTest?.description || '',
        startTime: '',
        endTime: '',
        candidates: selectedTest?.candidates.filter((candidate) => candidate.candidateTestStatus !== 'SUBMITTED') ||  [],
        questions: selectedTest?.questions || [],
        rules: selectedTest?.rules ||  createDefaultTestRules()
    })

    const updateFormDate = (data: Partial<CreateTestPayload>) => {
        setFormData((prev) => ({
            ...prev,
            ...data
        }))
    }
    const validate = () => {
        const result = createTestValidator.safeParse(formData)
        if(result.success) return true
        const firstError = result.error.issues[0]
        toast.error(`${firstError.path}: ${firstError.message}`)
        return false
    }

    const handleNext = async() => {
        if(currentStep === steps.length - 1) {
            try {
                if(!validate()){
                    console.log('validation error')
                    return
                }
                if(mode === 'create'){
                    await dispatch(createTest({
                        ...formData,
                        startTime: new Date(formData.startTime).toISOString(),
                        endTime: new Date(formData.endTime).toISOString()
                    })).unwrap()
                    toast.success('Test created successfully')
                    navigate(ROUTES.COMPANY.CREATE_TEST_SUCCESS)
                }
                if(mode === 'reschedule' && id){
                    await dispatch(scheduleAgainTest({data: {
                        ...formData,
                        startTime: new Date(formData.startTime).toISOString(),
                        endTime: new Date(formData.endTime).toISOString()
                    }, id})).unwrap()
                    toast.success('Test Scheduled again successfully')
                    navigate(ROUTES.COMPANY.TEST)
                }
                return
            } catch (error) {
                toast.error(typeof error === 'string' ? error : 'Failed to create Test')
                return
            }
        }
        setCurrentStep((prev) => prev + 1)
    }

    const handleCreateDraft = async() => {
        try {
            if(!validate()){
                toast.error('Validation failed')
                return
            }
            await dispatch(createTest({
                ...formData,
                startTime: new Date(formData.startTime).toISOString(),
                endTime: new Date(formData.endTime).toISOString()
            })).unwrap()
            toast.success('Test draft created successfully')
            navigate(ROUTES.COMPANY.TEST)
        } catch (error) {
            toast.error(typeof error === 'string' ? error : 'Failed to create draft')
        }
    }
    const handleBack = () => {
        setCurrentStep((prev) => prev - 1)
    }

    return (
        <Box sx={{ p: 4, backgroundColor: '#E6DECF', minHeight: '100vh' }}>
             <Typography variant="h5" fontWeight="bold" mb={4}>{mode === 'create' ? 'Create Assessment' : 'Reschedule Assessment'}</Typography>
            
            <Paper elevation={0} sx={{ p: 4, backgroundColor: '#E6DECF' }}>
                <Stepper
                    activeStep={currentStep}
                    alternativeLabel
                    sx={{
                        mb: 6,
                        "& .MuiStepIcon-root": {
                        fontSize: "48px",
                        color: "#B8AA94",
                        },
                        "& .MuiStepIcon-root.Mui-active": {
                        color: "#6B4705",
                        },
                        "& .MuiStepIcon-root.Mui-completed": {
                        color: "#6B4705",
                        },
                        "& .MuiStepIcon-text": {
                        fontSize: "14px",
                        fontWeight: 700,
                        fill: "#fff",
                        },
                        "& .MuiStepLabel-label": {
                        mt: 1,
                        fontWeight: 600,
                        color: "#2B2B2B",
                        },
                    }}
                >
                    {steps.map((label) => (
                        <Step key={label}>
                           <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>


                <Box sx={{ minHeight: '400px' }}>
                    {currentStep === 0 && <CompanyTestBasicInfo data={formData} updateData={updateFormDate} mode={mode}/>}
                    {currentStep === 1 && <CompanyAddCandidates data={formData} updateData={updateFormDate} mode={mode} />}
                    {currentStep === 2 && <CompanyAddQuestions data={formData} updateData={updateFormDate} />}
                    {currentStep === 3 && <CompanyTestRules data={formData} updateData={updateFormDate}/>}
                    {currentStep === 4 && <CompanyTestPublishPage mode={mode} />}
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4, gap: 2 }}>
                    <Button 
                        disabled={currentStep === 0 || loading} 
                        onClick={handleBack}
                        variant="contained" 
                        sx={{
                            backgroundColor: "#0B3861",
                        }}
                    >
                        Back
                    </Button>
                    {currentStep < steps.length - 1 &&
                        <Button 
                            disabled={loading} 
                            onClick={handleCreateDraft} 
                            variant="contained" 
                            sx={{
                                backgroundColor: "#0B3861",
                            }}
                        >
                            {loading ? 'Saving...' :  'Save Draft' }
                        </Button>
                    }
                    <Button 
                        disabled={loading} 
                        onClick={handleNext} 
                        variant="contained" 
                        sx={{
                            backgroundColor: "#6B4705",
                        }}
                    >
                        {loading ? 'Saving...' : currentStep === steps.length - 1 ? mode === 'reschedule' ? 'Schedule Again' : 'Save Draft' : 'Save & Next'}
                    </Button>
                </Box>
            </Paper> 
        </Box>
    );
};

export default CreateTestPage;
