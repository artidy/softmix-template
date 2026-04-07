import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { FileApi } from '@project-lib/shared-types';

export class ProductImageRdo implements FileApi {
  @ApiProperty({
    description: 'Идентификатор пользователя.',
    required: true,
    example: '507f191e810c19729de860ea'
  })
  @Transform(({ obj }) => obj._id.toString())
  @Expose({ name: '_id'})
  public id: string;

  @ApiProperty({
    description: 'Имя файла изображения товара',
    example: '1.jpg'
  })
  @Expose()
  name: string;

  @ApiProperty({
    description: 'Идентификатор товара',
    example: 'Jsjkdhs-23sdwrw-2321dasd-kln23'
  })
  @Expose()
  ownerId: string;

  @ApiProperty({
    description: 'Адрес изображения товара',
    example: 'files/path'
  })
  @Expose()
  public url: string;
}
