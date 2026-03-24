import React, { useEffect, useState } from 'react'
import InternalLayout from '../../layouts/InternalLayout'
import { adminSidebarItems } from '../../../constants/sidebarItems'
import { ArrowLeft, Ban, Building2, CheckCircle } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../../redux/store'
import { getCompanyDetail, updateUserStatus } from '../../../redux/slices/features/users/usersSlice'
import { ROLES } from '../../../constants/role'
import SummeryCard from '../../components/layout/SummeryCard'
import ConfirmationModal from '../../components/modal/ConfirmationModal'

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

    const openModal = (config: Omit<typeof modalConfig, 'isOpen'>) => {
        setModalConfig({...config, isOpen: true})
    }

    const closeModal = () => {
        setModalConfig(prev => ({...prev, isOpen: false}))
    }

  const handleUpdateStatus = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'blocked' : 'active'
    const actionText = newStatus === 'blocked' ? 'Block' : 'Unblock'

    openModal({
      title: `${actionText} Company`,
      message: `Are you sure you want to ${actionText.toLowerCase()} this company? This will ${newStatus === 'blocked' ? 'prevent them from accessing' : 'restore their access to'} the platform.`,
      type: newStatus === 'blocked' ? 'danger' : 'warning',
      onConfirm: () => {
        dispatch(updateUserStatus({id, status: newStatus, role: ROLES.COMPANY}));
        closeModal();
      }
    })
  }

return (
  <InternalLayout title="" subTitle="" sidebarItems={adminSidebarItems}>
    
    <button
      onClick={() => navigate(-1)}
      className="flex items-center gap-2 text-gray-500 hover:text-[#6B4705] mb-6"
    >
      <ArrowLeft className="w-4 h-4" />
      <span className="text-sm font-bold uppercase tracking-widest">
        Back to List
      </span>
    </button>
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-6">
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 bg-[#E7D4B0] rounded-xl flex items-center justify-center">
          <Building2 className="w-10 h-10 text-[#6B4705]" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#4F3503]">
            {selectedCompany?.name}
          </h1>
          <p className="text-gray-500 text-sm">
            {selectedCompany?.email}
          </p>
        </div>
      </div>
      <button
        className="bg-[#6B4705] text-white px-5 py-2 rounded-lg hover:bg-[#4F3503] w-full sm:w-auto"
        onClick={() => handleUpdateStatus(id, selectedCompany?.status)}
      >
        {selectedCompany?.status === "active" ? "Block" : "Unblock"}
      </button>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <SummeryCard label='Status' value={selectedCompany?.status || 'active'} icon={selectedCompany?.status === 'active' ? CheckCircle : Ban} bg={selectedCompany?.status === 'active' ? 'bg-green-100' : 'bg-red-100'} color={selectedCompany?.status === 'active' ? 'text-green-600' : 'text-red-600'} />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="font-semibold text-lg mb-4">
            Company Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Company Name</p>
              <p className="font-medium">{selectedCompany?.name}</p>
            </div>

            <div>
              <p className="text-gray-500">Member Since</p>
              <p className="font-medium">Jan 10, 2026</p>
            </div>

            <div>
              <p className="text-gray-500">Company Size</p>
              <p className="font-medium">200 - 400 Employees</p>
            </div>

            <div>
              <p className="text-gray-500">Description</p>
              <p className="font-medium">
                AI hiring platform
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="font-semibold text-lg mb-4">
            Contact Information
          </h2>

          <div className="space-y-3 text-sm">
            <p>Email: {selectedCompany?.email}</p>
            <p>Phone: +91 9876543210</p>
            <p>Website: techcrop.com</p>
            <p>Address: Kerala, India</p>
          </div>
        </div>
      </div>
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="font-semibold text-lg mb-4">
            Plan Details
          </h2>

          <div className="space-y-2 text-sm">
            <p>Plan Type: <span className="font-medium">Enterprise</span></p>
            <p>Max Users: Unlimited</p>
            <p>Tests / Month: Unlimited</p>
            <p>Next Billing: Feb 16, 2026</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="font-semibold text-lg mb-4">
            Recent Activity
          </h2>

          <ul className="space-y-3 text-sm">
            <li>Test Created</li>
            <li>User Added</li>
            <li>Test Completed</li>
            <li>Plan Upgraded</li>
          </ul>
        </div>
      </div>
    </div>

    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="font-semibold text-lg mb-4">
        Usage Statistics
      </h2>
      <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
        <div className="bg-[#6B4705] h-full w-[40%]" />
      </div>
      <p className="text-sm mt-2 text-gray-500">
        27 / Unlimited
      </p>
    </div>
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

export default AdminCompanyDetailPage
