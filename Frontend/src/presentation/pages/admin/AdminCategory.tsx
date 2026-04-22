import React, { useEffect, useMemo, useState } from 'react'
import InternalLayout from '../../layouts/InternalLayout'
import { adminSidebarItems } from '../../../constants/sidebarItems'
import type { Category, ModalMode } from '../../../types/category'
import CategoryModal from '../../components/modal/CategoryModal'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../../redux/store'
import { createCategory, deleteCategory, editCategory, getAllCategories } from '../../../redux/slices/features/category/categorySlice'
import toast from 'react-hot-toast'
import { buildTree } from '../../../utils/buildTree'
import  CategoryTree  from '../../components/admin/CategoryTree'
import { Plus, Search } from 'lucide-react'
import ConfirmationModal from '../../components/modal/ConfirmationModal'
import { Pagination } from '@mui/material'
import { useDebounce } from '../../../hooks/useDebounce'


const AdminCategory: React.FC = () => {

    const [isModelOpen, setIsModalOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [page, setPage] = useState(1)
    const [modalMode, setModalMode] = useState<ModalMode>('create')
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
    const debouncedSerchTerm = useDebounce(searchTerm, 500)
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
    const { categories, pagination } = useSelector((state: RootState) => state.category)


    useEffect(() => {
        dispatch(getAllCategories({search: debouncedSerchTerm,page, limit: 5}))
    }, [dispatch,debouncedSerchTerm, page])

    const openModal = (config: Omit<typeof modalConfig, 'isOpen'>) => {
        setModalConfig({...config, isOpen: true})
    }

    const closeModal = () => {
        setModalConfig(prev => ({...prev, isOpen: false}))
    }
    const treeData = useMemo(() => buildTree(categories || []), [categories])

    const handleAddCategory = () => {
        setSelectedCategory(null)
        setModalMode('create')
        setIsModalOpen(true)
    }

    const handleSaveCategory = async (data: Category) => {
        try {
            console.log('from category: ', data)
            if (modalMode === 'create') {
                await dispatch(createCategory(data)).unwrap()
                setIsModalOpen(false)
                await dispatch(getAllCategories({page, limit: 5})).unwrap()
                toast.success('Category added successfully')
            }else if(modalMode === 'edit'){
                await dispatch(editCategory(data)).unwrap()
                await dispatch(getAllCategories({page, limit: 5})).unwrap()
                setIsModalOpen(false)
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
                    dispatch(getAllCategories({page, limit: 5}))
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

                <div className="relative w-full md:w-2/3 lg:w-1/2 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white" />
                    <input
                            type="text"
                            placeholder="Search companies by name or email..."
                            className="w-full pl-12 pr-4 py-3.5 bg-[#9A6605] text-white border border-transparent rounded-2xl outline-none text-md transition-all focus:ring-2 focus:ring-[#9A6605] focus:ring-opacity-50"
                            value={debouncedSerchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                    />
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
                    key={selectedCategory?.id || modalMode}
                    isOpen={isModelOpen}
                    mode={modalMode}
                    initialData={selectedCategory}
                    categories={categories} 
                    onClose={() => {
                        setIsModalOpen(false)
                        setSelectedCategory(null)
                    }}
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
                <Pagination
                    count={pagination.category.totalPages}
                    page={page}
                    onChange={(_, value) => setPage(value)}
                />
            </div>
        </InternalLayout>
    )
}

export default AdminCategory