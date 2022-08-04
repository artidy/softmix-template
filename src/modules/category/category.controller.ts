import {inject, injectable} from 'inversify';
import {Request, Response} from 'express';

import {Controller} from '../../common/controller/controller.js';
import Component from '../../types/component.types.js';
import {LoggerInterface} from '../../common/logger/logger.interface.js';
import CategoryServiceInterface from './category-service.interface.js';
import {HttpMethod} from '../../types/http-method.enum.js';
import CreateCategoryDto from './dto/create-category.dto.js';
import {fillDTO} from '../../utils/functions.js';
import ValidateDtoMiddleware from '../../common/middlewares/validate-dto.middleware.js';

@injectable()
class CategoryController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.CategoryServiceInterface) private readonly categoryService: CategoryServiceInterface) {
    super(logger);

    this.logger.info('Добавление роутов для категорий...');
    this.addRoute({path: '/', method: HttpMethod.Get, handler: this.index});
    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new ValidateDtoMiddleware(CreateCategoryDto)
      ]
    });
  }

  public async index(_req: Request, res: Response) {
    this.ok(res, this.categoryService.findAll());
  }


  public async create({body}: Request<Record<string, unknown>,
    Record<string, unknown>, CreateCategoryDto>, res: Response) {
    const result = await this.categoryService.create(body);

    this.created(res, fillDTO(CreateCategoryDto, result));
  }
}

export default CategoryController;
