import React, { useEffect, useState } from 'react'
import InternalLayout from '../../layouts/InternalLayout'
import { companySidebarItems } from '../../../constants/sidebarItems'
import { Box, FormControl, Grid, InputLabel, MenuItem, Paper, Select } from '@mui/material'
import SummeryCard from '../../components/layout/SummeryCard'
import { BadgeQuestionMark, BookCheckIcon, Sparkles, UserCheck2 } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../../redux/store'
import { getCompanyDashboardSummary, getTestParticipationTrend } from '../../../redux/slices/features/analytics/adminAnalysticsSlice'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const CompanyDashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const [month, setMonth] = useState(6)
  const { companySummery, testActivityTrend} = useSelector((state: RootState) => state.adminAnalytics)

  
  useEffect(() => {
     dispatch(getCompanyDashboardSummary())
     dispatch(getTestParticipationTrend({month}))
  }, [dispatch, month])

  return (
    <InternalLayout title='dashboard' subTitle="Welcome! Here's what's happening with your hiring process." sidebarItems={companySidebarItems}>
        <Box>
            <Grid container spacing={2}>
                <Grid size={{xs: 10, md: 3}}>
                   <SummeryCard label='Total Tests' value={companySummery?.totalTests ?? 0} icon={BookCheckIcon} color='#53601d' bg='#000'/>
                </Grid>
                <Grid size={{xs: 10, md: 3}}>
                   <SummeryCard label='Total Interview' value={companySummery?.totalInterviews ?? 0} icon={BadgeQuestionMark} color='#53601d' bg='#000'/>
                </Grid>
                <Grid size={{xs: 10, md: 3}}>
                   <SummeryCard label='Total Hired Candidates' value={companySummery?.hiredCandidates ?? 0} icon={UserCheck2} color='black' bg='black'/>
                </Grid>
                <Grid size={{xs: 10, md: 3}}>
                   <SummeryCard label='Current plan' value={companySummery?.currentPlan ?? 'Free'} icon={Sparkles} color='black' bg='white'/>
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
               {/* <Grid size={{ xs: 12, md: 6}}>
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
               </Grid> */}
            </Grid>
        </Box>
    </InternalLayout>
  )
}

export default CompanyDashboard