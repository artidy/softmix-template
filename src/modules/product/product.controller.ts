import {inject, injectable} from 'inversify';
import {Request, Response} from 'express';

import {Controller} from '../../common/controller/controller.js';
import Component from '../../types/component.types.js';
import {LoggerInterface} from '../../common/logger/logger.interface.js';
import {HttpMethod} from '../../types/http-method.enum.js';
import ValidateDtoMiddleware from '../../common/middlewares/validate-dto.middleware.js';
import {fillDTO} from '../../utils/functions.js';
import ProductServiceInterface from './product-service.interface.js';
import CreateProductDto from './dto/create-product.dto.js';
import ProductDto from './dto/product.dto.js';

@injectable()
class ProductController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.ProductServiceInterface) private readonly productService: ProductServiceInterface) {
    super(logger);

    this.logger.info('Добавление роутов для категорий...');
    this.addRoute({path: '/', method: HttpMethod.Get, handler: this.index});
    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new ValidateDtoMiddleware(CreateProductDto)
      ]
    });
  }

  public async index(_req: Request, res: Response) {
    const result = await this.productService.findAll();

    this.ok(res, fillDTO(ProductDto, result));
  }


  public async create({body}: Request<Record<string, unknown>,
    Record<string, unknown>, CreateProductDto>, res: Response) {
    const result = await this.productService.create(body);

    this.created(res, fillDTO(ProductDto, result));
  }
}

export default ProductController;
