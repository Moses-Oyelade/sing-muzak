import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from './schema/category.schema';

@Injectable()
export class CategoryService {
  constructor(@InjectModel(Category.name) private categoryModel: Model<CategoryDocument>) {}

  // Create a new category
  async createCategory(name: string) {
    const existing = await this.categoryModel.findOne({ name });
    if (existing) throw new ConflictException('Category already exists');

    const category = new this.categoryModel({ name });
    return category.save();
  }

  // Get all categories
  async getCategories() {
    return this.categoryModel.find();
  }

  // Delete a category (Admin only)
  async deleteCategory(id: string) {
    const category = await this.categoryModel.findById(id);
    if (!category) throw new NotFoundException('Category not found');

    return this.categoryModel.findByIdAndDelete(id);
  }
}
