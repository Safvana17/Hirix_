import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import type { AppDispatch, RootState } from '../../../redux/store'
import { approveCompany, fetchCompanies, rejectCompany, updateUserStatus } from '../../../redux/slices/features/users/usersSlice'
import InternalLayout from '../../layouts/InternalLayout'
import { adminSidebarItems } from '../../../constants/sidebarItems'
import DataTable from '../../components/ui/DataTable'
import type { Column } from '../../../types/table'
import type { Company } from '../../../types/company'
import { Ban, CheckCircle, Eye, Filter, Search, XCircle } from 'lucide-react'
import { useDebounce } from '../../../hooks/useDebounce'
import ConfirmationModal from '../../components/modal/ConfirmationModal'


const AdminCompanies : React.FC = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    const { companies, loading, pagination } = useSelector((state: RootState) => state.userSlice)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const debouncedSearchTerm = useDebounce(searchTerm, 500)

    const [modalConfig, setModalConfig] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        onConfirm: () => void;
        type: 'danger' | 'warning' | 'info';
    }>({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => { },
        type: 'warning'
    })

    useEffect(() => {
        dispatch(fetchCompanies({search: debouncedSearchTerm, status: statusFilter, page: currentPage, limit: 10}))
    }, [dispatch, debouncedSearchTerm, statusFilter, currentPage])

    const openModal = (config: Omit<typeof modalConfig, 'isOpen'>) => {
        setModalConfig({...config, isOpen: true})
    }

    const closeModal = () => {
        setModalConfig(prev => ({...prev, isOpen: false}))
    }

    const handleSearchChange = useCallback((val: string) => {
        setSearchTerm(val)
        setCurrentPage(1)
    },[])

    const handleStatusChange = useCallback((val: string) => {
        setStatusFilter(val)
        setCurrentPage(1)
    },[])

    const handleUpdateStatus = (id: string, currentStatus: string) => {
        const newStatus = currentStatus === 'active' ? 'blocked' : 'active'
        const actionText = newStatus === 'blocked' ? 'Block' : 'Unblock'

        openModal({
            title: `${actionText} Company`,
            message: `Are you sure you want to ${actionText.toLowerCase()} this company? This will ${newStatus === 'blocked' ? 'prevent them from accessing' : 'restore their access to'} the platform.`,
            type: newStatus === 'blocked' ? 'danger' : 'warning',
            onConfirm: () => {
                dispatch(updateUserStatus({id, status: newStatus, role: 'company'}));
                closeModal();
            }
        })
    }

    const handleApproveCompany = (id: string) => {
        openModal({
            title: `Approve Company`,
            message: `Are you sure you want to approve this company? An email notification will be sent to them.`,
            type: 'info',
            onConfirm: () => {
                dispatch(approveCompany({id, action: 'APPROVE'}));
                closeModal();
            }
        })
    }

    const handleRejectCompany = (id: string) => {

        const reason = prompt('Enter rejection reason: ')
        if(reason === null) return
        openModal({
            title: `Reject Company`,
            message: `Are you sure you want to reject this company? An email notification will be sent to them.`,
            type: 'info',
            onConfirm: () => {
                dispatch(rejectCompany({id, reason, action: 'REJECT'}));
                closeModal();
            }
        })
    }

    const columns: Column<Company>[] = useMemo(() =>[
        {header: 'Company Name', key: 'name', render: (val) => <span className='font-bold text-gray-800'>{val}</span>},
        {header: 'Email Address', key: 'email', render: (val) => <span className='font-bold text-gray-800'>{val}</span>},
        {header: 'Status', key: 'status', render: (val) => (
            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                    val === 'active' ? 'bg-green-50 text-green-600 border-green-100' : 
                    val === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                    val === 'rejected' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                    'bg-red-50 text-red-600 border-red-100'
                }`}>
                {val}
            </span>
        )},
        {header: 'Actions', key: 'id', render:(id, item) => (
            <div>
                <button 
                onClick={() => navigate(`/admin/company/${id}`)}
                title='View Profile'
                className="p-2 hover:bg-amber-50 text-amber-600 rounded-lg transition-colors border border-transparent hover:border-amber-100"
                >
                    <Eye className='w-4 h-4' />
                </button>

                { item.status === 'pending' && (
                    <>
                       <button
                          onClick={() => handleApproveCompany(id)}
                          title='Approve Company'
                          className='p-2 hover:bg-green-50 text-green-600 rounded-lg transition-colors border border-transparent'
                       >
                         <CheckCircle className='w-4 h-4' />
                       </button>

                       <button
                          onClick={() => handleRejectCompany(id)}
                          title='Reject Company'
                          className='p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors border border-transparent'
                       >
                         <XCircle className='w-4 h-4' />
                       </button>
                    </>
                )}

                {(item.status === 'active' || item.status === 'blocked') && (
                    <button
                        onClick={() => handleUpdateStatus(id, item.status)}
                        title={item.status === 'active' ? 'Block Company' : 'Unblock Company'}
                        className={`p-2 rounded-lg transition-colors border border-transparent ${item.status === 'active' 
                            ?'hover:bg-red-50 text-red-600 hover:border-red-100'
                            : 'hover:bg-green-50 text-green-600 hover:border-green-100'
                        }`}
                        >
                        {item.status === 'active' ? <Ban className='w-4 h-4'/> : <CheckCircle className='w-4 h-4' />} 
                    </button>
                )}
            </div>
        )}
    ],[dispatch, navigate, handleUpdateStatus, handleApproveCompany, handleRejectCompany])

    
  return (
    <InternalLayout title='Companies' subTitle='Manage all registered Companies' sidebarItems={adminSidebarItems}>
        <div className="bg-white p-7 rounded-3xl border border-gray-100 shadow-sm">
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
                <option value="active">Active</option>
                <option value="blocked">Blocked</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
                </select>
            </div>
            </div>
        </div>
        </div>
            <DataTable 
               columns={columns}
               isLoading={loading}
               data={companies}
               emptyMessage='No companies found matching your criteria'
               pagination={{
                currentPage,
                totalPages: pagination.users.totalPages,
                onPageChange: (page) => setCurrentPage(page)
               }}
            >
            </DataTable>
            <ConfirmationModal 
               isOpen={modalConfig.isOpen}
               onClose={closeModal}
               onConfirm={modalConfig.onConfirm}
               title={modalConfig.title}
               message={modalConfig.message}
               type={modalConfig.type}
            />
    </InternalLayout>
  )
}

export default AdminCompanies 
