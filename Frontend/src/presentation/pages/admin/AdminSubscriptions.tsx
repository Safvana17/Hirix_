import React, { useState } from 'react'
import InternalLayout from '../../layouts/InternalLayout'
import { adminSidebarItems } from '../../../constants/sidebarItems'
import { Plus } from 'lucide-react'
import type { CreatePlanPayload, ModalMode } from '../../../types/subscription'
import SubscriptionPlanModal from '../../components/modal/SubscriptionPlanModal'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import type { AppDispatch } from '../../../redux/store'
import { createPlan } from '../../../redux/slices/features/subscription/subscription'


const AdminSubscriptions: React.FC = () => {

  const [modalMode, setModalMode] = useState<ModalMode>('create')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const disapatch = useDispatch<AppDispatch>()


  const handleAddPlan = () => {
    setModalMode('create')
    setIsModalOpen(true)
  }

  const handleSubmit = async(data: CreatePlanPayload) => {
    try {
      if(modalMode === 'create'){
        await disapatch(createPlan({data})).unwrap()
        toast.success('Plan created successfully')
        setIsModalOpen(false)
      }
    } catch (error) {
      toast.error(typeof error === 'string' ? error : 'Failed to perform operation')
    }
  }

  return (
    <InternalLayout title='Subscription' subTitle='Manage subscription plans and features' sidebarItems={adminSidebarItems}>
     <div>
      <div className='flex justify-end mb-5'>
        <button onClick={handleAddPlan} className='bg-[#795003] rounded-xl font-bold text-white p-3 flex items-center gap-2'>
          <Plus className='w-4 h-4' />
          Create Plan
        </button>
      </div>
      <div>

      </div>
      <SubscriptionPlanModal 
        isOpen={isModalOpen}
        mode={modalMode}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      />
     </div>
    </InternalLayout>
  )
}

export default AdminSubscriptions
