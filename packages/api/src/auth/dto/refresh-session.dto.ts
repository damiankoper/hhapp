import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RefreshSessionDTO {
  @ApiProperty({ required: true, example: 'token' })
  @IsString()
  readonly refresh_token: string;
}
