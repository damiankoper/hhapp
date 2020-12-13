import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import * as bcryptjs from 'bcryptjs';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class User {
  @PrimaryGeneratedColumn() id: number;

  @ApiProperty()
  @Column()
  firstname: string;

  @ApiProperty()
  @Column()
  surname: string;

  @ApiProperty()
  @Column()
  username: string;

  @ApiProperty()
  @Column({ select: false })
  password?: string;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (this.password) {
      const salt = await bcryptjs.genSalt();
      this.password = await bcryptjs.hash(this.password, salt);
    }
  }
}
