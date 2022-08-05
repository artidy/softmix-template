import {IsBoolean, IsNotEmpty, IsString} from 'class-validator';

class CreateCompanyPhoneDto {
  @IsString()
  @IsNotEmpty()
  phoneNumber!: string;

  @IsBoolean()
  isMain!: boolean;
}

export default CreateCompanyPhoneDto;
