import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import type { AppDispatch, RootState } from '../../../redux/store'
import InternalLayout from '../../layouts/InternalLayout'
import { adminSidebarItems } from '../../../constants/sidebarItems'
import DataTable from '../../components/ui/DataTable'
import type { Column } from '../../../types/table'
import { Ban, CheckCircle, Eye } from 'lucide-react'
import { fetchCandidates } from '../../../redux/slices/features/users/usersSlice'
import type { Candidate } from '../../../types/candidate'

const AdminCandidates : React.FC = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    const { candidates, loading } = useSelector((state: RootState) => state.userSlice)

    useEffect(() => {
        dispatch(fetchCandidates())
    }, [dispatch])

const columns: Column<Candidate>[] = [
    {header: 'Name', key: 'name', render: (val) => <span className='font-bold text-gray-800'>{val}</span>},
    {header: 'Email Address', key: 'email', render: (val) => <span className='font-bold text-gray-800'>{val}</span>},
    {header: 'Status', key: 'status', render: (val) => (
        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${val === 'Active' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
            {val}
        </span>
    )},
    {header: 'Actions', key: 'id', render:(id, item) => (
        <div>
            <button 
               onClick={() => navigate(`/admin/candidate/${id}`)}
               title='View Profile'
               className="p-2 hover:bg-amber-50 text-amber-600 rounded-lg transition-colors border border-transparent hover:border-amber-100"
            >
                <Eye className='w-4 h-4' />
            </button>
            {item.status === 'Active' ? (
                <button
                   title='Block Candidate'
                   role='company'
                >
                    <Ban className='w-4 h-4' />
                </button>
            ) : (
                <button
                  title='Unblock candidate'
                >
                    <CheckCircle className='w-4 h-4' />
                </button>
            )}
        </div>
    )}
]
  return (
    <InternalLayout title='Users' sidebarItems={adminSidebarItems}>
        <div>
            <DataTable 
               columns={columns}
               isLoading={loading}
               data={candidates}
               emptyMessage='No companies found matching your criteria'
            >

            </DataTable>
        </div>
    </InternalLayout>
  )
}

export default AdminCandidates
