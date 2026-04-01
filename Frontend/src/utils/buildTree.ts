
import type { Category, CategoryNode } from "../types/category";

export const buildTree = (categories: Category[] ): CategoryNode[] => {
    const map = new Map<string, CategoryNode>()
    const roots: CategoryNode[] = []

    categories.forEach((c) => {
        map.set(c.id, {...c, children: []})
    })

    categories.forEach((c) => {
        const node = map.get(c.id)
        if(!node) return
        if(c.parentId){
            const parent = map.get(c.parentId)
            if(parent){
                parent.children.push(node)
            }
        }else{
            roots.push(node)
        }
    })
    return roots
}