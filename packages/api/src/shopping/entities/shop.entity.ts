import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Item } from './item.entity';

@Entity()
export class Shop {
  @PrimaryGeneratedColumn() id: number;

  @ApiProperty({ required: true })
  @IsString()
  @Column()
  name: string;

  @OneToMany(() => Item, (item) => item.shop)
  items: Item[];
}
