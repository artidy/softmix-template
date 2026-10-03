import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserModel, UserSchema } from './user.model';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RefreshTokenModule } from '../refresh-token/refresh-token.module';
import { EmailVerificationModule } from '../email-verification/email-verification.module';
import { CartModule } from '../cart/cart.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserModel.name, schema: UserSchema }
    ]),
    RefreshTokenModule,
    EmailVerificationModule,
    CartModule,
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository, JwtStrategy],
  exports: [UserService, UserRepository]
})
export class UserModule {}
