import React, { useEffect, useState } from 'react'
import CandidateHeader from '../../components/layout/CandidateHeader'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../../redux/store'
import { getAllPlans, getCurrentPlan } from '../../../redux/slices/features/subscription/subscriptionSlice'
import CandidateSubscriptionPlans from '../../components/candidate/CandidateSubscriptionPlans'
import { Box, Typography } from '@mui/material'
import CandidateCurrentPlanCard from '../../components/candidate/CandidateCurrentPlanCard'

const CandidateSubscription: React.FC= () => {
  const [page, setPage] = useState(1)
  const {plans, currentPlan } = useSelector((state: RootState) => state.subscription)
  const { user } = useSelector((state: RootState) => state.auth)
  const dispatch = useDispatch<AppDispatch>()

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
      <div className='mt-5 mx-5'>
        <CandidateCurrentPlanCard currentPlan={currentPlan} />
          {plans.length > 0 ? (
            <CandidateSubscriptionPlans plans={plans} page={page} currentPlan={currentPlan} setPage={setPage}/>
          ) : (
            <Box display='flex' justifyContent='center' py={10}>
              <Typography variant='h6'>
                No subscription plans available
              </Typography>
            </Box>
          )}
      </div>
    </div>
  )
}

export default CandidateSubscription
