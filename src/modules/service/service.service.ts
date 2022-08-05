import 'reflect-metadata';
import {injectable} from 'inversify';

import ServiceServiceInterface from './service-service.interface.js';
import ServiceModel from '../../models/service.model.js';
import CreateServiceDto from './dto/create-service.dto.js';

@injectable()
class ServiceService implements ServiceServiceInterface {
  public async findAll(): Promise<ServiceModel[]> {
    return ServiceModel.findAll();
  }

  public async create(dto: CreateServiceDto): Promise<ServiceModel> {
    return ServiceModel.create({...dto});
  }
}

export default ServiceService;
