import { Expose } from 'class-transformer'

export enum Sex {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export const SexValues = [
  { text: 'Male', value: Sex.MALE },
  { text: 'Female', value: Sex.FEMALE },
]

@Expose()
export default class User {
  id?: number
  firstname = ''
  surname = ''
  password?: string
  color = '#0197F6'
  sex: Sex = Sex.MALE
}

export class FormUser extends User {
  username?: string = ''
  password?: string = ''
  passRepeat?: string = ''
}
