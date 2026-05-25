import React from 'react'
import InternalLayout from '../../layouts/InternalLayout'
import { companySidebarItems } from '../../../constants/sidebarItems'
import { Plus } from 'lucide-react'

const CompanyInterviews: React.FC = () => {
  return (
<InternalLayout title='Interviews' subTitle='Manage multi-round interview process' sidebarItems={companySidebarItems}>
    <div>
        <div className='flex justify-end mb-5'>
            <button className='bg-[#795003] rounded-xl font-bold text-white p-3 flex items-center gap-2'>
                <Plus className='w-4 h-4' />
                Add Question
            </button>
        </div>
    </div>
</InternalLayout>
  )
}

export default CompanyInterviews
