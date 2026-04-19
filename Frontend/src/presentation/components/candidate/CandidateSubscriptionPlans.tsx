import React from 'react'
import { Box, Card, Pagination, Stack, Typography } from '@mui/material'
import { Check, Close } from '@mui/icons-material'
import type { CurrentPlan, SubscriptionPlan } from '../../../types/subscription'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../../redux/store'
import toast from 'react-hot-toast'
import { changeSubscription } from '../../../redux/slices/features/subscription/subscriptionSlice'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../../../constants/routes'

interface CandidatePlansProps {
    plans: SubscriptionPlan[]
    currentPlan : CurrentPlan | null
    page: number
    setPage: (page: number) => void
}

const CANDIDATE_FEATURES = [
  { key: "canAccessPremiumQuestions", label: "Access premium questions", type: "boolean" },
  { key: "hasDetailedFeedback", label: "Detailed feedback", type: "boolean" },
  { key: "maxPracticePerDay", label: (v: number | null) => v ? `${v} practices/day` : "Unlimited practice", type: "limit" },
]


const CandidateSubscriptionPlans: React.FC<CandidatePlansProps>= ({plans, page, currentPlan, setPage}) => {

  const { pagination } = useSelector((state: RootState) => state.subscription)
  const { user } = useSelector((state: RootState) => state.auth)
  const dispatch = useDispatch<AppDispatch>()
  const navigate =useNavigate()

  const getFeaturesByTarget = () => {
    return CANDIDATE_FEATURES
  }
  console.log('candidate current plan: ', currentPlan)

  const handleChangeSubscription = async(planId: string) => {
       try {
        if(!user) return
         const response = await dispatch(changeSubscription({planId, role: user.role })).unwrap()
         if(response.isPaymentRequired){
          navigate(ROUTES.COMMON.PAYMENT)
         }else{
          toast.success('Your subscription plan changed successfully')
         }
       } catch (error) {
        toast.error(typeof error === 'string' ? error : 'Failed to change subscription')
       }
  }
  return (
    <div>
      <Box
        display="grid"
        gridTemplateColumns="repeat(auto-fill, minmax(320px, 2fr))"
        gap={2}
        mt={4}
        px={3}
      >
        {plans.map((p) => (
          <Card
            key={p.id}
            sx={{
              p: 3,
              borderRadius: 4,
              backgroundColor: "#fff",
              border:"1px solid #e0e0e0",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: 360,
              transition: "all 0.3s ease",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              "&:hover": {
                transform: "translateY(-6px)",
                boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
               }
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
                      backgroundColor: p.target === 'candidate' ?  "#6B4705" : '#0B3358',
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
                <button 
                  onClick={ () => handleChangeSubscription(p.id)}
                  disabled={currentPlan?.id === p.id}
                  className={`w-full p-2 border rounded-lg text-white font-bold cursor-pointer ${currentPlan?.id === p.id ? 'border-green-800 bg-green-800 cursor-not-allowed' : 'border-[#0B3861] bg-[#0B3861]'}`}
                >
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

export default CandidateSubscriptionPlans
