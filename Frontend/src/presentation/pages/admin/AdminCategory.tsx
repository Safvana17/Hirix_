import React, { useState } from 'react'
import InternalLayout from '../../layouts/InternalLayout'
import { adminSidebarItems } from '../../../constants/sidebarItems'
import type { Category, ModalMode } from '../../../types/category'
import CategoryModal from '../../components/modal/CategoryModal'
import { useDispatch, useSelector } from 'react-redux'
import type { createCategoryPayload } from '../../../types/category'
import type { AppDispatch, RootState } from '../../../redux/store'
import { createCategory } from '../../../redux/slices/features/category/categorySlice'
import toast from 'react-hot-toast'

const AdminCategory: React.FC= () => {

    const [isModelOpen, setIsModalOpen] = useState(false)
    const [modalMode, setModalMode] = useState<ModalMode>('create')
    const [selectedCategory, setSelectedCategory ] = useState<Category | null>(null)
    const dispatch = useDispatch<AppDispatch>()

    const { categories} = useSelector((state: RootState) => state.category)

    const handleAddCategory = () => {
        setModalMode('create')
        setSelectedCategory(null)
        setIsModalOpen(true)
    }

    const handleSaveCategory = async(data: createCategoryPayload) => {
        try {
            if(modalMode === 'create'){
               await dispatch(createCategory(data)).unwrap()
               setIsModalOpen(false)
               toast.success('Category added successfully')
            }
        } catch (error) {
            if (error instanceof Error) {
              toast.error(error.message);
            } else {
              toast.error('Failed to create category');
            }
        }
    }

  return (
    <InternalLayout title='Categories' subTitle='Organize categories into hierarchical categories' sidebarItems={adminSidebarItems}>
       <div>
        <div>
            <button
               onClick={() => handleAddCategory()} 
            >
                Add Category
            </button>
        </div>

        <CategoryModal
           isOpen={isModelOpen}
           key={selectedCategory?.id || modalMode}
           mode={modalMode}
           initialData={selectedCategory}
           categories={categories}
           onClose={() => setIsModalOpen(false)}
           onSave={handleSaveCategory}
        />
       </div>
    </InternalLayout>
  )
}

export default AdminCategory
