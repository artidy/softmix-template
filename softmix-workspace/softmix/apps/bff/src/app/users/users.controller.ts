import { Body, Controller, Get, HttpCode, HttpStatus, Post, Headers, Param, Patch, Delete } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginUser, UrlPaths } from '@project-lib/shared-types';
import { MongoidValidationPipe } from '@project-lib/core';

import { UsersService } from './users.service';

@ApiTags(UrlPaths.Users)
@Controller(UrlPaths.Users)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiResponse({
    status: HttpStatus.OK, description: 'Вы успешно получили данные'
  })
  @Get(`${UrlPaths.Auth}/${UrlPaths.Verify}`)
  @HttpCode(HttpStatus.OK)
  public async verify(@Headers() headers) {
    return this.usersService.verify(headers);
  }

  @ApiResponse({
    status: HttpStatus.OK, description: 'Вы успешно получили данные'
  })
  @Get('')
  @HttpCode(HttpStatus.OK)
  public async index(@Headers() headers) {
    return this.usersService.getAll(headers);
  }

  @ApiResponse({
    status: HttpStatus.OK, description: 'Вы успешно получили данные'
  })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  public async getById(@Param('id') id: string, @Headers() headers) {
    return this.usersService.getById(id, headers);
  }

  @ApiResponse({
    status: HttpStatus.OK, description: 'Вы успешно авторизовались'
  })
  @Post(UrlPaths.Login)
  @HttpCode(HttpStatus.OK)
  public async login(@Body() user: LoginUser, @Headers() headers) {
    return this.usersService.login(user, headers);
  }

  @ApiResponse({
    status: HttpStatus.OK, description: 'Вы успешно обновили данные'
  })
  @Patch(':userId')
  @HttpCode(HttpStatus.OK)
  public async update(@Param('userId', MongoidValidationPipe) userId: string, @Body() updateData, @Headers() headers) {
    return this.usersService.update(userId, updateData, headers);
  }

  @ApiResponse({
    status: HttpStatus.CREATED, description: 'Новый пользователь создан'
  })
  @Post(UrlPaths.Register)
  @HttpCode(HttpStatus.CREATED)
  public async create(@Body() user, @Headers() headers) {
    return this.usersService.register(user, headers);
  }

  @ApiResponse({
    status: HttpStatus.OK, description: 'Токены доступа обновлены'
  })
  @Get(`${UrlPaths.Auth}/${UrlPaths.Refresh}`)
  @HttpCode(HttpStatus.OK)
  public async refresh(@Headers() headers) {
    return this.usersService.refresh(headers);
  }

  @ApiResponse({
    status: HttpStatus.NO_CONTENT, description: 'Пользователь успешно удален'
  })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Headers() headers, @Param('id', MongoidValidationPipe) id: string) {
    await this.usersService.delete(headers, id);
  }

  @ApiResponse({
    status: HttpStatus.NO_CONTENT, description: 'Пользователь вышел'
  })
  @Delete(`${UrlPaths.Auth}/${UrlPaths.Logout}`)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async logout(@Headers() headers) {
    await this.usersService.logout(headers);
  }
}
