import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Item } from '../entities/item.entity';
import MiniSearch from 'minisearch';

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(Item) private readonly itemRepository: Repository<Item>,
  ) {}

  public async autocomplete(name: string, n: number): Promise<Item[]> {
    if (name.length) {
      const fields = ['id', 'name'];
      const names: {
        name: string;
      }[] = await this.itemRepository
        .createQueryBuilder('item')
        .select([...fields, 'date'])
        .orderBy('date', 'DESC')
        .distinct()
        .getRawMany();

      const miniSearch = new MiniSearch({
        fields: fields,
        storeFields: fields,
      });
      miniSearch.addAll(names);
      const results = miniSearch.search(name, { fuzzy: 0.5 }).map((r) => r.id);

      const items = this.itemRepository.find({
        relations: ['category', 'shop', 'boughtBy', 'boughtFor'],
        where: {
          id: In(results),
        },
      });

      return (await items).sort(function (a, b) {
        return results.indexOf(a.id) - results.indexOf(b.id);
      });
    }
    return [];
  }
}
