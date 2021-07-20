import { Expose } from 'class-transformer'

@Expose()
export class Category {
  id?: number
  name = ''
  icon = 'mdi-progress-question'
  color = '#bada55'
  sharedByDefault = false
  items = [] // TODO: transform nested
}
