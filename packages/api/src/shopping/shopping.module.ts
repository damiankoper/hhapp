import { Module } from '@nestjs/common';
import { CategoryCrudService } from './category-crud/category-crud.service';
import { CategoryCrudController } from './category-crud/category-crud.controller';
import { ShopCrudService } from './shop-crud/shop-crud.service';
import { ShopCrudController } from './shop-crud/shop-crud.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shop } from './entities/shop.entity';
import { Category } from './entities/category.entity';
import { ItemCrudService } from './item-crud/item-crud.service';
import { ItemCrudController } from './item-crud/item-crud.controller';
import { Item } from './entities/item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Shop, Category, Item])],
  providers: [CategoryCrudService, ShopCrudService, ItemCrudService],
  controllers: [CategoryCrudController, ShopCrudController, ItemCrudController],
  exports: [TypeOrmModule.forFeature([Shop, Category, Item])],
})
export class ShoppingModule {}
