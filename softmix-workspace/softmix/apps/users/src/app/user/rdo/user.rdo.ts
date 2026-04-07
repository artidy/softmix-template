import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { UserRole } from '@project-lib/shared-types';

export class UserRdo {
  @ApiProperty({
    description: 'Идентификатор пользователя.',
    required: true,
    example: '507f191e810c19729de860ea'
  })
  @Transform(({ obj }) => obj._id.toString())
  @Expose({ name: '_id'})
  public id: string;

  @ApiProperty({
    description: 'Имя пользователя.',
    required: true,
    example: 'Иван'
  })
  @Expose()
  public name: string;

  @ApiProperty({
    description: 'Уникальное имя для авторизации на сайте.',
    required: true,
    example: 'admin'
  })
  @Expose()
  public login: string;

  @ApiProperty({
    description: 'Роль пользователя.',
    required: true,
    example: UserRole.User
  })
  @Expose()
  public role: UserRole;

  @ApiProperty({
    description: 'Дата регистрации.',
    required: true,
    example: '20230211'
  })
  @Expose()
  public createdAt: Date;
}
