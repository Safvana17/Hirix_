import React, { useEffect } from 'react'
import InternalLayout from '../../layouts/InternalLayout'
import { adminSidebarItems } from '../../../constants/sidebarItems'
import { ArrowLeft } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../../redux/store'
import { getCompanyDetail, updateUserStatus } from '../../../redux/slices/features/users/usersSlice'

const AdminCompanyDetailPage: React.FC= () => {
  const navigate = useNavigate()
  const {id} = useParams()
  const dispatch = useDispatch<AppDispatch>()
  const {selectedCompany} = useSelector((state: RootState) => state.userSlice)


  useEffect(() => {
       if(id){
        dispatch(getCompanyDetail({id}))
       }
  }, [id, dispatch])

  return (
    <InternalLayout title='' subTitle='' sidebarItems={adminSidebarItems}>
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-500 hover:text-[#6B4705] transition-colors mb-8 group"
            >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm font-bold uppercase tracking-widest">Back to List</span>
            </button> 
            <div>
              <div className='justify-between flex'>
                <div className='flex gap-10'>
                 <div>
                  <img src="" alt="companylogo" />
                 </div>
                 <div>
                  <h1 className='font-bold text-5xl font-bayon text-widest text-[#4F3503]'>{selectedCompany?.name}</h1>
                  <p className='font-semibold text-md'>{selectedCompany?.email}</p>
                 </div>
                </div>
                <div>
                  <button
                    className='cursor-pointer bg-[#6B4705] text-white px-4 py-3 font-bold rounded-lg hover:bg-[#4F3503]'
                    onClick={() => dispatch(updateUserStatus({
                      id: selectedCompany?.id,
                      status: selectedCompany?.status === 'active' ? 'blocked' : 'active',
                      role: 'company'
                    }))}
                  >
                    {selectedCompany?.status === 'active' ? 'Block' : 'Unblock'}
                  </button>
                </div>
              </div>
            </div>
    </InternalLayout>
  )
}

export default AdminCompanyDetailPage
