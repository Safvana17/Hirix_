import React, { useEffect, useState } from 'react'
import InternalLayout from '../../layouts/InternalLayout'
import { companySidebarItems } from '../../../constants/sidebarItems'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../../redux/store'
import { Box, Typography } from '@mui/material'
import { getAllPlans, getCurrentPlan } from '../../../redux/slices/features/subscription/subscriptionSlice'
import CurrentPlanCard from '../../components/company/CurrentPlanCard'
import CompanyPlans from '../../components/company/CompanyPlans'


const CompanySubscription: React.FC= () => {

  const [page, setPage] = useState(1)
  const { user } = useSelector((state: RootState) => state.auth)
  const {plans, currentPlan} = useSelector((state: RootState) => state.subscription)
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    if(user){
      dispatch(getAllPlans({target: 'company', page, limit: 6 }))
      dispatch(getCurrentPlan())
    }
  }, [user, page, dispatch])
  
  return (
    <InternalLayout title='Subscription' subTitle='Manage you subscriptions and billings' sidebarItems={companySidebarItems}>
        <div>
          <CurrentPlanCard currentPlan={currentPlan} />
          {plans.length > 0 ? (
            <CompanyPlans plans={plans} currentPlan={currentPlan} page={page} setPage={setPage}/>
          ) : (
            <Box display='flex' justifyContent='center' py={10}>
              <Typography variant='h6'>
                No subscription plans available
              </Typography>
            </Box>
          )}
        </div>

    </InternalLayout>
  )
}

export default CompanySubscription
