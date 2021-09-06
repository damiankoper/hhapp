import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, In, Repository } from 'typeorm';
import { Item } from '../entities/item.entity';
import MiniSearch from 'minisearch';
import { Counters } from 'src/dashboard/interfaces/counters.interface';
import { DateTime } from 'luxon';
import { ChartData, ChartDataset } from 'chart.js';
import { User } from 'src/user/entities/user.entity';
import Color from 'color';
import { Category } from '../entities/category.entity';

type ExpenseData = { x: string; y: number };

export interface Debt {
  from: User;
  to: User;
  debt: number;
}
@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(Item) private readonly itemRepository: Repository<Item>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  public async autocomplete(
    name: string,
    n: number,
    shopId?: number,
  ): Promise<Item[]> {
    if (name.length) {
      const fields = ['id', 'name'];

      const namesBuilder = this.itemRepository
        .createQueryBuilder('item')
        .select([...fields]);

      if (shopId) namesBuilder.where('"shopId" = :shopId', { shopId });

      const names: {
        id: number;
        name: string;
      }[] = await namesBuilder.getRawMany();

      const miniSearch = new MiniSearch({ fields: ['name'] });
      miniSearch.addAll(names);

      const results = miniSearch.search(name, { fuzzy: 0.4 });

      const sliced = results.slice(0, n).map((r) => r.id);

      const items = await this.itemRepository.find({
        relations: ['category', 'shop', 'boughtBy', 'boughtFor'],
        where: {
          id: In(sliced),
        },
      });
      const sorted = items.sort(function (a, b) {
        return +b.date - +a.date;
      });

      return sorted;
    }
    return [];
  }

  public async getMonthly(
    from: DateTime,
    to: DateTime,
  ): Promise<ChartData<'line', ExpenseData[]>> {
    const dataset: ChartDataset<'line', ExpenseData[]> = {
      data: [],
    };
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
      dataset.data.push({ x: fromLoop.toISODate(), y: item.sum });
      fromLoop = fromLoop.plus({ months: 1 });
    } while (to.diff(fromLoop, 'months').months >= 0);

    return { datasets: [dataset] };
  }

  public async getByUser(
    from: DateTime,
    to: DateTime,
  ): Promise<ChartData<'line', ExpenseData[]>> {
    const datasets: ChartDataset<'line', ExpenseData[]>[] = [];
    for (const user of await this.userRepository.find()) {
      const color = Color(user.color);
      const dataset: ChartDataset<'line', ExpenseData[]> = {
        data: [],
        backgroundColor: color.fade(0.8).string(),
        borderColor: color.string(),
        label: `${user.firstname} ${user.surname}`,
      };
      let fromLoop = from;
      do {
        const item: { sum: number } = (await this.itemRepository
          .createQueryBuilder('item')
          .select(['sum((price-"unitDiscount")*quantity) as sum'])
          .groupBy("date_trunc('month', date)")
          .where("date_trunc('month', date) = :date", {
            date: fromLoop.toISODate(),
          })
          .andWhere('"boughtById" = :id', { id: user.id })
          .getRawOne()) || { sum: 0 };
        dataset.data.push({ x: fromLoop.toISODate(), y: item.sum });
        fromLoop = fromLoop.plus({ months: 1 });
      } while (to.diff(fromLoop, 'months').months >= 0);

      datasets.push(dataset);
    }
    return { datasets };
  }

  public async getByCategory(
    from: DateTime,
    to: DateTime,
  ): Promise<ChartData<'bar'>> {
    const categories = await this.categoryRepository.find({
      select: ['id', 'name'],
    });
    const datasets: ChartDataset<'bar'>[] = [];
    const users = await this.userRepository.find();

    for (const user of users) {
      const color = Color(user.color);
      const dataset: ChartDataset<'bar'> = {
        data: [],
        backgroundColor: color.fade(0.8).string(),
        borderColor: color.string(),
        label: `${user.firstname} ${user.surname}`,
      };
      for (const category of categories) {
        const item: { sum: number } = (await this.itemRepository
          .createQueryBuilder('item')
          .select(['sum((price-"unitDiscount")*quantity) as sum'])
          .groupBy('"categoryId"')
          .where('"categoryId" = :categoryId', { categoryId: category.id })
          .andWhere('"boughtById" = :userId', { userId: user.id })
          .andWhere("date_trunc('month', date) BETWEEN :from AND :to", {
            from: from.toISODate(),
            to: to.toISODate(),
          })
          .getRawOne()) || { sum: 0 };
        dataset.data.push(item.sum);
      }
      datasets.push(dataset);
    }
    return {
      labels: categories.map((c) => c.name),
      datasets,
    };
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

    const nowDateMonth = now.startOf('month');
    const lastDateMonth = now.startOf('month').minus({ months: 1 });

    for (const item of items) {
      const date = DateTime.fromJSDate(item.date);
      if (date.equals(nowDateMonth)) {
        thisMonth = item.sum;
        isLastMonthNow = true;
      }
      if (date.equals(lastDateMonth)) {
        lastMonth = item.sum;
      }
    }

    if (isLastMonthNow) items.shift();

    const sum = items.reduce((a, b) => +a + +b.sum, 0);
    return {
      avgMonth: sum / items.length,
      lastMonth,
      thisMonth,
    };
  }

  public async getDebts(date: DateTime) {
    const users = await this.userRepository.find();
    /** Who, for whom, how much */
    const debts = new Map<number, Map<number, number>>();
    users.forEach((user) => debts.set(user.id, new Map<number, number>()));

    const items = await this.itemRepository.find({
      relations: ['boughtBy', 'boughtFor'],
      where: {
        date: Between(
          date.startOf('month').toISODate(),
          date.endOf('month').toISODate(),
        ),
      },
    });

    for (const item of items) {
      const sum = (+item.price - +item.unitDiscount) * +item.quantity;
      if (item.shared) {
        const part = sum / users.length;
        const debtUsers = users.filter((u) => u.id !== item.boughtBy.id);
        debtUsers.forEach((u) => {
          const vDebtor = debts.get(u.id).get(item.boughtBy.id) || 0;
          debts.get(u.id).set(item.boughtBy.id, part + vDebtor);
          const vCreditor = debts.get(item.boughtBy.id).get(u.id) || 0;
          debts.get(item.boughtBy.id).set(u.id, -part + vCreditor);
        });
      } else if (item.boughtBy.id !== item.boughtFor.id) {
        const vDebtor = debts.get(item.boughtFor.id).get(item.boughtBy.id) || 0;
        debts.get(item.boughtFor.id).set(item.boughtBy.id, sum + vDebtor);
        const vCreditor =
          debts.get(item.boughtBy.id).get(item.boughtFor.id) || 0;
        debts.get(item.boughtBy.id).set(item.boughtFor.id, -sum + vCreditor);
      }
    }

    const debtsResult: Debt[] = [];
    debts.forEach((forWhom, who) => {
      forWhom.forEach((howMuch, forWhom) => {
        if (howMuch > 0) {
          debtsResult.push({
            from: users.find((u) => u.id === who),
            to: users.find((u) => u.id === forWhom),
            debt: howMuch,
          });
        }
      });
    });

    return debtsResult;
  }
}
