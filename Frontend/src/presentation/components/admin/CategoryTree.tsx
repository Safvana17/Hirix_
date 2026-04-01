import React from 'react'
import type { CategoryNode } from '../../../types/category'
import CategoryItem from './CategoryItem'

interface Props {
  nodes: CategoryNode[]
}

const CategoryTree: React.FC<Props> = ({ nodes }) => {
  return (
    <ul className="mt-2">
      {nodes.map(node => (
        <CategoryItem key={node.id} node={node} />
      ))}
    </ul>
  )
}

export default CategoryTree