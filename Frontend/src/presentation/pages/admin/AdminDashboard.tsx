import React, { useEffect, useState } from 'react'
import { adminSidebarItems } from '../../../constants/sidebarItems'
import InternalLayout from '../../layouts/InternalLayout'
import { Box, FormControl, Grid, InputLabel, MenuItem, Paper, Select } from '@mui/material'
import SummeryCard from '../../components/layout/SummeryCard'
import { BookCheck, Building2Icon, DollarSign, FileQuestionIcon, User2 } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { getAdminDashboardSummary, getSubscriptionDistribution, getTestActivty } from '../../../redux/slices/features/analytics/adminAnalysticsSlice'
import type { AppDispatch, RootState } from '../../../redux/store'
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { TargetType } from '../../../types/subscription'


const AdminDashboard: React.FC= () => {
  const [month, setMonth] = useState(6)
  const [target, setTarget] = useState<TargetType|null>(null)
  const dispatch = useDispatch<AppDispatch>()
  const { adminSummary, testActivityTrend, subscriptionDistribution } = useSelector((state: RootState) => state.adminAnalytics)

  useEffect(() => {
      dispatch(getAdminDashboardSummary())
      dispatch(getTestActivty({month}))
      dispatch(getSubscriptionDistribution({type: target || undefined}))
  }, [dispatch, month, target])

    const barChartData = subscriptionDistribution.map((data) => ({
      ...data,
      label: `${data.plan} (${data.type})`
    }))
  return (
     <InternalLayout title="Dashboard" subTitle='Overview of your platform performance' sidebarItems={adminSidebarItems}>
        <Box>
            <Grid container spacing={2}>
                <Grid size={{xs: 10, md: 3}}>
                   <SummeryCard label='Total Companies' value={adminSummary?.totalCompanies ?? 0} icon={Building2Icon} color='#53601d' bg='#000'/>
                </Grid>
                <Grid size={{xs: 10, md: 3}}>
                   <SummeryCard label='Total Candidates' value={adminSummary?.totalCandidates ?? 0} icon={User2} color='#53601d' bg='#000'/>
                </Grid>
                <Grid size={{xs: 10, md: 3}}>
                   <SummeryCard label='Total Tests' value={adminSummary?.totalTests ?? 0} icon={BookCheck} color='black' bg='black'/>
                </Grid>
                <Grid size={{xs: 10, md: 3}}>
                   <SummeryCard label='Total Questions' value={adminSummary?.totalQuestions ?? 0} icon={FileQuestionIcon} color='black' bg='white'/>
                </Grid>
                <Grid size={{xs: 10, md: 3}}>
                   <SummeryCard label='Total Revenue' value={adminSummary?.totalRevenue ?? 0} icon={DollarSign} color='black' bg='white'/>
                </Grid>
            </Grid>
            <Grid container spacing={3} sx={{ mt: 2}}>
               <Grid size={{ xs: 12, md: 6}}>
                  <Paper sx={{ p: 2 }}>
                     <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        mb={2}
                     >
                        <h3>Revenue Trend</h3>
                        <FormControl size="small" sx={{ minWidth: 120 }}>
                           <InputLabel>Period</InputLabel>
                           <Select
                              value={month}
                              label="Period"
                              onChange={(e) => setMonth(Number(e.target.value))}
                           >
                              <MenuItem value={3}>3 Months</MenuItem>
                              <MenuItem value={6}>6 Months</MenuItem>
                              <MenuItem value={12}>12 Months</MenuItem>
                           </Select>
                        </FormControl>
                     </Box>
                     <ResponsiveContainer width="100%" height={350}>
                        <LineChart data={testActivityTrend}>
                           <CartesianGrid strokeDasharray="3 3" />
                           <XAxis dataKey="month" />
                           <YAxis />
                           <Tooltip />
                           <Line 
                              type="monotone"
                              dataKey="attendedCandidates"
                              stroke='#5b3c06'                     
                           />
                           <Line 
                              type="monotone"
                              dataKey="notAttendedCandidates"
                              stroke='#5b3c06'                     
                           />
                           <Line 
                              type="monotone"
                              dataKey="testCount"
                              stroke='#5b3c06'                     
                           />
                        </LineChart>
                     </ResponsiveContainer>
                  </Paper>
               </Grid>
               <Grid size={{ xs: 12, md: 6}}>
                  <Paper sx={{ p: 2 }}>
                     <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        mb={2}
                     >
                        <h3>Revenue by Plan</h3>
                        <FormControl size="small" sx={{ minWidth: 120 }}>
                           <InputLabel>Type</InputLabel>
                           <Select
                              value={target}
                              label="Period"
                              onChange={(e) => setTarget(e.target.value as TargetType)}
                           >
                              <MenuItem value=''>All</MenuItem>
                              <MenuItem value='candidate'>Candidate</MenuItem>
                              <MenuItem value='company'>Company</MenuItem>
                           </Select>
                        </FormControl>
                     </Box>
                     <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={barChartData}>
                           <CartesianGrid strokeDasharray="2 2" />
                           <XAxis dataKey="label" />
                           <YAxis />
                           <Tooltip />
                           <Bar
                              dataKey="count"
                              fill='#5b3c06'  
                              radius={[3, 3, 0, 0]}                   
                           />
                        </BarChart>
                     </ResponsiveContainer>
                  </Paper>
               </Grid>
            </Grid>
        </Box>
     </InternalLayout>
  )
}

export default AdminDashboard
