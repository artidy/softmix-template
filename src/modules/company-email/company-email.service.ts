import 'reflect-metadata';
import {injectable} from 'inversify';

import CompanyEmailServiceInterface from './company-email-service.interface.js';
import CompanyEmailModel from '../../models/company-email.model.js';
import createCompanyEmailDto from './dto/create-company-email.dto.js';

@injectable()
class CompanyEmailService implements CompanyEmailServiceInterface {
  public async findAll(): Promise<CompanyEmailModel[]> {
    return CompanyEmailModel.findAll();
  }

  public async create(dto: createCompanyEmailDto): Promise<CompanyEmailModel> {
    return CompanyEmailModel.create({...dto, is_main: dto.isMain});
  }
}

export default CompanyEmailService;
