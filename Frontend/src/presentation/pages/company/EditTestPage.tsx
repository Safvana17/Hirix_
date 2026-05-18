import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Stepper, Step, StepLabel, Button, Typography, Paper } from '@mui/material';
import type { AppDispatch, RootState } from '../../../redux/store';
import CompanyTestBasicInfo from '../../components/company/test/CompanyTestBasicInfo';
import { editTest, getTestById } from '../../../redux/slices/features/test/companyTestSlice';
import CompanyAddCandidates from '../../components/company/test/CompanyAddCandidates';
import CompanyAddQuestions from '../../components/company/test/CompanyAddQuestions';
import CompanyTestPublishPage from '../../components/company/test/CompanyTestPublishPage';
import CompanyTestRules from '../../components/company/test/CompanyTestRules';
import type { CreateTestPayload } from '../../../types/test';
import { createDefaultTestRules } from '../../../utils/DefaultTestRules';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';
import { createTestValidator } from '../../../lib/validation/testValidation';


const steps = ['Test Details', 'Candidates', 'Questions', 'Rules', 'Publish']

const EditTestPage: React.FC = () => {
    const { id } = useParams()
    const dispatch = useDispatch<AppDispatch>();
    const { loading } = useSelector((state: RootState) => state.companyTest)
    const navigate = useNavigate()
    const [currentStep, setCurrentStep] = useState(0)
    const {selectedTest} = useSelector((state: RootState) => state.companyTest)

    useEffect(() => {
        if(id)
          dispatch(getTestById({id}))
    }, [id, dispatch])

    const formatForDateTimeLocal = (value: string) => {
      const date = new Date(value)
      const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      return localDate.toISOString().slice(0, 16)
    }

    const [formData, setFormData] = useState<CreateTestPayload | null>({
        name: selectedTest?.name || '',
        jobRoleId: selectedTest?.jobRoleId || '',
        description: selectedTest?.description || '',
        startTime: selectedTest?.startTime ? formatForDateTimeLocal(selectedTest.startTime) : '',
        endTime: selectedTest?.endTime ? formatForDateTimeLocal(selectedTest.endTime) : '',
        questions: selectedTest?.questions || [],
        candidates: selectedTest?.candidates.map((c) => ({email: c.email})) || [],
        rules: {
            ...createDefaultTestRules(),
            ...selectedTest?.rules,
            timing: {
                ...createDefaultTestRules().timing,
                ...selectedTest?.rules.timing
            },
            navigation: {
                ...createDefaultTestRules().navigation,
                ...selectedTest?.rules.navigation 
            },
            proctoring: {
                ...createDefaultTestRules().proctoring,
                ...selectedTest?.rules.proctoring  
            },
            behavior: {
                ...createDefaultTestRules().behavior,
                ...selectedTest?.rules.behavior
            },
            autoSave: {
                ...createDefaultTestRules().autoSave,
                ...selectedTest?.rules.autoSave
            }
        }
    })

    const updateFormDate = (data: Partial<CreateTestPayload>) => {
        setFormData((prev) => {
            if(!prev) return prev
            return {
                ...prev,
                ...data
            }
        })
    }
const validate = () => {
  if (!formData) {
    toast.error("Test data is missing")
    return false
  }

  const result = createTestValidator.safeParse(formData)

  if (result.success) return true

  console.table(
    result.error.issues.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message,
      expected: "expected" in issue ? issue.expected : "",
      received: "received" in issue ? issue.received : "",
    }))
  )

  const firstError = result.error.issues[0]

  toast.error(`${firstError.path.join(".")}: ${firstError.message}`)

  return false
}

    const handleNext = async() => {
        if(currentStep === steps.length - 1) {
            try {
                if(!validate()){
                    console.log('validation error')
                    return
                }
                if(!id || !formData) return
                await dispatch(editTest({data: formData, id: id})).unwrap()
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

    if(!formData) return

    return (
        <Box sx={{ p: 4, backgroundColor: '#E6DECF', minHeight: '100vh' }}>
             <Typography variant="h5" fontWeight="bold" mb={4}>Edit Assessment</Typography>
            
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
                    {currentStep === 0 && <CompanyTestBasicInfo data={formData} updateData={updateFormDate} mode='edit'/>}
                    {currentStep === 1 && <CompanyAddCandidates data={formData} updateData={updateFormDate} mode='edit' />}
                    {currentStep === 2 && <CompanyAddQuestions data={formData} updateData={updateFormDate} />}
                    {currentStep === 3 && <CompanyTestRules data={formData} updateData={updateFormDate}/>}
                    {currentStep === 4 && <CompanyTestPublishPage mode='edit'  />}
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
                        {loading ? 'Updating...' : currentStep === steps.length - 1 ? 'Update' : 'Save & Next'}
                    </Button>
                </Box>
            </Paper> 
        </Box>
    );
};

export default EditTestPage;
