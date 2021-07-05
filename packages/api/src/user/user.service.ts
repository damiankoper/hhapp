import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) readonly userRepository: Repository<User>,
  ) {}

  async findOneWithPass(username: string): Promise<User | null> {
    console.trace();
    return this.userRepository
      .createQueryBuilder('user')
      .where({ username })
      .addSelect('user.password')
      .getOne();
  }
}
