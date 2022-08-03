import {injectable} from 'inversify';

import CategoryServiceInterface from './category-service.interface.js';
import CreateCategoryDto from './dto/create-category.dto.js';
import CategoryModel from '../../models/category.model.js';

@injectable()
class CategoryService implements CategoryServiceInterface{
  async findAll(): Promise<CategoryModel[]> {
    return CategoryModel.findAll();
  }

  async create(dto: CreateCategoryDto): Promise<CategoryModel> {
    return CategoryModel.create({...dto});
  }
}

export default CategoryService;
