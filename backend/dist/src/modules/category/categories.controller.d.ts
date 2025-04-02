import { CategoriesService } from './categories.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    createCategory(createCategoryDto: CreateCategoryDto): Promise<import("mongoose").Document<unknown, {}, import("./schema/category.schema").CategoryDocument> & import("./schema/category.schema").Category & import("mongoose").Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    getCategories(): Promise<(import("mongoose").Document<unknown, {}, import("./schema/category.schema").CategoryDocument> & import("./schema/category.schema").Category & import("mongoose").Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    getCategoryById(id: string): Promise<import("mongoose").Document<unknown, {}, import("./schema/category.schema").CategoryDocument> & import("./schema/category.schema").Category & import("mongoose").Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    updateCategories(id: string, updateCategoriesDto: UpdateCategoryDto): Promise<import("mongoose").Document<unknown, {}, import("./schema/category.schema").CategoryDocument> & import("./schema/category.schema").Category & import("mongoose").Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    deleteCategory(id: string): Promise<string>;
}
