import { Expose, Transform } from 'class-transformer'
import { DateTime } from 'luxon'
import { Category } from './category.model'
import { Shop } from './shop.model'
import { User } from './user.model'
@Expose()
export class Item {
  id?: number = undefined
  name?: string = undefined

  price?: number = undefined
  quantity?: number = undefined
  unitDiscount?: number = 0

  @Transform(({ value }) => DateTime.fromISO(value).toISODate(), {})
  date?: string = DateTime.now().toISODate()

  category?: Category = undefined
  shop?: Shop = undefined
  shared = false
  boughtBy?: User = undefined
  boughtFor?: User = undefined
}
