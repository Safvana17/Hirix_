import React, { useEffect, useState } from 'react'
import InternalLayout from '../../layouts/InternalLayout'
import { adminSidebarItems } from '../../../constants/sidebarItems'
import { Plus } from 'lucide-react'
import type { ModalMode, QuestionFormData } from '../../../types/question'
import QuestionModal from '../../components/modal/QuestionModal'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../../redux/store'
import { getAllCategories } from '../../../redux/slices/features/category/categorySlice'
import toast from 'react-hot-toast'
import { createQuestion } from '../../../redux/slices/features/question/questionSlice'

const AdminTestQuestions: React.FC= () => {

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<ModalMode>('create')
  const { categories } = useSelector((state: RootState) => state.category)
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() =>{
    dispatch(getAllCategories({}))
  },[dispatch])

  const handleAddQuestion = () => {
    setModalMode('create')
    setIsModalOpen(true)
  }

  const handleSaveQuestion = async(data: QuestionFormData) => {
      try {
        if(modalMode === 'create'){
            await dispatch(createQuestion(data)).unwrap()
            setIsModalOpen(false)
            toast.success('Question added successfully')
        }
      } catch (error) {
        toast.error(typeof error === 'string' ? error : 'Failed to create question')
      }
  }
  return (
    <InternalLayout title='Questions' subTitle='Manage assessment questions library' sidebarItems={adminSidebarItems}>
        <div>
            <div className='flex justify-end mb-5'>
              <button onClick={handleAddQuestion} className='bg-[#795003] rounded-xl font-bold text-white p-3 flex items-center gap-2'>
                <Plus className='w-4 h-4' />
                Add Question
              </button>
            </div>

            <QuestionModal
                isOpen={isModalOpen}
                mode={modalMode}
                categories={categories}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveQuestion}
            />
        </div>
    </InternalLayout>
  )
}

export default AdminTestQuestions
