import { Module } from '@nestjs/common';
import { UserCrudService } from './user-crud/user-crud.service';
import { UserCrudController } from './user-crud/user-crud.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserCrudService, UserService],
  controllers: [UserCrudController],
  exports: [UserService, TypeOrmModule.forFeature([User])],
})
export class UserModule {}
