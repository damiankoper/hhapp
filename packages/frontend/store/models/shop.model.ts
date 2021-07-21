import { Expose } from 'class-transformer'

@Expose()
export class Shop {
  id?: number
  name = ''
  items = [] // TODO: transform nested
}
