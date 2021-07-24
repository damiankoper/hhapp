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
export class User {
  id?: number = undefined
  firstname  = undefined
  surname  = undefined
  password?: string = undefined
  color = '#0197F6'
  sex: Sex = Sex.MALE
}

export class FormUser extends User {
  username?: string  = undefined
  password?: string  = undefined
  passRepeat?: string  = undefined
}
