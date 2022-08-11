import {IsEmail, IsNotEmpty, IsString} from 'class-validator';

class LoginUserDto {
  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;
}

export default LoginUserDto;
