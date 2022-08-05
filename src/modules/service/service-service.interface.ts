import ServiceModel from '../../models/service.model.js';
import CreateServiceDto from './dto/create-service.dto.js';

interface ServiceServiceInterface {
  findAll(): Promise<ServiceModel[]>;
  create(dto: CreateServiceDto): Promise<ServiceModel>;
}

export default ServiceServiceInterface;
