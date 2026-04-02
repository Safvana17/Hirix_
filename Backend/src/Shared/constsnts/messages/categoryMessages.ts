export const categoryMessages = {
    success: {
       CATEGORY_ADDED_SUCCESSFULLY: 'Category added succesfully',
       CATEGORY_DELETED_SUCCESSFULLY: 'Category deleted successfully',
       CATEGORY_UPDATED_SUCCESSFULLY: 'Category updated successfully',
    },
    error: {
        ALREADY_EXISITING: "Category name already existing",
        PARENT_NOT_FOUND: "Parent not found",
        NOT_FOUND: 'Category not found',
        DELETED_PARENT_CATEGORY: 'The category is deleted, cannot assign deleted category as parent category',
        DELETED_CATEGORY: 'The category is deleted.',
        CANNOT_SET_ITSELF_AS_PARENT: 'Cannot set itself as parent',
        CANNOT_DELETE_cATEGORY_WITH_CHILDREN: 'Cannot delete a category with children',
        UPDATE_CATEGORY_FAILED: 'Failed to update category',
        SAME_CATEGORY_AND_PARENT_cATEGORY: 'Categoy and parent category should not be same'
    }
}