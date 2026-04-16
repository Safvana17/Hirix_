import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface ICategory extends Document {
    _id: Types.ObjectId;
    name: string;
    parentId: Types.ObjectId | null;
    isDeleted: boolean
}

const CategorySchema: Schema<ICategory> = new Schema({
    name: {
        type: String,
        required: true
    },
    parentId: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        default: null
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

export const CategoryModel: Model<ICategory> = mongoose.model<ICategory>('Category', CategorySchema)