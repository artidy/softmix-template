import 'reflect-metadata';
import {inject, injectable} from 'inversify';
import {Request, Response} from 'express';

import {Controller} from '../../common/controller/controller.js';
import Component from '../../types/component.types.js';
import {LoggerInterface} from '../../common/logger/logger.interface.js';
import CompanyEmailServiceInterface from './company-email-service.interface.js';
import {HttpMethod} from '../../types/http-method.enum.js';
import {fillDTO} from '../../utils/functions.js';
import CompanyEmailDto from './dto/company-email.dto.js';
import CreateCompanyEmailDto from './dto/create-company-email.dto.js';
import ValidateDtoMiddleware from '../../common/middlewares/validate-dto.middleware.js';

@injectable()
class CompanyEmailController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.CompanyEmailServiceInterface) private readonly companyEmailService: CompanyEmailServiceInterface
  ) {
    super(logger);

    this.logger.info('Добавление роутов для категорий...');
    this.addRoute({path: '/', method: HttpMethod.Get, handler: this.index});
    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new ValidateDtoMiddleware(CreateCompanyEmailDto)]
    });
  }

  public async index(_req: Request, res: Response): Promise<void> {
    const result = await this.companyEmailService.findAll();

    this.ok(res, fillDTO(CompanyEmailDto, result));
  }

  public async create({body}: Request<Record<string, unknown>,
    Record<string, unknown>, CreateCompanyEmailDto>, res: Response): Promise<void> {
    const result = await this.companyEmailService.create(body);

    this.created(res, fillDTO(CompanyEmailDto, result));
  }
}

export default CompanyEmailController;
