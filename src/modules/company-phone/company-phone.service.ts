import 'reflect-metadata';
import {injectable} from 'inversify';

import CompanyPhoneServiceInterface from './company-phone-service.interface.js';
import CompanyPhoneModel from '../../models/company-phone.model.js';
import CreateCompanyPhoneDto from './dto/create-company-phone.dto.js';

@injectable()
class CompanyPhoneService implements CompanyPhoneServiceInterface {
  async findAll(): Promise<CompanyPhoneModel[]> {
    return CompanyPhoneModel.findAll();
  }

  async create(dto: CreateCompanyPhoneDto): Promise<CompanyPhoneModel> {
    return CompanyPhoneModel.create({phone_number: dto.phoneNumber, is_main: dto.isMain});
  }
}

export default CompanyPhoneService;
