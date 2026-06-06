import React, { useEffect, useState } from 'react'
import InternalLayout from '../../layouts/InternalLayout'
import { companySidebarItems } from '../../../constants/sidebarItems'
import { Box, FormControl, Grid, InputLabel, MenuItem, Pagination, Paper, Select } from '@mui/material'
import SummeryCard from '../../components/layout/SummeryCard'
import { BadgeQuestionMark, BookCheckIcon, Sparkles, UserCheck2 } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../../redux/store'
import { getCandidateStatusDistribution, getCompanyDashboardSummary, getCompanyRecentActivity, getTestParticipationTrend } from '../../../redux/slices/features/analytics/adminAnalysticsSlice'
import { CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const COLORS = [  "#063a67", "#087a65", "#865f0c", "#a43b06", "#53047e",]
const CompanyDashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const [month, setMonth] = useState(6)
  const [activityPeriod, setActivityPeriod] = useState(1)
  const [page, setPage] = useState(1)
  const { companySummary, testActivityTrend, statusDistribution, recentActivity, pagination } = useSelector((state: RootState) => state.adminAnalytics)

  
  useEffect(() => {
     dispatch(getCompanyDashboardSummary())
     dispatch(getTestParticipationTrend({month}))
     dispatch(getCandidateStatusDistribution({month}))
     dispatch(getCompanyRecentActivity({params: {month: activityPeriod, page: page, limit: 7}}))
  }, [dispatch, month, page, activityPeriod])

  return (
    <InternalLayout title='dashboard' subTitle="Welcome! Here's what's happening with your hiring process." sidebarItems={companySidebarItems}>
        <Box>
            <Grid container spacing={2}>
                <Grid size={{xs: 10, md: 3}}>
                   <SummeryCard label='Total Tests' value={companySummary?.totalTests ?? 0} icon={BookCheckIcon} color='#53601d' bg='#000'/>
                </Grid>
                <Grid size={{xs: 10, md: 3}}>
                   <SummeryCard label='Total Interview' value={companySummary?.totalInterviews ?? 0} icon={BadgeQuestionMark} color='#53601d' bg='#000'/>
                </Grid>
                <Grid size={{xs: 10, md: 3}}>
                   <SummeryCard label='Total Hired Candidates' value={companySummary?.hiredCandidates ?? 0} icon={UserCheck2} color='black' bg='black'/>
                </Grid>
                <Grid size={{xs: 10, md: 3}}>
                   <SummeryCard label='Current plan' value={companySummary?.currentPlan ?? 'Free'} icon={Sparkles} color='black' bg='white'/>
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
                        <h3 style={{fontWeight: 800}}>Test Participation Trend</h3>
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
                        <h3 style={{fontWeight: 800}}>Candidate Status Distribution</h3>
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
            <Grid container spacing={3} sx={{ mt: 2 }}>
               <Grid size={{ xs: 12 }}>
                  <Paper
                  sx={{
                     p: 3,
                     borderRadius: 3,
                  }}
                  >
                  <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={3}
                  >
                  <h3 style={{ margin: 0, fontWeight: 800 }}>Recent Activity</h3>

                  <FormControl size="small" sx={{ minWidth: 140 }}>
                     <InputLabel>Period</InputLabel>
                     <Select
                        value={activityPeriod}
                        label="Period"
                        onChange={(e) => {
                        setPage(1)
                        setActivityPeriod(Number(e.target.value))
                        }}
                     >
                        <MenuItem value={1}>Last Month</MenuItem>
                        <MenuItem value={3}>Last 3 Months</MenuItem>
                        <MenuItem value={6}>Last 6 Months</MenuItem>
                        <MenuItem value={12}>Last 12 Months</MenuItem>
                     </Select>
                  </FormControl>
                  </Box>
                  {recentActivity.length === 0 ? (
                     <Box
                        py={6}
                        textAlign="center"
                        color="text.secondary"
                     >
                        No recent activities
                     </Box>
                  ) : (
                     <Box display="flex" flexDirection="column" gap={2}>
                        {recentActivity.map((activity, index) => (
                        <Box
                           key={index}
                           sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              p: 2,
                              borderRadius: 2,
                              bgcolor: '#faf7f2',
                              border: '1px solid #ece7dd',
                              transition: 'all .2s ease',
                              '&:hover': {
                              transform: 'translateY(-2px)',
                              boxShadow: 2,
                              },
                           }}
                        >
                           <Box display="flex" gap={2} alignItems="center">
                              <Box
                              sx={{
                                 width: 10,
                                 height: 10,
                                 borderRadius: '50%',
                                 bgcolor: '#5b3c06',
                                 flexShrink: 0,
                              }}
                              />

                              <Box>
                              <Box
                                 sx={{
                                    fontWeight: 600,
                                    color: '#2c2c2c',
                                 }}
                              >
                                 {activity.title}
                              </Box>

                              <Box
                                 sx={{
                                    fontSize: '0.85rem',
                                    color: 'text.secondary',
                                    mt: 0.5,
                                 }}
                              >
                                 {activity.targetType}
                              </Box>
                              </Box>
                           </Box>

                           <Box
                              sx={{
                              fontSize: '0.85rem',
                              color: '#7a7a7a',
                              whiteSpace: 'nowrap',
                              }}
                           >
                              {formatRelativeTime(activity.date)}
                           </Box>
                        </Box>
                        ))}
                     </Box>
                  )}
                  <Box
                  display="flex"
                  justifyContent="center"
                  mt={3}
                  >
                  <Pagination
                     page={activityPeriod}
                     count={pagination.activity.totalPages}
                     onChange={(_, value) => setActivityPeriod(value)}
                     color="primary"
                  />
                  </Box>
               </Paper>
            </Grid>
         </Grid>
        </Box>
    </InternalLayout>
  )
}

export default CompanyDashboard


const formatRelativeTime = (dateString: string) => {
  const now = new Date().getTime()
  const date = new Date(dateString).getTime()

  const diffInSeconds = Math.floor((now - date) / 1000)

  if (diffInSeconds < 60) {
    return `${diffInSeconds} sec ago`
  }

  const minutes = Math.floor(diffInSeconds / 60)
  if (minutes < 60) {
    return `${minutes} min ago`
  }

  const hours = Math.floor(minutes / 60)
  if (hours < 24) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`
  }

  const days = Math.floor(hours / 24)
  if (days < 7) {
    return `${days} day${days > 1 ? 's' : ''} ago`
  }

  const weeks = Math.floor(days / 7)
  if (weeks < 4) {
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`
  }

  const months = Math.floor(days / 30)
  if (months < 12) {
    return `${months} month${months > 1 ? 's' : ''} ago`
  }

  const years = Math.floor(days / 365)
  return `${years} year${years > 1 ? 's' : ''} ago`
}