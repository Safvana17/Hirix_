// import React from 'react'
// import type { CategoryNode } from '../../../types/category'
// import CategoryItem from './CategoryItem'

// interface Props {
//   nodes: CategoryNode[]
// }

// const CategoryTree: React.FC<Props> = ({ nodes }) => {
//   return (
//     <ul className="mt-2">
//       {nodes.map(node => (
//         <CategoryItem key={node.id} node={node} />
//       ))}
//     </ul>
//   )
// }

// export default CategoryTree

import React from 'react'
import type { CategoryNode } from '../../../types/category'
import CategoryItem from './CategoryItem'
import { List } from '@mui/material'

interface Props {
  nodes: CategoryNode[]
  onEdit: (node: CategoryNode) => void
  onDelete: (id: string) => void
}

const CategoryTree: React.FC<Props> = ({ nodes, onEdit, onDelete }) => {
  return (
    <List>
      {nodes.map(node => (
        <CategoryItem 
          key={node.id} 
          node={node} 
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </List>
  )
}

export default CategoryTree