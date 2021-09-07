import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import * as bcryptjs from 'bcryptjs';
import { ApiProperty } from '@nestjs/swagger';
import { IsHexColor, IsString } from 'class-validator';
import { Sex } from '../enums/sex.enum';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn() id: number;

  @ApiProperty({ required: true })
  @IsString()
  @Column()
  firstname: string;

  @ApiProperty({ required: true })
  @IsString()
  @Column()
  surname: string;

  @ApiProperty({ required: true })
  @IsString()
  @Column()
  username: string;

  @ApiProperty({ required: true })
  @IsString()
  @Column({ select: false })
  password?: string;

  @ApiProperty({ required: false, default: '#ffffff' })
  @Column({ default: '#ffffff' })
  @IsHexColor()
  color: string;

  @ApiProperty({ required: false, enum: Sex, default: Sex.MALE })
  @Column({ type: 'enum', enum: Sex, default: Sex.MALE })
  sex: Sex;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (this.password) {
      const salt = await bcryptjs.genSalt();
      this.password = await bcryptjs.hash(this.password, salt);
    }
  }
}
