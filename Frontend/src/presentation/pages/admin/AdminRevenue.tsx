import React, { useEffect, useState } from 'react'
import InternalLayout from '../../layouts/InternalLayout'
import { adminSidebarItems } from '../../../constants/sidebarItems'
import SummeryCard from '../../components/layout/SummeryCard'
import { IndianRupee, TrendingUp, User, Wallet } from 'lucide-react'
import { Box, FormControl, Grid, InputLabel, MenuItem, Paper, Select } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../../redux/store'
import { getPaymentHistory, getRevenueSummary, getRevenueTrendByMonth, getRevenueTrendByPlan } from '../../../redux/slices/features/analytics/adminAnalysticsSlice'
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { TargetType } from '../../../types/subscription'
import type { Column } from '../../../types/table'
import type { PaymentHistory } from '../../../types/analytics'
import DataTable from '../../components/ui/DataTable'


const AdminRevenue: React.FC = () => {
    const [type, setType] = useState<TargetType | null>(null)
    const [month, setMonth] = useState(6)
    const [page, setPage] = useState(1)
    const dispatch = useDispatch<AppDispatch>()
    const { revenueSummary, loading, monthlyRevenueTrend, planRevenueTrend, paymentHistory, pagination } = useSelector((state: RootState) => state.adminAnalytics)


    useEffect(() => {
        dispatch(getRevenueSummary())
        dispatch(getRevenueTrendByMonth({month}))
        dispatch(getRevenueTrendByPlan({type: type || undefined}))
        dispatch(getPaymentHistory({params: {page, limit: 10}}))
    }, [dispatch, type, month, page])

    const barChartData = planRevenueTrend.map((data) => ({
      ...data,
      label: `${data.plan} (${data.type})`
    }))

    const columns: Column<PaymentHistory>[] =  [
      {header: 'Type', key: 'target', render: (val) => <span className='font-bold text-gray-800'>{val}</span>},
      {header: 'Name', key: 'name', render: (val) => <span className='font-bold text-gray-800'>{val}</span>},
      {header: 'Plan', key: 'plan', render: (val) => <span className='font-bold text-gray-800'>{val}</span>},
      {header: 'Date', key: 'date', render: (val) => <span className='font-bold text-gray-800'>{val}</span>},
      {header: 'Amount', key: 'amount', render: (val) => <span className='font-bold text-gray-800'>{val}</span>},
      {header: 'Status', key: 'status', render: (val) => (
         <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${val === 'success' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
            {val}
         </span>
      )},
    ]

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
            <Grid container spacing={3} sx={{ mt: 2}}>
               <Grid size={{ xs: 12, md: 6}}>
                  <Paper sx={{ p: 2 }}>
                     <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        mb={2}
                     >
                        <h3 style={{ fontWeight: 800}}>Revenue Trend</h3>
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
                        <h3 style={{ fontWeight: 800}}>Revenue by Plan</h3>
                        <FormControl size="small" sx={{ minWidth: 120 }}>
                           <InputLabel>Type</InputLabel>
                           <Select
                              value={type}
                              label="Period"
                              onChange={(e) => setType(e.target.value as TargetType)}
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
                              dataKey="revenue"
                              fill='#5b3c06'  
                              radius={[3, 3, 0, 0]}                   
                           />
                        </BarChart>
                     </ResponsiveContainer>
                  </Paper>
               </Grid>
            </Grid>
        </Box>
            <DataTable
               columns={columns}
               isLoading={loading}
               data={paymentHistory}
               emptyMessage='No payment history available'
               pagination={{
                currentPage: page ,
                totalPages: pagination.payment.totalPages,
                totalCount: pagination.payment.totalCount,
                onPageChange: (page) => setPage(page)
               }}
            >
            </DataTable>
    </InternalLayout>
  )
}

export default AdminRevenue
