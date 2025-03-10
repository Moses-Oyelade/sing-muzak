import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from './schema/category.schema';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';

@Injectable()
export class CategoryService {
  constructor(@InjectModel(Category.name) private categoryModel: Model<CategoryDocument>) {}

  // Create a new category with DTO
  async createCategory(createCategoryDto: CreateCategoryDto) {
    const existing = await this.categoryModel.findOne({ name: createCategoryDto.name });
    if (existing) throw new ConflictException('Category already exists');

    const category = new this.categoryModel(createCategoryDto);
    return category.save();
  }

  // Get all categories
  async getCategories() {
    return this.categoryModel.find();
  }

  // Get Category by ID
  async findById(id: string) {
    return this.categoryModel.findById(id)
  }

  // Update category with DTO
  async updateCategory(id: string, updateCategoryDto: UpdateCategoryDto) {
    const updatedCategory = await this.categoryModel.findByIdAndUpdate(id, updateCategoryDto, {
      new: true, // Return updated category
    });

    if (!updatedCategory) throw new NotFoundException('Category not found');
    return updatedCategory;
  }

  // Delete a category
  async deleteCategory(id: string) {
    const category = await this.categoryModel.findById(id);
    if (!category) throw new NotFoundException('Category not found');

    return this.categoryModel.findByIdAndDelete(id);
  }
}
