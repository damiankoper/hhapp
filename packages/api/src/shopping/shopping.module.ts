import { Module } from '@nestjs/common';
import { CategoryCrudService } from './category-crud/category-crud.service';
import { CategoryCrudController } from './category-crud/category-crud.controller';
import { ShopCrudService } from './shop-crud/shop-crud.service';
import { ShopCrudController } from './shop-crud/shop-crud.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shop } from './entities/shop.entity';
import { Category } from './entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Shop, Category])],
  providers: [CategoryCrudService, ShopCrudService],
  controllers: [CategoryCrudController, ShopCrudController],
  exports: [TypeOrmModule.forFeature([Shop, Category])],
})
export class ShoppingModule {}
