import React, { useEffect } from 'react'
import InternalLayout from '../../layouts/InternalLayout'
import { adminSidebarItems } from '../../../constants/sidebarItems'
import SummeryCard from '../../components/layout/SummeryCard'
import { IndianRupee, TrendingUp, User, Wallet } from 'lucide-react'
import { Box, Grid } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../../redux/store'
import { getRevenueSummary, getRevenueTrendByMonth } from '../../../redux/slices/features/analytics/adminAnalysticsSlice'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'


const AdminRevenue: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>()
    const { revenueSummary, monthlyRevenueTrend } = useSelector((state: RootState) => state.adminAnalytics)


    useEffect(() => {
        dispatch(getRevenueSummary())
        dispatch(getRevenueTrendByMonth({month: 6}))
    }, [dispatch])

  return (
    <InternalLayout title='Revenue' subTitle='Overview of your platform performance' sidebarItems={adminSidebarItems}>
        <Box>
            <Grid container spacing={3}>
                <Grid size={{xs: 12, md: 3}}>
                   <SummeryCard label='Total Revenue' value={revenueSummary?.totalRevenue ?? 0} icon={IndianRupee} color='#53601d' bg='#000'/>
                </Grid>
                <Grid size={{xs: 12, md: 3}}>
                   <SummeryCard label='Monthly Revenue' value={revenueSummary?.monthlyRevenue ?? 0} icon={TrendingUp} color='black' bg='black'/>
                </Grid>
                <Grid size={{xs: 12, md: 3}}>
                   <SummeryCard label='Active Subscribers' value={revenueSummary?.activeSubscribers ?? 0} icon={User} color='black' bg='white'/>
                </Grid>
                <Grid size={{xs: 12, md: 3}}>
                   <SummeryCard label='Avg Revenue Per User' value={revenueSummary?.averageRevenuePerUser ?? 0} icon={Wallet} color='black' bg='white'/>
                </Grid>
            </Grid>
            <Box>
               <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={monthlyRevenueTrend}>
                     <CartesianGrid strokeDasharray="3 3" />
                     <XAxis dataKey="month" />
                     <YAxis />
                     <Tooltip />
                     <Line 
                        type="monotone"
                        dataKey="revenue"
                        stroke='#5b3c06'                     
                     />
                  </LineChart>
               </ResponsiveContainer>
            </Box>
            <Box>
                
            </Box>
        </Box>
    </InternalLayout>
  )
}

export default AdminRevenue
