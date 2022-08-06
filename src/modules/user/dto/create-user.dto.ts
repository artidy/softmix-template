import {IsEmail, IsNotEmpty, IsString} from 'class-validator';

class CreateUserDto {
  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;
}

export default CreateUserDto;
