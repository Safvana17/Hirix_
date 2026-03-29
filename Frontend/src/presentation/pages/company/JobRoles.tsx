import React, { useCallback, useState } from 'react'
import InternalLayout from '../../layouts/InternalLayout'
import { companySidebarItems } from '../../../constants/sidebarItems'
import { Filter, Plus, Search } from 'lucide-react'
import JobRoleModal from '../../components/modal/JobRoleModal'
import type { JobRole } from '../../../types/jobRole'
import { createJobRole } from '../../../redux/slices/features/jobRoles/jobRoleSlice'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import type { AppDispatch } from '../../../redux/store'
// import { createJobRole } from '../../../redux/slices/features/jobRoles/jobRoleSlice'
// import { useNavigate } from 'react-router-dom'
// import { useDebounce } from '../../../hooks/useDebounce'
// import ConfirmationModal from '../../components/modal/ConfirmationModal'
// import DataTable from '../../components/ui/DataTable'
// import type { Column } from '../../../types/table'
// import type { JobRole } from '../../../types/jobRole'

const JobRoles: React.FC= () => {

    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
   
    // const [currentPage, setCurrentPage] = useState(1)
    const dispatch = useDispatch<AppDispatch>()
    // const navigate = useNavigate()
    // const { candidates, loading, pagination } = useSelector((state: RootState) => state.userSlice)
    // const {JobRoles, loading, pagination} = useSelector((state: RootState) => state.jobRole)
    // const debouncedSearchTerm = useDebounce(searchTerm, 500)

    const handleCreateJobRole = () => {
         setIsModalOpen(true)
    }
    const handleSearchChange = useCallback((val: string) => {
        setSearchTerm(val)
        // setCurrentPage(1)
    }, [])

    const handleStatusChange = useCallback((val: string) => {
        setStatusFilter(val)
        // setCurrentPage(1)
    },[])

    const handleSaveJobRole = async(data: JobRole) => {
        try {
            await dispatch(createJobRole(data)).unwrap()
            setIsModalOpen(false)
            toast.success('Job Role added successfully')
        } catch (error) {
            if (error instanceof Error) {
            toast.error(error.message);
            } else {
            toast.error('Failed to restore account');
            }
        }
    }

    // const columns: Column<JobRole>[] =  [
    //     {header: 'Name', key: 'name', render: (val) => <span className='font-bold text-gray-800'>{val}</span>},
    //     {header: 'Email Address', key: 'email', render: (val) => <span className='font-bold text-gray-800'>{val}</span>},
    //     {header: 'Status', key: 'status', render: (val) => (
    //         <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${val === 'active' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
    //             {val}
    //         </span>
    //     )},
    //     {header: 'Actions', key: 'id', render:(id, item) => (
    //         <div>
    //             <button
    //               onClick={() => handleUpdateStatus(id, item.status)}
    //               title={item.status === 'active' ? 'Block Candidate' : 'Unblock Candidate'}
    //               className={`p-2 rounded-lg transition-colors border border-transparent ${item.status === 'active' 
    //                  ?'hover:bg-red-50 text-red-600 hover:border-red-100'
    //                  : 'hover:bg-green-50 text-green-600 hover:border-green-100'
    //               }`}
    //             >
    //                {item.status === 'active' ? <Ban className='w-4 h-4'/> : <CheckCircle className='w-4 h-4' />} 
    //             </button>
    //         </div>
    //     )}
    // ]
  return (
    <InternalLayout title='Job Roles' subTitle='Manage your open positions and requirements' sidebarItems={companySidebarItems}>
        <div>
            <div className='flex justify-end mb-5'>
                <button onClick={handleCreateJobRole} className='bg-[#795003] rounded-xl font-bold text-white p-3 flex items-center gap-2'>
                    <Plus className='w-4 h-4' />
                    Add Job Role
                </button>
            </div>
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
                                <option value="active">Active</option>
                                <option value="blocked">Blocked</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            {/* <DataTable 
               columns={columns}
               isLoading={loading}
               data={candidates}
               emptyMessage='No candidates found matching your criteria'
               pagination={{
                currentPage,
                totalPages: pagination.users.totalPages,
                onPageChange: (page) => setCurrentPage(page)
               }}
            >
            </DataTable> */}

            <JobRoleModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveJobRole}
            />
        </div>
    </InternalLayout>
  )
}

export default JobRoles
