import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsHexColor, IsString } from 'class-validator';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Item } from './item.entity';
@Entity()
export class Category {
  @PrimaryGeneratedColumn() id: number;

  @ApiProperty({ required: true })
  @IsString()
  @Column()
  name: string;

  @ApiProperty({ required: true })
  @IsString()
  @Column()
  icon: string;

  @ApiProperty({ required: false, default: '#ffffff' })
  @Column({ default: '#ffffff' })
  @IsHexColor()
  color: string;

  @ApiProperty({ default: false })
  @IsBoolean()
  @Column()
  sharedByDefault: boolean;

  @OneToMany(() => Item, (item) => item.category)
  items: Item[];
}
