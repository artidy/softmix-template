import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  Query,
  Res,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { fillObject, HttpExceptionFilter, UserDecorator } from '@project-lib/core';
import { UrlPaths, UserRequest } from '@project-lib/shared-types';

import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { LoggedUserRdo } from './rdo/logged-user.rdo';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { RegisterUserDto } from '../user/dto/register-user.dto';
import { UserService } from '../user/user.service';
import { UserRdo } from '../user/rdo/user.rdo';
import { EmailVerificationService } from '../email-verification/email-verification.service';

interface ResendVerificationDto {
  identifier?: string;
}

@UseFilters(HttpExceptionFilter)
@ApiTags(UrlPaths.Auth)
@Controller(UrlPaths.Auth)
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly emailVerificationService: EmailVerificationService,
    private readonly configService: ConfigService,
  ) {}

  @Post(UrlPaths.Register)
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    type: UserRdo,
    status: HttpStatus.CREATED,
    description: 'Зарегистрирован новый пользователь. Отправлено письмо с подтверждением email.'
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Пользователь с таким логином или email уже существует.',
  })
  public async register(@Body() dto: RegisterUserDto) {
    const user = await this.userService.create(dto);

    this.emailVerificationService
      .issueAndSend(user)
      .catch((error) => this.logger.error('Не удалось отправить письмо верификации', error as Error));

    return {
      ...fillObject(UserRdo, user),
      pendingEmailVerification: true,
      message: 'Регистрация успешна. Проверьте почту — мы отправили ссылку для подтверждения.',
    };
  }

  @UseGuards(LocalAuthGuard)
  @Post(UrlPaths.Login)
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    type: LoggedUserRdo,
    status: HttpStatus.OK,
    description: 'User has been successfully logged.'
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Password or Login is wrong.',
  })
  public async login(@UserDecorator() user: UserRequest) {
    return this.authService.loginUser(user);
  }

  @UseGuards(JwtRefreshGuard)
  @Get(UrlPaths.Refresh)
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get a new access/refresh tokens'
  })
  public async refresh(@UserDecorator() user: UserRequest) {
    const tokenData = await this.authService.loginUser({
      name: user.name,
      role: user.role,
      login: user.login,
      _id: user.id
    }, user.refreshTokenId);

    return fillObject(LoggedUserRdo, tokenData);
  }

  @UseGuards(JwtRefreshGuard)
  @Delete(UrlPaths.Logout)
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Logout'
  })
  public async logout(@UserDecorator() user: UserRequest) {
    const tokenData = this.authService.logout(user.refreshTokenId ?? '');

    return fillObject(LoggedUserRdo, tokenData);
  }

  @Get('verify-email')
  @ApiResponse({
    status: HttpStatus.FOUND,
    description: 'Редирект на фронт со статусом верификации',
  })
  public async verifyEmail(@Query('token') token: string, @Res() res: Response): Promise<void> {
    const publicUrl =
      this.configService.get<string>('mail.shopUrl') || 'http://localhost:4200';
    const trimmed = publicUrl.replace(/\/$/, '');

    if (!token) {
      return res.redirect(`${trimmed}/verify-email?status=failed&reason=NOT_FOUND`);
    }

    const result = await this.emailVerificationService.verifyToken(token);

    if (result.ok === true) {
      await this.userService.setEmailVerified(result.userId);
      return res.redirect(`${trimmed}/verify-email?status=success`);
    }

    return res.redirect(`${trimmed}/verify-email?status=failed&reason=${result.reason}`);
  }

  @Post('resend-verification')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Письмо отправлено повторно (если такой пользователь существует и не верифицирован).',
  })
  public async resendVerification(@Body() dto: ResendVerificationDto): Promise<{ message: string }> {
    const message = 'Если такой пользователь существует и его email не подтверждён, мы отправили письмо повторно.';

    const identifier = (dto.identifier ?? '').trim();
    if (!identifier) {
      return { message };
    }

    const user = await this.userService.getUserByLoginOrEmail(identifier);

    if (user && user.email && user.emailVerified === false) {
      this.emailVerificationService
        .issueAndSend(user)
        .catch((error) => this.logger.error('Не удалось отправить письмо повторно', error as Error));
    }

    return { message };
  }
}
