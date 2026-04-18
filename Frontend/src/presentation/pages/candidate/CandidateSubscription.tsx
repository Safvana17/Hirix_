import React, { useEffect, useState } from 'react'
import CandidateHeader from '../../components/layout/CandidateHeader'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../../redux/store'
import { getAllPlans } from '../../../redux/slices/features/subscription/subscriptionSlice'
import CandidateSubscriptionPlans from '../../components/candidate/CandidateSubscriptionPlans'
import { Box, Typography } from '@mui/material'

const CandidateSubscription: React.FC= () => {
  const [page, setPage] = useState(1)
  const {plans } = useSelector((state: RootState) => state.subscription)
  const { user } = useSelector((state: RootState) => state.auth)
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    if(user){
      dispatch(getAllPlans({params: {target: 'candidate', page, limit: 6}, role: user.role }))
    }
  }, [dispatch, page, user])

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#021A30] to-[#0B0707]">
      <CandidateHeader />
          {plans.length > 0 ? (
            <CandidateSubscriptionPlans plans={plans} page={page} setPage={setPage}/>
          ) : (
            <Box display='flex' justifyContent='center' py={10}>
              <Typography variant='h6'>
                No subscription plans available
              </Typography>
            </Box>
          )}
    </div>
  )
}

export default CandidateSubscription
