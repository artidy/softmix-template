import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class LoggedUserRdo {
  @ApiProperty({
    description: 'Токен доступа к закрытой части сайта.',
    required: true,
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  })
  @Expose()
  public accessToken: string;

  @ApiProperty({
    description: 'Токен обновления для токена доступа.',
    required: true,
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  })

  @Expose()
  public refreshToken: string;

  @Expose()
  public expiresIn: number;
}
