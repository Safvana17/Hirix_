import React, { useEffect, useState } from 'react'
import InternalLayout from '../../layouts/InternalLayout'
import { adminSidebarItems } from '../../../constants/sidebarItems'
import type { Column } from '../../../types/table'
import type { TestLog } from '../../../types/analytics'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../../redux/store'
import { getCandidateParticipationTrend, getCompanyUsage, getTestLog } from '../../../redux/slices/features/analytics/adminAnalysticsSlice'
import DataTable from '../../components/ui/DataTable'
import { Box, FormControl, Grid, InputLabel, MenuItem, Paper, Select } from '@mui/material'
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'


const AdminReport: React.FC = () => {
   const [page, setPage] = useState(1)
   const [month, setMonth] = useState(6)
   const dispatch = useDispatch<AppDispatch>()
   const { testLog, loading, pagination, candidateParticipation, companyUsage } = useSelector((state: RootState) => state.adminAnalytics)

   useEffect(() => {
      dispatch(getTestLog({params: {page: page, limit: 5}}))
      dispatch(getCandidateParticipationTrend({month}))
      dispatch(getCompanyUsage())
   }, [dispatch, page, month])

    const columns: Column<TestLog>[] =  [
      {header: 'Company', key: 'company', render: (val) => <span className='font-bold text-gray-800'>{val}</span>},
      {header: 'Test Name', key: 'testName', render: (val) => <span className='font-bold text-gray-800'>{val}</span>},
      {header: 'Total Candidates', key: 'candidates', render: (val) => <span className='font-bold text-gray-800'>{val}</span>},
      {header: 'Average score', key: 'averageScore', render: (val) => <span className='font-bold text-gray-800'>{val}</span>},
      {header: 'Pass Rate', key: 'passRate', render: (val) => <span className='font-bold text-gray-800'>{val}</span>},
      {header: 'Date', key: 'date', render: (val) => <span className='font-bold text-gray-800'>{val}</span>},
    ]
  return (
     <InternalLayout title='Report' subTitle='Comprehensive platform insights and data exports' sidebarItems={adminSidebarItems}>
      <Grid size={{ xs: 12, md: 6}}>
         <Paper sx={{ p: 2 }}>
            <Box
               display="flex"
               justifyContent="space-between"
               alignItems="center"
               mb={2}
            >
            <h3 style={{ fontWeight: 800}}>Candidate Participation Trend</h3>
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
               <LineChart data={candidateParticipation}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                     type="monotone"
                     dataKey="passedCount"
                     stroke='#493a07'                     
                  />
                  <Line 
                     type="monotone"
                     dataKey="rejectedCount"
                     stroke='#20024a'                     
                  />
                  <Line 
                     type="monotone"
                     dataKey="totalCandidates"
                     stroke='#01560a'                     
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
               <h3 style={{ fontWeight: 800}}>Company Usage Distribution</h3>
               </Box>
                  <ResponsiveContainer width="100%" height={350}>
                     <BarChart data={companyUsage}>
                        <CartesianGrid strokeDasharray="2 2" />
                        <XAxis dataKey="company" />
                        <YAxis />
                        <Tooltip />
                        <Bar 
                           dataKey="totalTests"
                           fill='#5a0d33'  
                           radius={[3, 3, 0, 0]}                   
                        />
                        <Bar 
                           dataKey="totalInterviews"
                           fill='#31065b'                                
                           radius={[3, 3, 0, 0]}                   
                        />
                     </BarChart>
                  </ResponsiveContainer>
               </Paper>
            </Grid>
            <DataTable
               columns={columns}
               isLoading={loading}
               data={testLog}
               emptyMessage='No test log available'
               pagination={{
                currentPage: page ,
                totalPages: pagination.test.totalPages,
                totalCount: pagination.test.totalCount,
                onPageChange: (page) => setPage(page)
               }}
            >
            </DataTable>
     </InternalLayout>
  )
}

export default AdminReport
