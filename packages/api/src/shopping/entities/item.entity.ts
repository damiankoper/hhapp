import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsISO8601, IsNumber, IsString } from 'class-validator';
import { User } from 'src/user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Category } from './category.entity';
import { Shop } from './shop.entity';

@Entity()
export class Item {
  @PrimaryGeneratedColumn() id: number;

  @ApiProperty({ required: true })
  @IsString()
  @Column()
  name: string;

  @ApiProperty({ required: true })
  @IsNumber()
  @Column()
  price: number;

  @ApiProperty({ required: true })
  @IsNumber()
  @Column()
  quantity: number;

  @ApiProperty({ required: true })
  @IsNumber()
  @Column()
  unitDiscount: number;

  @ApiProperty({ required: true })
  @IsISO8601()
  @Column()
  date: Date;

  @ApiProperty({ required: true })
  @IsBoolean()
  @Column()
  shared: boolean;

  @ManyToOne(() => Category, (category) => category.items)
  category: Category;

  @ManyToOne(() => Shop, (shop) => shop.items)
  shop: Shop;

  @ManyToOne(() => User)
  boughtBy: User;

  @ManyToOne(() => User)
  boughtFor: User;
}
