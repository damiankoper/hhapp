import { Expose, Type } from 'class-transformer'
import { List } from './list.model'

@Expose()
export class ListItem {
  id?: number = undefined
  createdAt?: Date
  updatedAt?: Date

  text: string = ''
  checked = false
  order = 0

  @Type(() => List)
  list?: List | null
}
