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
import { ItemService } from './item/item.service';
import { ItemController } from './item/item.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Shop, Category, Item])],
  providers: [
    CategoryCrudService,
    ShopCrudService,
    ItemCrudService,
    ItemService,
  ],
  controllers: [
    CategoryCrudController,
    ShopCrudController,
    ItemController,
    ItemCrudController,
  ],
  exports: [TypeOrmModule.forFeature([Shop, Category, Item]), ItemService],
})
export class ShoppingModule {}
