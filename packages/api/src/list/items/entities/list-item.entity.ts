import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';
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

  @ManyToOne(() => List, { onDelete: 'CASCADE', nullable: false })
  list: List;
}
