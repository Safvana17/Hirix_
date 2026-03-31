export class CategoryEntity {
    id: string
    name: string
    parentId: string | null
    isDeleted: boolean
    constructor(id: string, name: string,isDeletd: boolean, parentId: string | null){
        this.id = id
        this.name = name
        this.isDeleted = isDeletd
        this.parentId = parentId
    }
}