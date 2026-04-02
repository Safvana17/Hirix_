import React, { useEffect, useMemo, useState } from 'react'
import InternalLayout from '../../layouts/InternalLayout'
import { adminSidebarItems } from '../../../constants/sidebarItems'
import type { Category, ModalMode } from '../../../types/category'
import CategoryModal from '../../components/modal/CategoryModal'
import { useDispatch, useSelector } from 'react-redux'
import type { createCategoryPayload } from '../../../types/category'
import type { AppDispatch, RootState } from '../../../redux/store'
import { createCategory, deleteCategory, getAllCategories } from '../../../redux/slices/features/category/categorySlice'
import toast from 'react-hot-toast'
import { buildTree } from '../../../utils/buildTree'
import  CategoryTree  from '../../components/admin/CategoryTree'
import { Plus } from 'lucide-react'
import ConfirmationModal from '../../components/modal/ConfirmationModal'

const AdminCategory: React.FC = () => {

    const [isModelOpen, setIsModalOpen] = useState(false)
    const [modalMode, setModalMode] = useState<ModalMode>('create')
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
    const [modalConfig, setModalConfig] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        onConfirm: () => void
        type: 'danger'
    }>({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => { },
        type: 'danger'
    })
    const dispatch = useDispatch<AppDispatch>()
    const { categories } = useSelector((state: RootState) => state.category)


    useEffect(() => {
        dispatch(getAllCategories())
    }, [dispatch])

    const openModal = (config: Omit<typeof modalConfig, 'isOpen'>) => {
        setModalConfig({...config, isOpen: true})
    }

    const closeModal = () => {
        setModalConfig(prev => ({...prev, isOpen: false}))
    }
    const treeData = useMemo(() => buildTree(categories), [categories])

    const handleAddCategory = () => {
        setModalMode('create')
        setSelectedCategory(null)
        setIsModalOpen(true)
    }

    const handleSaveCategory = async (data: createCategoryPayload) => {
        try {
            console.log('from category: ', data)
            if (modalMode === 'create') {
                await dispatch(createCategory(data)).unwrap()
                await dispatch(getAllCategories()).unwrap()
                setIsModalOpen(false)
                toast.success('Category added successfully')
            }
        } catch (error) {
            toast.error(typeof error === 'string' ? error :  'Failed to delete category')
        }
    }

    const handleEditCategory = async(category: Category) => {
        setModalMode('edit')
        setSelectedCategory(category)
        setIsModalOpen(true)
    }

    const handleDeleteCategory = (id: string) => {
        openModal({
            title: 'Delete Category',
            message: 'Are you sure you want to delete this category?',
            type: 'danger',
            onConfirm: async() => {
                 try {
                    await dispatch(deleteCategory({id})).unwrap()
                    toast.success('Category deleted successfully')
                    dispatch(getAllCategories())
                 } catch (error: unknown) {
                   toast.error(typeof error === 'string' ? error :  'Failed to delete category')
                 }finally{
                    closeModal()
                 }
            }
        })
    }

    return (
        <InternalLayout title='Categories' subTitle='Organize categories into hierarchical categories' sidebarItems={adminSidebarItems} >
            <div>
                <div className='flex justify-end mb-5'>
                    <button onClick={handleAddCategory} className='bg-[#795003] rounded-xl font-bold text-white p-3 flex items-center gap-2'>
                        <Plus className='w-4 h-4' />
                        Add Job Category
                    </button>
                </div>

                <div className="mt-6 bg-white rounded-2xl shadow-sm border">
                    <div className="flex items-center gap-2 px-4 py-3 bg-[#6B4705] text-white rounded-t-2xl">
                        <span className="text-sm font-semibold">☰</span>
                        <h2 className="font-semibold">Category Hierarchy</h2>
                    </div>
                    <div className="p-4">
                        <CategoryTree 
                          nodes={treeData}
                          onEdit={handleEditCategory}
                          onDelete={handleDeleteCategory} 
                        />
                    </div>
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

               <ConfirmationModal 
                    isOpen={modalConfig.isOpen}
                    onClose={closeModal}
                    onConfirm={modalConfig.onConfirm}
                    title={modalConfig.title}
                    message={modalConfig.message}
                    type={modalConfig.type}
            />
            </div>
        </InternalLayout>
    )
}

export default AdminCategory