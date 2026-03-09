import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../../redux/store'
import InternalLayout from '../../layouts/InternalLayout'
import { adminSidebarItems } from '../../../constants/sidebarItems'
import DataTable from '../../components/ui/DataTable'
import type { Column } from '../../../types/table'
import { Ban, CheckCircle, Search, Filter } from 'lucide-react'
import { fetchCandidates, updateUserStatus } from '../../../redux/slices/features/users/usersSlice'
import type { Candidate } from '../../../types/candidate'
import { useDebounce } from '../../../hooks/useDebounce'

const AdminCandidates : React.FC = () => {

    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const dispatch = useDispatch<AppDispatch>()
    const { candidates, loading, pagination } = useSelector((state: RootState) => state.userSlice)
    const debouncedSearchTerm = useDebounce(searchTerm, 500)

    useEffect(() => {
        dispatch(fetchCandidates({search: debouncedSearchTerm, status: statusFilter, page: currentPage, limit: 4}))
    }, [dispatch, debouncedSearchTerm, statusFilter, currentPage])

    const handleSearchChange = useCallback((val: string) => {
        setSearchTerm(val)
        setCurrentPage(1)
    }, [])

    const handleStatusChange = useCallback((val: string) => {
        setStatusFilter(val)
        setCurrentPage(1)
    },[])

const columns: Column<Candidate>[] =  [
    {header: 'Name', key: 'name', render: (val) => <span className='font-bold text-gray-800'>{val}</span>},
    {header: 'Email Address', key: 'email', render: (val) => <span className='font-bold text-gray-800'>{val}</span>},
    {header: 'Status', key: 'status', render: (val) => (
        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${val === 'Active' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
            {val}
        </span>
    )},
    {header: 'Actions', key: 'id', render:(id, item) => (
        <div>
              {item.status === 'Active' ? (
                    <button
                        onClick={() => dispatch(updateUserStatus({
                            id,
                            status: 'Blocked',
                            role: 'candidate',
                            
                        }))}
                        title='Block candidate'
                        role='candidate'
                        className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors border border-transparent hover:border-red-100"
                    >
                        <Ban className='w-4 h-4' />
                    </button>
                ) : (
                    <button
                        onClick={() => dispatch(updateUserStatus({
                            id,
                            status: 'Active',
                            role: 'candidate',
                        }))}
                        title='Unblock candidate'
                        role='candidate'
                        className="p-2 hover:bg-green-50 text-green-600 rounded-lg transition-colors border border-transparent hover:border-green-100"
                    >
                        <CheckCircle className="w-4 h-4" />
                    </button>
                )}
        </div>
    )}
]

  return (
    <InternalLayout title='Users' subTitle='Manage platform users' sidebarItems={adminSidebarItems}>
        <div>
        <div className="bg-white p-7 rounded-3xl border border-gray-100 shadow-sm mb-3">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            
            {/* Search Box */}
            <div className="relative w-full md:w-2/3 lg:w-1/2 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white" />
            <input
                type="text"
                placeholder="Search companies by name or email..."
                className="w-full pl-12 pr-4 py-3.5 bg-[#9A6605] text-white border border-transparent rounded-2xl outline-none text-md transition-all focus:ring-2 focus:ring-[#9A6605] focus:ring-opacity-50"
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
            />
            </div>

            {/* Filter Dropdown */}
            <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-48">
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9A6605]" />
                <select
                className="w-full pl-10 pr-4 py-3.5 bg-white text-[#9A6605] border border-[#9A6605] rounded-2xl outline-none text-md transition-all appearance-none cursor-pointer "
                value={statusFilter}
                onChange={(e) => handleStatusChange(e.target.value)}
                >
                <option value="">All Status</option>
                <option value="Active">Active</option>
                <option value="Blocked">Blocked</option>
                </select>
            </div>
            </div>
        </div>
        </div>
            <DataTable 
               columns={columns}
               isLoading={loading}
               data={candidates}
               emptyMessage='No companies found matching your criteria'
               pagination={{
                currentPage,
                totalPages: pagination.companies.totalPages,
                onPageChange: (page) => setCurrentPage(page)
               }}
            >
            </DataTable>
        </div>
    </InternalLayout>
  )
}

export default AdminCandidates
