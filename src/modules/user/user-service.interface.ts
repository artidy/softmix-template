import UserModel from '../../models/user.model.js';
import CreateUserDto from './dto/create-user.dto.js';

interface UserServiceInterface {
  findAll(): Promise<UserModel[]>;
  findByEmail(email: string): Promise<UserModel | null>;
  create(dto: CreateUserDto, saltRounds: number): Promise<UserModel>;
}

export default UserServiceInterface;
