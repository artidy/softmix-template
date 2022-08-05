import CompanyEmailModel from '../../models/company-email.model.js';
import createCompanyEmailDto from './dto/create-company-email.dto.js';

interface CompanyEmailServiceInterface {
  findAll(): Promise<CompanyEmailModel[]>;
  create(dto: createCompanyEmailDto): Promise<CompanyEmailModel>;
}

export default CompanyEmailServiceInterface;
