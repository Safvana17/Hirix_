import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Stepper, Step, StepLabel, Button, Typography, Paper } from '@mui/material';
import type { AppDispatch, RootState } from '../../../redux/store';
import CompanyTestBasicInfo from '../../components/company/test/CompanyTestBasicInfo';
import { createTest } from '../../../redux/slices/features/test/companyTestSlice';
import CompanyAddCandidates from '../../components/company/test/CompanyAddCandidates';
import CompanyAddQuestions from '../../components/company/test/CompanyAddQuestions';
import CompanyTestPublishPage from '../../components/company/test/CompanyTestPublishPage';
import CompanyTestRules from '../../components/company/test/CompanyTestRules';
import type { CreateTestPayload } from '../../../types/test';
import { createDefaultTestRules } from '../../../utils/DefaultTestRules';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';
import { createTestValidator } from '../../../lib/validation/testValidation';




const steps = ['Test Details', 'Candidates', 'Questions', 'Rules', 'Publish'];

const CreateTestPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { loading } = useSelector((state: RootState) => state.companyTest)
    const navigate = useNavigate()
    const [currentStep, setCurrentStep] = useState(0)
    const [formData, setFormData] = useState<CreateTestPayload>({
        jobRoleId: '',
        name: '',
        description: '',
        startTime: '',
        endTime: '',
        candidates: [],
        questions: [],
        rules: createDefaultTestRules()
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
                await dispatch(createTest(formData)).unwrap()
                toast.success('Test created successfully')
                navigate(ROUTES.COMPANY.CREATE_TEST_SUCCESS)
            } catch (error) {
                toast.error(typeof error === 'string' ? error : 'Failed to create Test')
            }
        }
        setCurrentStep((prev) => prev + 1)
    }

    const handleBack = () => {
        setCurrentStep((prev) => prev - 1)
    }

    return (
        <Box sx={{ p: 4, backgroundColor: '#E6DECF', minHeight: '100vh' }}>
             <Typography variant="h5" fontWeight="bold" mb={4}>Create Assessment</Typography>
            
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
                    {currentStep === 0 && <CompanyTestBasicInfo data={formData} updateData={updateFormDate} />}
                    {currentStep === 1 && <CompanyAddCandidates data={formData} updateData={updateFormDate} />}
                    {currentStep === 2 && <CompanyAddQuestions data={formData} updateData={updateFormDate} />}
                    {currentStep === 3 && <CompanyTestRules data={formData} updateData={updateFormDate}/>}
                    {currentStep === 4 && <CompanyTestPublishPage />}
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
                    <Button 
                        disabled={loading} 
                        onClick={handleNext} 
                        variant="contained" 
                        sx={{
                            backgroundColor: "#6B4705",
                        }}
                    >
                        {loading ? 'Publishing...' : currentStep === steps.length - 1 ? 'Publish & Send Invites' : 'Save & Next'}
                    </Button>
                </Box>
            </Paper> 
        </Box>
    );
};

export default CreateTestPage;
