import { Controller, Post, Get, Delete, Body, Param, UseGuards, Patch, NotFoundException } from '@nestjs/common';
import { CategoryService } from './category.service';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Roles } from '../auth/roles/roles.decorator';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';

@Controller('categories')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  // Create a new category (Admin only)
  @Roles('Admin')
  @Post()
  createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.createCategory(createCategoryDto);
  }

  // Get all categories
  @Get()
  getCategories() {
    return this.categoryService.getCategories();
  }

  // Get one category
  @Get(':id')
  getCategoryById(@Param('id') id: string){
    return this.categoryService.findById(id);
  }

  @Patch(':id')
  updateCategories(@Param('id') id: string, @Body() updateCategoriesDto: UpdateCategoryDto) {
    const category = this.categoryService.updateCategory(id, updateCategoriesDto);
    if (!category) {
      throw new NotFoundException(`category not found`);
    }
    return category;
  }

  // Delete a category (Admin only)
  @Roles('Admin')
  @Delete(':id')
  deleteCategory(@Param('id') id: string) {
    return this.categoryService.deleteCategory(id);
  }
}
