import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Item } from '../entities/item.entity';
import MiniSearch from 'minisearch';
import { Counters } from 'src/dashboard/interfaces/counters.interface';
import { DateTime } from 'luxon';
import { ChartData } from 'chart.js';
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

  public async getMonthly(
    from: DateTime,
    to: DateTime,
  ): Promise<ChartData<'line'>> {
    const dataset = { data: [] };
    let fromLoop = from;
    do {
      const item: { sum: number } = (await this.itemRepository
        .createQueryBuilder('item')
        .select(['sum((price-"unitDiscount")*quantity) as sum'])
        .groupBy("date_trunc('month', date)")
        .where("date_trunc('month', date) = :date", {
          date: fromLoop.toISODate(),
        })
        .getRawOne()) || { sum: 0 };
      dataset.data.push({ x: fromLoop.toFormat('yyyy-MM'), y: item.sum });
      fromLoop = fromLoop.plus({ month: 1 });
    } while (to.diff(fromLoop, 'month').months >= 0);

    return { datasets: [dataset] };
  }

  public async getCounters(now: DateTime): Promise<Counters> {
    const items: { sum: number; date: Date }[] = await this.itemRepository
      .createQueryBuilder('item')
      .select([
        'sum((price-"unitDiscount")*quantity) as sum',
        "date_trunc('month', date) as date",
      ])
      .groupBy("date_trunc('month', date)")
      .orderBy("date_trunc('month', date)", 'DESC')
      .getRawMany();

    let thisMonth = 0;
    let lastMonth = 0;
    let isLastMonthNow = false;

    if (items.length >= 1) {
      const last = DateTime.fromJSDate(items[0].date);
      const date = now.startOf('month');
      if (last.equals(date)) {
        thisMonth = items[0].sum;
        isLastMonthNow = true;
      }

      if (items.length >= 2) {
        const last = DateTime.fromJSDate(items[1].date);
        const date = now.startOf('month').minus({ months: 1 });
        if (last.equals(date)) {
          lastMonth = items[1].sum;
        }
      }

      if (isLastMonthNow) items.shift();
    }

    const sum = items.reduce((a, b) => a + b.sum, 0);
    return {
      avgMonth: sum / items.length,
      lastMonth,
      thisMonth,
    };
  }
}
