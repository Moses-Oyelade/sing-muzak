import { Model } from 'mongoose';
import { Category, CategoryDocument } from './schema/category.schema';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
export declare class CategoriesService {
    private categoryModel;
    constructor(categoryModel: Model<CategoryDocument>);
    createCategory(createCategoryDto: CreateCategoryDto): Promise<import("mongoose").Document<unknown, {}, CategoryDocument, {}> & Category & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    getCategories(): Promise<(import("mongoose").Document<unknown, {}, CategoryDocument, {}> & Category & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    getCategoryById(id: string): Promise<import("mongoose").Document<unknown, {}, CategoryDocument, {}> & Category & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    updateCategory(id: string, updateCategoryDto: UpdateCategoryDto): Promise<import("mongoose").Document<unknown, {}, CategoryDocument, {}> & Category & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    deleteCategory(id: string): Promise<string>;
}
