import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Category {
  @PrimaryGeneratedColumn() id: number;

  @ApiProperty({ required: true })
  @IsString()
  @Column()
  name: string;

  @ApiProperty({ default: false })
  @IsBoolean()
  @Column()
  sharedByDefault: boolean;
}
