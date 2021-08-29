import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Color from 'color';
import { readFileSync } from 'fs';
import { DateTime } from 'luxon';
import { Command, Positional } from 'nestjs-command';
import { resolve } from 'path';
import { Category } from 'src/shopping/entities/category.entity';
import { Item } from 'src/shopping/entities/item.entity';
import { Shop } from 'src/shopping/entities/shop.entity';
import { User } from 'src/user/entities/user.entity';
import { Sex } from 'src/user/enums/sex.enum';
import { Repository } from 'typeorm';

@Injectable()
export class MigrationCommand {
  constructor(
    @InjectRepository(User)
    readonly userRepository: Repository<User>,
    @InjectRepository(Category)
    readonly categoryRepository: Repository<Category>,
    @InjectRepository(Shop)
    readonly shopRepository: Repository<Shop>,
    @InjectRepository(Item)
    readonly itemRepository: Repository<Item>,
  ) {}

  @Command({
    command: 'migrate <csvDir>',
    autoExit: true,
  })
  async migrate(
    @Positional({
      name: 'csvDir',
      describe: 'path to dir with csv files from old DB',
      type: 'string',
    })
    csvDir: string,
  ) {
    const oldUsers = readFileSync(resolve(csvDir, 'Members.txt')).toString(
      'utf8',
    );
    const oldCategories = readFileSync(
      resolve(csvDir, 'Categories.txt'),
    ).toString('utf8');
    const oldShops = readFileSync(resolve(csvDir, 'Shops.txt')).toString(
      'utf8',
    );
    const oldItems = readFileSync(resolve(csvDir, 'Items.txt')).toString(
      'utf8',
    );

    await this.userRepository.manager.query(
      'TRUNCATE "user" RESTART IDENTITY CASCADE;',
    );
    await this.userRepository.manager.query(
      'TRUNCATE "category" RESTART IDENTITY CASCADE;',
    );
    await this.userRepository.manager.query(
      'TRUNCATE "shop" RESTART IDENTITY CASCADE;',
    );
    await this.userRepository.manager.query(
      'TRUNCATE "item" RESTART IDENTITY CASCADE;',
    );

    const s = oldUsers
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    for (const rawUser of s) {
      const user = new User();
      user.password = 'password';
      const props = rawUser.split(',').map((p) => p.replace(/"/g, ''));
      user.username = props[1].toLowerCase() + props[2].toLowerCase();
      user.id = Number(props[0]);
      user.firstname = props[1];
      user.surname = props[2];
      user.color = props[3];
      user.sex = Sex.MALE;
      await this.userRepository.save(user);
    }

    const c = oldCategories
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    for (const rawCategory of c) {
      const category = new Category();
      const props = rawCategory.split(',').map((p) => p.replace(/"/g, ''));
      category.id = Number(props[0]);
      category.icon = 'mdi-progress-question';
      category.color = '#' + Math.floor(Math.random() * 16777215).toString(16);
      category.name = props[1];
      category.sharedByDefault = +props[2] === 1;
      await this.categoryRepository.save(category);
    }

    const sh = oldShops
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    console.log(sh);

    for (const rawShop of sh) {
      const shop = new Shop();
      const props = rawShop.split(',').map((p) => p.replace(/"/g, ''));
      shop.id = Number(props[0]);
      shop.name = props[1];
      await this.shopRepository.save(shop);
    }

    const i = oldItems
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    for (const rawItem of i) {
      const item = new Item();
      const props = rawItem.split(',').map((p) => p.replace(/"/g, ''));
      item.id = Number(props[0]);
      item.name = props[1];
      item.price = props[2];
      item.quantity = props[3];
      item.unitDiscount = props[4];
      item.date = DateTime.fromSQL(props[5]).toJSDate();
      item.shared = +props[6] == 1;
      item.shop = { id: Number(props[7]) } as Shop;
      item.category = { id: Number(props[8]) } as Category;
      item.boughtBy = { id: Number(props[9]) } as User;
      item.boughtFor = item.shared ? null : ({ id: Number(props[9]) } as User);

      await this.itemRepository.save(item);
    }
  }
}
