import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsString } from 'class-validator';
import { List } from 'src/list/entities/list.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';

@Entity()
export class ListItem {
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
  text: string;

  @ApiProperty({ required: true })
  @IsBoolean()
  @Column()
  checked: boolean;

  @ApiProperty({ readOnly: true })
  @IsNumber()
  @Column()
  order: number;

  @ManyToOne(() => List, (list) => list.items, {
    nullable: false,
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  list: List;
}
