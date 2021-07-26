import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsISO8601,
  IsNumberString,
  IsString,
} from 'class-validator';
import { User } from 'src/user/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Category } from './category.entity';
import { Shop } from './shop.entity';

@Entity()
export class Item {
  @PrimaryGeneratedColumn() id: number;

  @ApiProperty({ readOnly: true })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ required: true })
  @IsString()
  @Column()
  name: string;

  @ApiProperty({ required: true })
  @IsNumberString()
  @Column({ type: 'decimal' })
  price: string;

  @ApiProperty({ required: true })
  @IsNumberString()
  @Column({ type: 'decimal' })
  quantity: string;

  @ApiProperty({ required: true })
  @IsNumberString()
  @Column({ type: 'decimal' })
  unitDiscount: string;

  @ApiProperty({ required: true })
  @IsISO8601()
  @Column()
  date: Date;

  @ApiProperty({ required: true })
  @IsBoolean()
  @Column()
  shared: boolean;

  @ManyToOne(() => Category, (category) => category.items, {
    onDelete: 'RESTRICT',
    nullable: false,
  })
  category: Category;

  @ManyToOne(() => Shop, (shop) => shop.items, {
    onDelete: 'RESTRICT',
    nullable: false,
  })
  shop: Shop;

  @ManyToOne(() => User, { onDelete: 'RESTRICT', nullable: false })
  boughtBy: User;

  @ManyToOne(() => User, { onDelete: 'RESTRICT', nullable: true })
  boughtFor: User;
}
