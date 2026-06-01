import React, { useEffect } from 'react'
import InternalLayout from '../../layouts/InternalLayout'
import { adminSidebarItems } from '../../../constants/sidebarItems'
import SummeryCard from '../../components/layout/SummeryCard'
import { IndianRupee, TrendingUp, User, Wallet } from 'lucide-react'
import { Box, Grid } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../../redux/store'
import { getRevenueSummery } from '../../../redux/slices/features/analytics/adminAnalysticsSlice'

const AdminRevenue: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>()
    const { revenueSummery } = useSelector((state: RootState) => state.adminAnalytics)


    useEffect(() => {
        dispatch(getRevenueSummery())
    }, [dispatch])

  return (
    <InternalLayout title='Revenue' subTitle='Overview of your platform performance' sidebarItems={adminSidebarItems}>
        <Box>
            <Grid container spacing={3}>
                <Grid size={{xs: 12, md: 3}}>
                   <SummeryCard label='Total Revenue' value={revenueSummery?.totalRevenue ?? 0} icon={IndianRupee} color='#53601d' bg='#000'/>
                </Grid>
                <Grid size={{xs: 12, md: 3}}>
                   <SummeryCard label='Monthly Revenue' value={revenueSummery?.monthlyRevenue ?? 0} icon={TrendingUp} color='black' bg='black'/>
                </Grid>
                <Grid size={{xs: 12, md: 3}}>
                   <SummeryCard label='Active Subscribers' value={revenueSummery?.activeSubscribers ?? 0} icon={User} color='black' bg='white'/>
                </Grid>
                <Grid size={{xs: 12, md: 3}}>
                   <SummeryCard label='Avg Revenue Per User' value={revenueSummery?.averageRevenuePerUser ?? 0} icon={Wallet} color='black' bg='white'/>
                </Grid>
            </Grid>
            <Box>

            </Box>
            <Box>
                
            </Box>
        </Box>
    </InternalLayout>
  )
}

export default AdminRevenue
