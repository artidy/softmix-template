import UserModel from './user.model.js';
import CreateUserDto from './dto/create-user.dto.js';
import LoginUserDto from './dto/login-user.dto.js';

interface UserServiceInterface {
  findAll(): Promise<UserModel[]>;
  findByEmail(email: string): Promise<UserModel | null>;
  findById(id: number): Promise<UserModel | null>;
  create(dto: CreateUserDto, saltRounds: number): Promise<UserModel>;
  verifyUser(dto: LoginUserDto): Promise<UserModel | null>
}

export default UserServiceInterface;
