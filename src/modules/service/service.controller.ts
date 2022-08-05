import 'reflect-metadata';
import {inject, injectable} from 'inversify';
import {Request, Response} from 'express';

import {Controller} from '../../common/controller/controller.js';
import Component from '../../types/component.types.js';
import {LoggerInterface} from '../../common/logger/logger.interface.js';
import ServiceServiceInterface from './service-service.interface.js';
import {HttpMethod} from '../../types/http-method.enum.js';
import {fillDTO} from '../../utils/functions.js';
import ServiceDto from './dto/service.dto.js';
import CreateServiceDto from './dto/create-service.dto.js';

@injectable()
class ServiceController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.ServiceService) private readonly serviceService: ServiceServiceInterface
  ) {
    super(logger);

    this.logger.info('Добавление роутов для услуг...');
    this.addRoute({path: '/', method: HttpMethod.Get, handler: this.index});
  }

  public async index(_req: Request, res: Response): Promise<void> {
    const result = await this.serviceService.findAll();

    return this.ok(res, fillDTO(ServiceDto, result));
  }

  public async create({body}: Request<Record<string, unknown>,
    Record<string, unknown>, CreateServiceDto>, res: Response): Promise<void> {
    const result = await this.serviceService.create(body);

    return this.created(res, fillDTO(ServiceDto, result));
  }
}

export default ServiceController;
