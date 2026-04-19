import React, { useEffect, useState } from 'react'
import CandidateHeader from '../../components/layout/CandidateHeader'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../../redux/store'
import { getAllPlans, getBillingHistory, getCurrentPlan } from '../../../redux/slices/features/subscription/subscriptionSlice'
import CandidateSubscriptionPlans from '../../components/candidate/CandidateSubscriptionPlans'
import { Box, Typography } from '@mui/material'
import CandidateCurrentPlanCard from '../../components/candidate/CandidateCurrentPlanCard'
import { useNavigate } from 'react-router-dom'
import { ArrowLeftIcon } from 'lucide-react'
import type { Column } from '../../../types/table'
import type { Payment } from '../../../types/subscription'
import DataTableMui from '../../components/ui/DataTableMui'

const CandidateSubscription: React.FC= () => {
  const [page, setPage] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const {plans, currentPlan, pagination, payments, loading } = useSelector((state: RootState) => state.subscription)
  const { user } = useSelector((state: RootState) => state.auth)
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  useEffect(() => {
    if(user){
      dispatch(getAllPlans({params: {target: 'candidate', page, limit: 6}, role: user.role }))
      dispatch(getCurrentPlan({role: user.role}))
      dispatch(getBillingHistory({data: {page: currentPage, limit: pageSize}, role: user.role}))
    }
  }, [dispatch, page, user, currentPage, pageSize])
  console.log('current plan: ', currentPlan)

  const columns: Column<Payment>[] = [
    { header: 'Description', key: 'description', render: (val) => <span>{val as string}</span>,},
    {
      header: 'Amount',
      key: 'amount',
      render: (val, row) => (
        <span className="font-bold">
          {row.currency} {val as number}
        </span>
      ),
    },
    {
      header: 'Status',
      key: 'status',
      render: (val) => (
        <span className={val === 'success' ? 'text-green-600' : 'text-red-600'}>
          {val as string}
        </span>
      ),
    },
    {
      header: 'Date',
      key: 'paymentDate',
      render: (val) => new Date(val).toLocaleString(),
    },
    {header: 'Order ID',key: 'orderId',render: (val) => ( <span>{val.toString().slice(0,6)}...{val.toString().slice(-4)}</span>)},
    // {header: 'Invoice', key: 'invoiceUrl', render: (_, row) => (
    //   <button
    //     // onClick={() => handleDownloadInvoice(row.id)}
    //     className='px-3 py-1 bg-[#6B4705] text-white rounded-md text-sm'
    //   >
    //     Download
    //   </button>
    // )}

  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#021A30] to-[#0B0707]">
      <CandidateHeader />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">      
        <button
          onClick={() => navigate('/candidate/dashboard')}
          className="flex items-center gap-2 text-white/80 hover:text-white transition mb-4"
        >
          <ArrowLeftIcon size={18} />
          Back to Dashboard
        </button>

        <div className="space-y-6">
          <CandidateCurrentPlanCard currentPlan={currentPlan} />

          {plans.length > 0 ? (
            <CandidateSubscriptionPlans
              plans={plans}
              page={page}
              currentPlan={currentPlan}
              setPage={setPage}
            />
          ) : (
            <Box display="flex" justifyContent="center" py={10}>
              <Typography variant="h6" color="white">
                No subscription plans available
              </Typography>
            </Box>
          )}
          <div className='bg-white rounded-lg p-4'>
            <h1 className='font-bold mb-5'>Billing History</h1>
            <DataTableMui
              columns={columns}
              isLoading={loading}
              data={payments}
              pagination={{
                currentPage,
                totalPages: pagination.payment.totalPages,
                totalCount: pagination.payment.totalCount,
                onPageChange: (page) => setCurrentPage(page),
                pageSize,
                onPageSizeChange: setPageSize
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CandidateSubscription
