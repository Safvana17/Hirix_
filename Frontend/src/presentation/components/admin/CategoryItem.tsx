import React, { useState } from 'react'
import type { CategoryNode } from '../../../types/category'
import { ChevronRight, ChevronDown, Folder, Pencil, Trash2 } from 'lucide-react'

const CategoryItem: React.FC<{ node: CategoryNode }> = ({ node }) => {
  const [open, setOpen] = useState(true)
  console.log("Rendering:", node.name, node.children)
  return (
    <li className="select-none">
      <div className="flex items-center gap-2 py-1 px-2 rounded hover:bg-gray-100 group">
        {node.children.length > 0 ? (
          <button onClick={() => setOpen(!open)}>
            {open ? (
              <ChevronDown size={16} />
            ) : (
              <ChevronRight size={16} />
            )}
          </button>
        ) : (
          <span className="w-4" />
        )}
        <Folder size={16} className="text-[#6B4705]" />
        <span className="text-sm text-gray-800">
          • {node.name}
        </span>
        <div className="ml-auto flex gap-3 opacity-0 group-hover:opacity-100 transition">
          <Pencil size={14} className="cursor-pointer text-gray-500 hover:text-blue-600" />
          <Trash2 size={14} className="cursor-pointer text-gray-500 hover:text-red-600" />
        </div>
      </div>

      {open && node.children.length > 0 && (
        <ul className="ml-6 border-l border-gray-200 pl-4 space-y-1">
          {node.children.map(child => (
            <CategoryItem key={child.id} node={child} />
          ))}
        </ul>
      )}
    </li>
  )
}

export default CategoryItem