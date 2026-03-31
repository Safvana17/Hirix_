import React, { useCallback, useEffect, useState,  } from 'react'
import InternalLayout from '../../layouts/InternalLayout'
import { companySidebarItems } from '../../../constants/sidebarItems'
import { Ban, CheckCircle, Edit2, Eye, Filter, LucideDelete, Plus, Search } from 'lucide-react'
import JobRoleModal from '../../components/modal/JobRoleModal'
import type { JobRole, ModalMode } from '../../../types/jobRole'
import { createJobRole, getAllJobRoles } from '../../../redux/slices/features/jobRoles/jobRoleSlice'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../../redux/store'
import { useDebounce } from '../../../hooks/useDebounce'
// import ConfirmationModal from '../../components/modal/ConfirmationModal'
import DataTable from '../../components/ui/DataTable'
import type { Column } from '../../../types/table'


const JobRoles: React.FC= () => {

    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalMode, setModalMode] = useState<ModalMode>('create')
    const [selectedJobRole, setSelectedJobRole] = useState<JobRole | null>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const dispatch = useDispatch<AppDispatch>()
    const { loading, pagination, jobRoles} = useSelector((state: RootState) => state.jobRole)
    const debouncedSearchTerm = useDebounce(searchTerm, 500)

    useEffect(() => {
        dispatch(getAllJobRoles({search: debouncedSearchTerm, status: statusFilter, page: currentPage, limit: 10}))
    }, [dispatch, debouncedSearchTerm, statusFilter, currentPage])

    const handleCreateJobRole = () => {
        setModalMode('create')
        setSelectedJobRole(null)
        setIsModalOpen(true)
    }

    const handleViewJobRole = (item: JobRole) => {
        setModalMode('view')
        setSelectedJobRole(item)
        setIsModalOpen(true)
    }
    const handleSearchChange = useCallback((val: string) => {
        setSearchTerm(val)
        setCurrentPage(1)
    }, [])

    const handleStatusChange = useCallback((val: string) => {
        setStatusFilter(val)
        setCurrentPage(1)
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

    const handleUpdateStatus = async(id: string, status: string) => {
         toast.success(`change status, ${id}, ${status}`)
    }

    const columns: Column<JobRole>[] =  [
        {header: 'Name', key: 'name', render: (val) => <span className='font-bold text-gray-600'>{val}</span>},
        {header: 'Skills', key: 'skills', render: (val) => <span className='font-bold text-gray-600'>{Array.isArray(val)?val.join(', '): '-' }</span>},
        {header: 'Experience', key: 'experienceMin', render: (_, item) => (
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border bg-[#E9C788] text-white">
              {item.experienceMin} - {item.experienceMax} yrs
            </span>
           )
        },
        {header: 'Openings', key: 'openings', render: (val) => <span className='font-bold text-gray-800'>{val}</span>},
        {header: 'Status', key: 'status', render: (val) => <span className={`${val === 'Active' ? 'font-bold text-green-800' : 'font-bold text-red-800'}`}>{val}</span>},
        {header: 'Actions', key: 'id', render: (id, item) => (
            <div className="flex items-center gap-1 sm:gap-2">
            
                <button
                    onClick={() => handleUpdateStatus(id, item.status)}
                    title={item.status === 'Active' ? 'Deactivate' : 'Activate'}
                    className={`p-2 rounded-lg border transition-all duration-200 
                    ${item.status === 'Active'
                        ? 'text-red-600 hover:bg-red-50 border-transparent hover:border-red-100'
                        : 'text-green-600 hover:bg-green-50 border-transparent hover:border-green-100'
                    }`}
                >
                    {item.status === 'Active'
                    ? <Ban className="w-4 h-4" />
                    : <CheckCircle className="w-4 h-4" />
                    }
                </button>

                <button
                    title="View"
                    className="p-2 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-all"
                    onClick={() => handleViewJobRole(item)}
                >
                    <Eye className="w-4 h-4" />
                </button>

                <button
                    title="Edit"
                    className="p-2 rounded-lg text-gray-500 hover:text-yellow-600 hover:bg-yellow-50 transition-all"
                >
                    <Edit2 className="w-4 h-4" />
                </button>

                <button
                    title="Delete"
                    className="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all"
                >
                    <LucideDelete className="w-4 h-4" />
                </button>

            </div>
        )
        }
    ]
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
                                <option value="Active">Active</option>
                                <option value="Closed">Closed</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            <DataTable 
               columns={columns}
               isLoading={loading}
               data={jobRoles}
               emptyMessage='No job roles found matching your criteria'
               pagination={{
                currentPage,
                totalPages: pagination.jobRole.totalPages,
                onPageChange: (page) => setCurrentPage(page)
               }}
            >
            </DataTable>

            <JobRoleModal
                key={selectedJobRole?.id || modalMode}
                isOpen={isModalOpen}
                mode={modalMode}
                initialData={selectedJobRole}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveJobRole}
            />
        </div>
    </InternalLayout>
  )
}

export default JobRoles
