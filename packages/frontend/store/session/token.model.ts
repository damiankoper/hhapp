import { Type } from 'class-transformer'
import User from './user.model'

export default class Token {
  @Type(() => User)
  user!: User

  rememberMe!: boolean
}
