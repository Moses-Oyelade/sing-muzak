"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const category_schema_1 = require("./schema/category.schema");
let CategoriesService = class CategoriesService {
    constructor(categoryModel) {
        this.categoryModel = categoryModel;
    }
    async createCategory(createCategoryDto) {
        const existing = await this.categoryModel.findOne({ name: createCategoryDto.name });
        if (existing)
            throw new common_1.ConflictException('Category already exists');
        const category = new this.categoryModel(createCategoryDto);
        return category.save();
    }
    async getCategories() {
        return this.categoryModel.find();
    }
    async getCategoryById(id) {
        const category = await this.categoryModel.findById(id);
        if (!category)
            throw new common_1.NotFoundException('Category not found');
        return category;
    }
    async updateCategory(id, updateCategoryDto) {
        const updatedCategory = await this.categoryModel.findByIdAndUpdate(id, updateCategoryDto, {
            new: true,
        });
        if (!updatedCategory)
            throw new common_1.NotFoundException('Category not found');
        return updatedCategory;
    }
    async deleteCategory(id) {
        const category = await this.categoryModel.findByIdAndDelete(id);
        if (!category)
            throw new common_1.NotFoundException('Category not found');
        return `Song Category ${category} deleted Successfully`;
    }
};
exports.CategoriesService = CategoriesService;
exports.CategoriesService = CategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(category_schema_1.Category.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], CategoriesService);
//# sourceMappingURL=categories.service.js.map