import {getRandomItem, getRandomItems} from '../functions.js';
import MockData from '../../types/mock-data.js';
import {ProductsGeneratorInterface} from './products-generator.interface.js';

class ProductsGenerator implements ProductsGeneratorInterface {
  constructor(private readonly mockData: MockData) {}

  public generate(): string {
    return [
      getRandomItem<string>(this.mockData.products),
      getRandomItems<string>(this.mockData.product_categories),
      getRandomItem<string>(this.mockData.product_types)
    ].join('\t');
  }
}

export default ProductsGenerator;
