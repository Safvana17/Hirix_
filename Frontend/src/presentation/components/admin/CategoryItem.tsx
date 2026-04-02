import React, { useState } from 'react'
import type { CategoryNode } from '../../../types/category'

import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  IconButton
} from '@mui/material'

import {
  ExpandLess,
  ExpandMore,
  Folder,
  Edit,
  Delete
} from '@mui/icons-material'

interface categoryItemProps {
  node: CategoryNode
  onEdit: (node: CategoryNode) => void
  onDelete: (id: string) => void
}

const CategoryItem: React.FC<categoryItemProps> = ({ node, onEdit, onDelete }) => {
  const [open, setOpen] = useState(true)

  const hasChildren = node.children && node.children.length > 0

  return (
    <>
      <ListItemButton onClick={() => hasChildren && setOpen(!open)}>
          {hasChildren && (
            <ListItemIcon sx={{ minWidth: 30 }}>
              {open ? <ExpandLess /> : <ExpandMore />}
            </ListItemIcon>
          )}
          <ListItemIcon sx={{ minWidth: 30 }}>
            <Folder />
          </ListItemIcon>
          <ListItemText primary={node.name} />
          <IconButton 
            size="small"
            onClick={(e) => {
              e.stopPropagation()
              onEdit(node)
            }}
          >
            <Edit fontSize="small" />
          </IconButton>
          <IconButton 
            size="small"
            onClick={(e) => {
              e.stopPropagation()
              onDelete(node.id)
            }}
          >
            <Delete fontSize="small" />
          </IconButton>
      </ListItemButton>
      {hasChildren && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding sx={{ pl: 4 }}>
            {node.children.map(child => (
              <CategoryItem 
                key={child.id} 
                node={child} 
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </List>
        </Collapse>
      )}
    </>
  )
}

export default CategoryItem