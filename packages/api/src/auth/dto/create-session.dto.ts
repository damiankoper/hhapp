import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateSessionDTO {
  @ApiProperty({ required: true })
  @IsString()
  readonly username: string;

  @ApiProperty({ required: true })
  @IsString()
  readonly password: string;

  @ApiProperty({ example: false, default: false })
  @IsBoolean()
  @IsOptional()
  readonly rememberMe?: boolean;
}
