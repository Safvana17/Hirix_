import React, { useEffect, useState } from 'react'
import InternalLayout from '../../layouts/InternalLayout'
import { companySidebarItems } from '../../../constants/sidebarItems'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../../redux/store'
import { Box, Typography } from '@mui/material'
import { getAllPlans, getBillingHistory, getCurrentPlan, getInvoice } from '../../../redux/slices/features/subscription/subscriptionSlice'
import CurrentPlanCard from '../../components/company/CurrentPlanCard'
import CompanyPlans from '../../components/company/CompanyPlans'
import DataTableMui from '../../components/ui/DataTableMui'
import type { Payment } from '../../../types/subscription'
import type { Column } from '../../../types/table'
import toast from 'react-hot-toast'


const CompanySubscription: React.FC= () => {

  const [page, setPage] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const { user } = useSelector((state: RootState) => state.auth)
  const {plans, loading, currentPlan,pagination, payments} = useSelector((state: RootState) => state.subscription)
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    if(user){
      dispatch(getAllPlans({params:{target: 'company', page, limit: 6}, role: user.role }))
      dispatch(getCurrentPlan({role: user.role}))
      dispatch(getBillingHistory({page: currentPage, limit: pageSize}))
    }
  }, [user, page, dispatch,currentPage, pageSize])

  const handleDownloadInvoice = async(paymentId: string) => {
    try {
      const blob = await dispatch(getInvoice({id: paymentId})).unwrap()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `invoice-${paymentId}.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      toast.error(typeof error === 'string' ? error : 'Failed to download invoice')
    }
  }

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
  {header: 'Invoice', key: 'invoiceUrl', render: (_, row) => (
    <button
      onClick={() => handleDownloadInvoice(row.id)}
      className='px-3 py-1 bg-[#6B4705] text-white rounded-md text-sm'
    >
      Download
    </button>
  )}

];
  
 
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

    </InternalLayout>
  )
}

export default CompanySubscription
