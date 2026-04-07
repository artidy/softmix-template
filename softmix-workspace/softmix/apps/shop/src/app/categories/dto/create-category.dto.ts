import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { DtoValidationMessage } from '@project-lib/core';
import { CategoryCreate } from '@project-lib/shared-types';

export class CreateCategoryDto implements CategoryCreate {
  @ApiProperty({
    description: 'Наименование',
    required: true,
    example: "Программное обеспечение"
  })
  @IsNotEmpty({
      message: `${DtoValidationMessage.IsEmpty} поле наименование`
  })
  title: string;

  @ApiProperty({
    description: 'Идентификатор владельца',
    required: false,
    example: "jhjkHDwklwqwe213242lnl2n"
  })
  @IsOptional()
  @IsNotEmpty({
    message: `${DtoValidationMessage.IsEmpty} поле идентификатор владельца`
  })
  ownerId?: string;

  @ApiProperty({
    description: 'Позиция',
    required: false,
    example: 0
  })
  @IsOptional()
  @IsNotEmpty({
    message: `${DtoValidationMessage.IsEmpty} поле позиции`
  })
  position?: number;
}
