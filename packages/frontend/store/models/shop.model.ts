import { Expose, Type } from 'class-transformer'
import { Item } from './item.model'

@Expose()
export class Shop {
  id?: number = undefined
  name = undefined
  @Type(() => Item)
  items?: Item[] = undefined
}
