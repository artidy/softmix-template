import 'reflect-metadata';
import {inject, injectable} from 'inversify';
import {Request, Response} from 'express';

import {Controller} from '../../common/controller/controller.js';
import Component from '../../types/component.types.js';
import {LoggerInterface} from '../../common/logger/logger.interface.js';
import {HttpMethod} from '../../types/http-method.enum.js';
import {fillDTO} from '../../utils/functions.js';
import ValidateDtoMiddleware from '../../common/middlewares/validate-dto.middleware.js';
import CompanyPhoneServiceInterface from './company-phone-service.interface.js';
import CreateCompanyPhoneDto from './dto/create-company-phone.dto.js';
import CompanyPhoneDto from './dto/company-phone.dto.js';

@injectable()
class CompanyPhoneController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.CompanyPhoneServiceInterface) private readonly companyPhoneService: CompanyPhoneServiceInterface
  ) {
    super(logger);

    this.logger.info('Добавление роутов для телефонов компании...');
    this.addRoute({path: '/', method: HttpMethod.Get, handler: this.index});
    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new ValidateDtoMiddleware(CreateCompanyPhoneDto)]
    });
  }

  public async index(_req: Request, res: Response): Promise<void> {
    const result = await this.companyPhoneService.findAll();

    this.ok(res, fillDTO(CompanyPhoneDto, result));
  }

  public async create({body}: Request<Record<string, unknown>,
    Record<string, unknown>, CreateCompanyPhoneDto>, res: Response): Promise<void> {
    const result = await this.companyPhoneService.create(body);

    this.created(res, fillDTO(CompanyPhoneDto, result));
  }
}

export default CompanyPhoneController;
