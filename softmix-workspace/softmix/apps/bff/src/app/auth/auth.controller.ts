import { Body, Controller, Delete, Get, Headers, HttpCode, HttpStatus, Post, Query, Res } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { LoginUser, UrlPaths } from '@project-lib/shared-types';

import { AuthService } from './auth.service';

@ApiTags(UrlPaths.Auth)
@Controller(UrlPaths.Auth)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Новый пользователь создан'
  })
  @Post(UrlPaths.Register)
  @HttpCode(HttpStatus.CREATED)
  public async register(@Body() user, @Headers() headers) {
    return this.authService.register(user, headers);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Вы успешно авторизовались'
  })
  @Post(UrlPaths.Login)
  @HttpCode(HttpStatus.OK)
  public async login(@Body() user: LoginUser, @Headers() headers) {
    return this.authService.login(user, headers);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Токены доступа обновлены'
  })
  @Get(UrlPaths.Refresh)
  @HttpCode(HttpStatus.OK)
  public async refresh(@Headers() headers) {
    return this.authService.refresh(headers);
  }

  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Пользователь вышел'
  })
  @Delete(UrlPaths.Logout)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async logout(@Headers() headers) {
    await this.authService.logout(headers);
  }

  @Get('verify-email')
  public async verifyEmail(@Query('token') token: string, @Res() res: Response): Promise<void> {
    const { redirectUrl } = await this.authService.verifyEmail(token);
    res.redirect(redirectUrl);
  }

  @Post('resend-verification')
  @HttpCode(HttpStatus.OK)
  public async resendVerification(
    @Body() body: { identifier?: string },
    @Headers() headers: Record<string, string>,
  ) {
    return this.authService.resendVerification(body, headers);
  }
}
