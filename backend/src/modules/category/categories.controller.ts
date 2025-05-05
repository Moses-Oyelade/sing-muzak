import { Controller, Post, Get, Delete, Body, Param, UseGuards, Patch, NotFoundException } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Roles } from '../auth/roles/roles.decorator';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';

@Controller('categories')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  // Create a new category (Admin only)
  @Roles('admin')
  @Post()
  createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.createCategory(createCategoryDto);
  }

  // Get all categories
  @Roles('admin', 'member')
  @Get()
  getCategories() {
    return this.categoriesService.getCategories();
  }
  
  // Get one category
  @Roles('admin', 'user')
  @Get(':id')
  getCategoryById(@Param('id') id: string){
    return this.categoriesService.getCategoryById(id);
  }
  
  @Roles('admin')
  @Patch(':id')
  updateCategories(@Param('id') id: string, @Body() updateCategoriesDto: UpdateCategoryDto) {
    const category = this.categoriesService.updateCategory(id, updateCategoriesDto);
    if (!category) {
      throw new NotFoundException(`category not found`);
    }
    return category;
  }
  
  // Delete a category (Admin only)
  @Roles('admin')
  @Delete(':id')
  deleteCategory(@Param('id') id: string) {
    return this.categoriesService.deleteCategory(id);
  }
}
