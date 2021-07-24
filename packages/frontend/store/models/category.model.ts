import { Expose, Type } from 'class-transformer'
import { Item } from './item.model'

@Expose()
export class Category {
  id?: number = undefined
  name = undefined
  icon = 'mdi-progress-question'
  color = '#bada55'
  sharedByDefault = false
  @Type(() => Item)
  items?: Item[]
}
