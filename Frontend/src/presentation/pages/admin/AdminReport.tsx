import React, { useEffect, useState } from 'react'
import InternalLayout from '../../layouts/InternalLayout'
import { adminSidebarItems } from '../../../constants/sidebarItems'
import type { Column } from '../../../types/table'
import type { TestLog } from '../../../types/analytics'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../../redux/store'
import { getTestLog } from '../../../redux/slices/features/analytics/adminAnalysticsSlice'
import DataTable from '../../components/ui/DataTable'

const AdminReport: React.FC = () => {
   const [page, setPage] = useState(1)
   const dispatch = useDispatch<AppDispatch>()
   const { testLog, loading, pagination } = useSelector((state: RootState) => state.adminAnalytics)

   useEffect(() => {
      dispatch(getTestLog({params: {page: page, limit: 5}}))
   }, [dispatch, page])

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
