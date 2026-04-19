import React, { useEffect, useState } from 'react'
import CandidateHeader from '../../components/layout/CandidateHeader'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../../redux/store'
import { getAllPlans, getCurrentPlan } from '../../../redux/slices/features/subscription/subscriptionSlice'
import CandidateSubscriptionPlans from '../../components/candidate/CandidateSubscriptionPlans'
import { Box, Typography } from '@mui/material'
import CandidateCurrentPlanCard from '../../components/candidate/CandidateCurrentPlanCard'
import { useNavigate } from 'react-router-dom'
import { ArrowLeftIcon } from 'lucide-react'

const CandidateSubscription: React.FC= () => {
  const [page, setPage] = useState(1)
  const {plans, currentPlan } = useSelector((state: RootState) => state.subscription)
  const { user } = useSelector((state: RootState) => state.auth)
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  useEffect(() => {
    if(user){
      dispatch(getAllPlans({params: {target: 'candidate', page, limit: 6}, role: user.role }))
      dispatch(getCurrentPlan({role: user.role}))
    }
  }, [dispatch, page, user])
  console.log('current plan: ', currentPlan)

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#021A30] to-[#0B0707]">
      <CandidateHeader />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">      
        <button
          onClick={() => navigate('/candidate/dashboard')}
          className="flex items-center gap-2 text-white/80 hover:text-white transition mb-4"
        >
          <ArrowLeftIcon size={18} />
          Back to Dashboard
        </button>

        <div className="space-y-6">
          <CandidateCurrentPlanCard currentPlan={currentPlan} />

          {plans.length > 0 ? (
            <CandidateSubscriptionPlans
              plans={plans}
              page={page}
              currentPlan={currentPlan}
              setPage={setPage}
            />
          ) : (
            <Box display="flex" justifyContent="center" py={10}>
              <Typography variant="h6" color="white">
                No subscription plans available
              </Typography>
            </Box>
          )}
        </div>
      </div>
    </div>
  )
}

export default CandidateSubscription
