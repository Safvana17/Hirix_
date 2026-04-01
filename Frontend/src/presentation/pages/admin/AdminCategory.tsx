import React, { useEffect, useMemo, useState } from 'react'
import InternalLayout from '../../layouts/InternalLayout'
import { adminSidebarItems } from '../../../constants/sidebarItems'
import type { Category, ModalMode } from '../../../types/category'
import CategoryModal from '../../components/modal/CategoryModal'
import { useDispatch, useSelector } from 'react-redux'
import type { createCategoryPayload } from '../../../types/category'
import type { AppDispatch, RootState } from '../../../redux/store'
import { createCategory, getAllCategories } from '../../../redux/slices/features/category/categorySlice'
import toast from 'react-hot-toast'
import { buildTree } from '../../../utils/buildTree'
import  CategoryTree  from '../../components/admin/CategoryTree'
import { Plus } from 'lucide-react'

const AdminCategory: React.FC = () => {

    const [isModelOpen, setIsModalOpen] = useState(false)
    const [modalMode, setModalMode] = useState<ModalMode>('create')
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)

    const dispatch = useDispatch<AppDispatch>()

    const { categories } = useSelector((state: RootState) => state.category)


    useEffect(() => {
        dispatch(getAllCategories())
    }, [dispatch])


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
            if (error instanceof Error) {
                toast.error(error.message)
            } else {
                toast.error('Failed to create category')
            }
        }
    }

    console.log("FLAT categories:", categories)
console.log("TREE:", treeData)

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
                        <CategoryTree nodes={treeData} />
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
            </div>
        </InternalLayout>
    )
}

export default AdminCategory