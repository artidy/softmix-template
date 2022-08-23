import {IsBoolean, IsEmail, IsNotEmpty, IsString} from 'class-validator';

class LoginUserDto {
  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;

  @IsBoolean()
  isRemember!: boolean;
}

export default LoginUserDto;
