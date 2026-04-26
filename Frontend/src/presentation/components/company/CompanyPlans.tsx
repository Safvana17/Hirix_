import React from 'react'
import { Box, Card, Pagination, Stack, Typography } from '@mui/material'
import { Check, Close } from '@mui/icons-material'
import type { CurrentPlan, SubscriptionPlan } from '../../../types/subscription'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../../redux/store'
import toast from 'react-hot-toast'
import { changeSubscription, getCurrentPlan, startFreeTrial } from '../../../redux/slices/features/subscription/subscriptionSlice'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../../../constants/routes'

interface CompanyPlansProps {
    plans: SubscriptionPlan[]
    currentPlan : CurrentPlan | null
    page: number
    setPage: (page: number) => void
}

const COMPANY_FEATURES = [
  { key: "canUseAdminQuestions", label: "Use admin questions", type: "boolean" },
  { key: "canCreateCustomQuestions", label: "Create custom questions", type: "boolean" },
  { key: "maxTestsPerMonth", label: (v: number | null) => v ? `Up to ${v} tests/month` : "Unlimited tests", type: "limit" },
  { key: "maxCandidates", label: (v: number | null) => v ? `Up to ${v} candidates` : "Unlimited candidates", type: "limit" },
  { key: "maxJobRolesPerMonth", label: (v: number | null) => v ? `${v} job roles/month` : "Unlimited job roles", type: "limit" },
  { key: "maxInterviewPerMonth", label: (v: number | null) => v ? `${v} interviews/month` : "Unlimited interviews", type: "limit" },
]


const CompanyPlans: React.FC<CompanyPlansProps>= ({plans, currentPlan, page, setPage}) => {

  const { pagination } = useSelector((state: RootState) => state.subscription)
  const { user } = useSelector((state: RootState) => state.auth)
  const dispatch = useDispatch<AppDispatch>()
  const navigate =useNavigate()

  const getFeaturesByTarget = () => {
    return COMPANY_FEATURES
  }

  const handleChangeSubscription = async(planId: string) => {
       try {
         if(!user) return
         const response = await dispatch(changeSubscription({planId, role: user.role})).unwrap()
         if(response.isPaymentRequired){
          navigate(ROUTES.COMMON.PAYMENT)
         }else{
          toast.success('Your subscription plan changed successfully')
         }
       } catch (error) {
        toast.error(typeof error === 'string' ? error : 'Failed to change subscription')
       }
  }
  console.log('plan from card:', plans)

  const handleStartTrial = async(planId: string) => {
    try {
      if(!user) return
      await dispatch(startFreeTrial({id: planId, role: user.role})).unwrap()
      await dispatch(getCurrentPlan({role: user.role}))
      toast.success('Free trial started successfully.')
    } catch (error) {
      toast.error(typeof error === 'string' ? error : 'Failed to start free trial')
    }
  }
  return (
    <div>
      <Box
        display="grid"
        gridTemplateColumns="repeat(auto-fill, minmax(260px, 1fr))"
        gap={2}
        mt={2}
      >
        {plans.map((p) => (
          
          <Card
            key={p.id}
            sx={{
              p: 2,
              borderRadius: 3,
              backgroundColor: "#fff",
              border: "1px solid #e0e0e0",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: 260
            }}
          >
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box
                sx={{
                  fontSize: 10,
                  px: 1.2,
                  py: 0.3,
                  borderRadius: "20px",
                  backgroundColor: p.isActive ? '#91f580' : '#f66b6b',
                  color: "#fff"
                }}
              >
                {p.isActive ? 'Active' : 'Deactivated'}
              </Box>
                <Typography fontWeight="bold">{p.planName}</Typography>
                  <Box
                    sx={{
                      fontSize: 11,
                      px: 1.2,
                      py: 0.3,
                      borderRadius: "20px",
                      backgroundColor: p.target === 'company' ?  "#6B4705" : '#0B3358',
                      color: "#fff",
                      textTransform: "capitalize"
                    }}
                  >
                    {p.target}
                  </Box>
              </Box>
              <Box mt={1}>
                <Typography variant="h5" fontWeight="bold">
                  ₹{p.price}
                  <Typography component="span" variant="body2">
                    {" "} / {p.billingCycle}
                  </Typography>
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {p.durationDays} days
                </Typography>
              </Box>
              <Stack spacing={0.5} mt={1}>
                {getFeaturesByTarget().map((feature) => {
                  const value = p[feature.key as keyof typeof p]
                  if (feature.type === "boolean" && value) {
                    return (
                      <Typography key={feature.key} variant="body2">
                        <Check sx={{color: 'green'}} /> 
                        {typeof feature.label === "string" ? feature.label : ""}
                      </Typography>
                    )
                  }
                  if (feature.type === "limit") {
                    return (
                      <Typography key={feature.key} variant="body2">
                        <Check sx={{color: 'green'}} /> 
                          {typeof feature.label === "function"
                            ? feature.label(value as number | null)
                            : feature.label}
                      </Typography>
                    )
                  }
                  if (feature.type === "boolean" && !value) {
                    return (
                      <Typography key={feature.key} variant="body2">
                        <Close sx={{color: 'red'}} />
                        {typeof feature.label === "string" ? feature.label : ""}
                      </Typography>
                    )
                  }
                  return null
                })}
              </Stack>
              <Box display="flex" gap={1} mt={2}>
                {p.isTrialEnabled && (
                  p.id !== currentPlan?.id && (
                  <button 
                    onClick={() => handleStartTrial(p.id)}
                    className='cursor-pointer w-full p-2 border rounded-lg text-white font-bold bg-[#021A30]'
                  >
                    Start Trial
                  </button>
                  )
                )}
                <button 
                  onClick={ () => handleChangeSubscription(p.id)}
                  disabled={currentPlan?.id === p.id}
                  className={`w-full p-2 border rounded-lg text-white font-bold cursor-pointer ${currentPlan?.id === p.id ? 'border-green-800 bg-green-800 cursor-not-allowed' : 'border-[#6B4705] bg-[#6B4705]'}`}>
                  {currentPlan?.id === p.id ? 'Current plan' : 'Upgrade'}
                </button>
              </Box>
          </Card>
        ))}
      </Box>
      <Box display="flex" justifyContent="center" mt={3}>
        <Pagination
          count={pagination.plans.totalPages || 1}
          page={page}
          onChange={(_, v) => setPage(v)}
          color="primary"
        />
      </Box>
      <Typography textAlign="center" mt={1} variant="caption">
        Page {page} of {pagination.plans.totalPages || 1}
      </Typography>
    </div>
  )
}

export default CompanyPlans
