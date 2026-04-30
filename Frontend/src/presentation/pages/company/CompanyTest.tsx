import React from 'react'
import InternalLayout from '../../layouts/InternalLayout'
import { companySidebarItems } from '../../../constants/sidebarItems'
import { Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const CompanyTest: React.FC = () => {
    const navigate = useNavigate()
    const handleCreateTest = () => {
        navigate('/company/test/create')
    }
  return (
    <InternalLayout title='Test' subTitle='Manage your tests and candidate assessments' sidebarItems={companySidebarItems}>
        <div>
           <div className='flex justify-end mb-5'>
              <button onClick={handleCreateTest} className='cursor-pointer bg-[#795003] rounded-xl font-bold text-white p-3 flex items-center gap-2'>
                <Plus className='w-4 h-4' />
                Create Test
              </button>
            </div>
        </div>
    </InternalLayout>
  )
}

export default CompanyTest
