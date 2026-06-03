import React, { useEffect, useState } from 'react'
import InternalLayout from '../../layouts/InternalLayout'
import { companySidebarItems } from '../../../constants/sidebarItems'
import { Box, FormControl, Grid, InputLabel, MenuItem, Paper, Select } from '@mui/material'
import SummeryCard from '../../components/layout/SummeryCard'
import { BadgeQuestionMark, BookCheckIcon, Sparkles, UserCheck2 } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../../redux/store'
import { getCandidateStatusDistribution, getCompanyDashboardSummary, getTestParticipationTrend } from '../../../redux/slices/features/analytics/adminAnalysticsSlice'
import { CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const COLORS = [  "#063a67", "#087a65", "#865f0c", "#a43b06", "#53047e",]
const CompanyDashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const [month, setMonth] = useState(6)
  const { companySummery, testActivityTrend, statusDistribution } = useSelector((state: RootState) => state.adminAnalytics)

  
  useEffect(() => {
     dispatch(getCompanyDashboardSummary())
     dispatch(getTestParticipationTrend({month}))
     dispatch(getCandidateStatusDistribution({month}))
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
                        <PieChart>
                           <Pie 
                              data={statusDistribution}
                              dataKey="count"
                              nameKey="status"
                              cx="50%"
                              cy="50%"
                              outerRadius={100}
                              label={(props) => {
                                const { name, percent } = props
                                return `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                              }}
                           >
                              {statusDistribution.map((_, index) => (
                                 <Cell key={index} fill={COLORS[index % COLORS.length]} />
                              ))}
                           </Pie>
                           <Tooltip formatter={(value, name) => [value, name]} />
                           <Legend />
                        </PieChart>
                     </ResponsiveContainer>
                  </Paper>
               </Grid>
            </Grid>
        </Box>
    </InternalLayout>
  )
}

export default CompanyDashboard