import ProductModel from '../../models/product.model.js';
import CreateProductDto from './dto/create-product.dto.js';

interface ProductServiceInterface {
  findAll(): Promise<ProductModel[]>;
  create(dto: CreateProductDto): Promise<ProductModel>;
}

export default ProductServiceInterface;
