import { Controller, Post, Get, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Roles } from '../auth/roles/roles.decorator';

@Controller('categories')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  // Create a new category (Admin only)
  @Roles('Admin')
  @Post()
  createCategory(@Body() body) {
    return this.categoryService.createCategory(body.name);
  }

  // Get all categories
  @Get()
  getCategories() {
    return this.categoryService.getCategories();
  }

  // Delete a category (Admin only)
  @Roles('Admin')
  @Delete(':id')
  deleteCategory(@Param('id') id: string) {
    return this.categoryService.deleteCategory(id);
  }
}
