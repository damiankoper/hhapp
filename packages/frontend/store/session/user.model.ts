import { Expose } from 'class-transformer'

export enum Sex {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

@Expose()
export default class User {
  id?: number
  firstname = ''
  surname = ''
  color = '#bada55'
  sex: Sex = Sex.MALE
}
