import {injectable} from 'inversify';

import CategoryServiceInterface from './category-service.interface.js';
import CreateCategoryDto from './dto/create-category.dto.js';
import CategoryModel from '../../models/category.model.js';
import CategoryParentModel from '../../models/category-parent.model.js';

@injectable()
class CategoryService implements CategoryServiceInterface {
  async findAll(): Promise<CategoryModel[]> {
    return CategoryModel.findAll({ include: CategoryParentModel });
  }

  async create(dto: CreateCategoryDto): Promise<CategoryModel> {
    if (dto.parentId) {
      await CategoryParentModel.findOrCreate({ where: { id: dto.parentId }});
    }

    return CategoryModel.create({...dto});
  }
}

export default CategoryService;
