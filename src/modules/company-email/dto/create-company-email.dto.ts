import {IsBoolean, IsEmail} from 'class-validator';

class CreateCompanyEmailDto {
  @IsEmail()
  email!: string;

  @IsBoolean()
  isMain!: boolean;
}

export default CreateCompanyEmailDto;
