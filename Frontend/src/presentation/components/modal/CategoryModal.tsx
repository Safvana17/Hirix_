import React, { useState } from 'react'
import type { Category, createCategoryPayload, ModalMode } from '../../../types/category'


interface CategoryModalProps {
    isOpen: boolean
    mode: ModalMode
    initialData?: Category | null
    categories: Category[]
    onClose: () => void
    onSave: (data: createCategoryPayload) => void

}
const CategoryModal: React.FC<CategoryModalProps>= ({
    isOpen,
    mode,
    initialData,
    categories,
    onClose,
    onSave
}) => {

    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        parentId: initialData?.parentId || null
    })

    if(!isOpen) return null

    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault()
        console.log('parent: ', formData.parentId)
        console.log('mode', mode)
        if(mode === 'create'){
            onSave({
                name: formData.name,
                parentId: formData.parentId,
            })
        // }else if(mode === 'edit' && initialData){
        //     onSave({
        //         id: initialData.id,
        //         isDeleted: initialData.isDeleted,
        //         name: formData.name,
        //         parentId: formData.parentId
        //     })
        }
    }
  return (
<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-y-auto">
            <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden my-8">

                <div className="flex justify-between items-center px-8 py-6 border-b">
                    <h2 className="text-xl font-bold text-gray-800">
                        {mode === 'create' && 'Add Category'}
                        {mode === 'edit' && 'Edit Category'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-red-500"
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">

                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-2">
                            Category Name
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    name: e.target.value
                                })
                            }
                            className="w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-amber-500"
                            placeholder="Enter job role name"
                        />
                        {/* {localError.name && <p className='text-[#FBBEBE] text-sm'>{localError.name}</p>} */}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-2">
                            Parent
                        </label>
                        <select
                            value={formData.parentId ?? ""}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    parentId: e.target.value || null
                                })
                            }
                            className="w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-amber-500"
                        >
                            <option value="">None</option>
                            {categories 
                               .filter(c => c.id !== initialData?.id)
                               .map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.name}
                                </option>
                               ))
                            }
                        </select>
                        {/* {localError.skills && <p className='text-[#FBBEBE] text-sm'>{localError.skills}</p>} */}
                    </div>
                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 rounded-xl border text-gray-500 hover:bg-gray-100"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-3 rounded-xl bg-amber-600 text-white font-semibold hover:bg-amber-700 transition"
                        >
                            {mode === 'create' ? 'Add Category' : 'Update Category'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
  )
}

export default CategoryModal
