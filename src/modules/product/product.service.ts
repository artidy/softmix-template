import {injectable} from 'inversify';

import ProductServiceInterface from './product-service.interface.js';
import CategoryModel from '../../models/category.model.js';
import ProductModel from '../../models/product.model.js';
import CreateProductDto from './dto/create-product.dto.js';

@injectable()
class ProductService implements ProductServiceInterface {
  async findAll(): Promise<ProductModel[]> {
    return ProductModel.findAll({ include: CategoryModel });
  }

  async create(dto: CreateProductDto): Promise<ProductModel> {
    return ProductModel.create({...dto});
  }
}

export default ProductService;
