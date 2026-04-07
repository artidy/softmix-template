import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Post, UseFilters, UseGuards } from '@nestjs/common';
import { fillObject, HttpExceptionFilter, UserDecorator } from '@project-lib/core';
import { UrlPaths, UserRequest } from '@project-lib/shared-types';

import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { LoggedUserRdo } from './rdo/logged-user.rdo';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { RegisterUserDto } from '../user/dto/register-user.dto';
import { UserService } from '../user/user.service';
import { UserRdo } from '../user/rdo/user.rdo';

@UseFilters(HttpExceptionFilter)
@ApiTags(UrlPaths.Auth)
@Controller(UrlPaths.Auth)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService
  ) {}

  @Post(UrlPaths.Register)
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    type: UserRdo,
    status: HttpStatus.CREATED,
    description: 'New user has been successfully created.'
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'User with this login already exists.',
  })
  public async register(@Body() dto: RegisterUserDto) {
    const user = await this.userService.create(dto);
    return fillObject(UserRdo, user);
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
}
