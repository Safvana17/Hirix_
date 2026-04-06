import React, { useEffect, useState } from 'react'
import InternalLayout from '../../layouts/InternalLayout'
import { companySidebarItems } from '../../../constants/sidebarItems'
import { Plus } from 'lucide-react'
import type { ModalMode, Question, QuestionFormData } from '../../../types/question'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../../redux/store'
import { getAllCategories } from '../../../redux/slices/features/category/categorySlice'
import QuestionModal from '../../components/modal/QuestionModal'
import toast from 'react-hot-toast'
import { createQuestion } from '../../../redux/slices/features/question/questionSlice'


const CompanyQuestion: React.FC = () => {

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<ModalMode>('create')
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null> (null)
  const dispatch = useDispatch<AppDispatch>()
  const {categories} = useSelector((state: RootState) => state.category)
  const { user } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
     dispatch(getAllCategories({}))
  }, [dispatch])

  const handleAddQuestion = () => {
    setSelectedQuestion(null)
    setModalMode('create')
    setIsModalOpen(true) 
  }

  const handleSaveQuestion = async (data: QuestionFormData) => {
      try {
        if(modalMode === 'create' && user){
            await dispatch(createQuestion({data, role: user.role})).unwrap()
            setIsModalOpen(false)
            toast.success('Question added successfully')
        }
      } catch (error) {
        toast.error(typeof error === 'string' ? error : 'Failed to create question')
      }
  }
  return (
    <InternalLayout title='Questions' subTitle='Manage assessment question library' sidebarItems={companySidebarItems}>
       <div>
           <div className='flex justify-end mb-5'>
              <button onClick={handleAddQuestion} className='bg-[#795003] rounded-xl font-bold text-white p-3 flex items-center gap-2'>
                <Plus className='w-4 h-4' />
                Add Question
              </button>
            </div>

            <div>

            </div>
            <QuestionModal 
               isOpen={isModalOpen}
               mode={modalMode}
               categories={categories}
               initialData={selectedQuestion}
               onSave={handleSaveQuestion}
               onClose={() => {
                 setIsModalOpen(false)
               }}
            />
       </div>
    </InternalLayout>
  )
}

export default CompanyQuestion
