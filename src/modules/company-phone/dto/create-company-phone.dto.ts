import {IsBoolean, IsPhoneNumber} from 'class-validator';

class CreateCompanyPhoneDto {
  @IsPhoneNumber()
  phoneNumber!: string;

  @IsBoolean()
  isMain!: boolean;
}

export default CreateCompanyPhoneDto;
