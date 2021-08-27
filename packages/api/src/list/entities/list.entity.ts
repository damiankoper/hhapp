import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Shop } from 'src/shopping/entities/shop.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { ListItem } from '../items/entities/list-item.entity';

@Entity()
export class List {
  @PrimaryGeneratedColumn() id: number;

  @ApiProperty({ readOnly: true })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ readOnly: true })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({ required: true })
  @IsString()
  @Column()
  name: string;

  @OneToMany(() => ListItem, (item) => item.list, {
    cascade: true,
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  items: ListItem[];

  @ManyToOne(() => Shop, { onDelete: 'RESTRICT', nullable: true })
  shop: Shop;

  @ManyToOne(() => User, { onDelete: 'RESTRICT', nullable: false })
  createdBy: User;
}
