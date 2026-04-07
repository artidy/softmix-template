import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseFilters,
  UseGuards
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  EditDataForbiddenException,
  fillObject,
  HttpExceptionFilter,
  MongoidValidationPipe,
  UserDecorator
} from '@project-lib/core';
import { UrlPaths, UserRequest, UserRole } from '@project-lib/shared-types';

import { UserService } from './user.service';
import { UserRdo } from './rdo/user.rdo';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@UseFilters(HttpExceptionFilter)
@ApiTags(UrlPaths.Users)
@Controller(UrlPaths.Users)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: HttpStatus.OK, description: 'Вы успешно получили данные'
  })
  @Get()
  @HttpCode(HttpStatus.OK)
  public async index(@UserDecorator() userRequest: UserRequest) {
    if (userRequest.role !== UserRole.Admin) {
      throw new EditDataForbiddenException();
    }

    const users = await this.userService.getAll();

    return fillObject(UserRdo, users);
  }

  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: HttpStatus.OK, description: 'Вы успешно получили данные'
  })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  public async getById(@Param('id', MongoidValidationPipe) id: string, @UserDecorator() userRequest: UserRequest) {
    if (userRequest.role !== UserRole.Admin && userRequest.id !== id) {
      throw new EditDataForbiddenException();
    }

    const user = await this.userService.getUserById(id);

    return fillObject(UserRdo, user);
  }

  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: HttpStatus.CREATED, description: 'Новый пользователь создан'
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  public async create(@Body() dto: CreateUserDto, @UserDecorator() userRequest: UserRequest) {
    if (userRequest.role !== UserRole.Admin) {
      throw new EditDataForbiddenException();
    }

    const user = await this.userService.create(dto);

    return fillObject(UserRdo, user);
  }

  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: HttpStatus.OK, description: 'Проверка пользователя прошла успешно'
  })
  @Get(UrlPaths.Verify)
  public async verify(@UserDecorator() userRequest: UserRequest) {
    const user = await this.userService.getUserById(userRequest.id);

    return fillObject(UserRdo, user);
  }

  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: HttpStatus.OK, description: 'Данные пользователя успешно обновлены'
  })
  @Patch(':id')
  public async patch(@Param('id', MongoidValidationPipe) id: string,
                     @Body() dto: UpdateUserDto, @UserDecorator() userRequest: UserRequest) {
    if (userRequest.id !== id && userRequest.role !== UserRole.Admin) {
      throw new EditDataForbiddenException();
    }

    if (userRequest.id === id && dto.role) {
      delete dto.role;
    }

    const user = await this.userService.update(id, dto);

    return fillObject(UserRdo, user);
  }

  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: HttpStatus.NO_CONTENT, description: 'Пользователь успешно удален'
  })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Param('id', MongoidValidationPipe) id: string, @UserDecorator() userRequest: UserRequest) {
    if (id === userRequest.id || userRequest.role !== UserRole.Admin) {
      throw new EditDataForbiddenException();
    }

    await this.userService.delete(id);
  }
}
