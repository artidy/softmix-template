import CompanyPhoneModel from '../../models/company-phone.model.js';
import CreateCompanyPhoneDto from './dto/create-company-phone.dto.js';

interface CompanyPhoneServiceInterface {
  findAll(): Promise<CompanyPhoneModel[]>;
  create(dto: CreateCompanyPhoneDto): Promise<CompanyPhoneModel>;
}

export default CompanyPhoneServiceInterface;
