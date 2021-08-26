import { Expose, Type } from 'class-transformer'
import { ListItem } from './list-item'
import { Shop } from './shop.model'
import { User } from './user.model'

@Expose()
export class List {
  id?: number = undefined
  createdAt?: Date
  updatedAt?: Date

  name: string = ''

  @Type(() => ListItem)
  items: ListItem[] = [new ListItem(), new ListItem(), new ListItem()]

  @Type(() => Shop)
  shop: Shop | null = null

  @Type(() => User)
  createdBy?: User = undefined
}
