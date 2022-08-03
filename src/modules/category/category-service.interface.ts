import CreateCategoryDto from './dto/create-category.dto.js';
import CategoryModel from '../../models/category.model.js';

interface CategoryServiceInterface {
  findAll(): Promise<CategoryModel[]>;
  create(dto: CreateCategoryDto): Promise<CategoryModel>;
}

export default CategoryServiceInterface;
