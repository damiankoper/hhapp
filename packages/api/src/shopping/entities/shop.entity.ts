import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Shop {
  @PrimaryGeneratedColumn() id: number;

  @ApiProperty({ required: true })
  @IsString()
  @Column()
  name: string;
}
