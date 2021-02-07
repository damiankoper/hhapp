import {
  Action,
  Module,
  Mutation,
  MutationAction,
  VuexModule,
} from 'vuex-module-decorators'
import jwtDecode from 'jwt-decode'
import { plainToClass } from 'class-transformer'
import Cookies from 'js-cookie'
import { Context } from '@nuxt/types'
import Token from './token.model'
import User from './user.model'
import { $axios } from '~/utils/api'

@Module({
  name: 'session',
  stateFactory: true,
  namespaced: true,
})
export default class Session extends VuexModule {
  accessToken: string | null = null
  rememberMe: boolean = false
  sub: number = 0

  user: User | null = null

  get isLoggedIn() {
    return !!this.accessToken
  }

  @Mutation
  setAccessToken(token: string) {
    if (process.browser) localStorage.setItem('access_token', token)
    Cookies.set('access_token', token)
    this.accessToken = token
    $axios.setToken(token, 'Bearer')

    const decoded = plainToClass(Token, jwtDecode(token) as object)
    this.rememberMe = decoded.rememberMe
    this.sub = decoded.sub
  }

  @Mutation
  setUser(user: User) {
    this.user = user
  }

  @Mutation
  logout() {
    if (process.browser) localStorage.removeItem('access_token')
    Cookies.remove('access_token')
    this.accessToken = null
    this.rememberMe = false
    this.user = null
  }

  @Action({ rawError: true, commit: 'setAccessToken' })
  async login({ username, password, rememberMe }: any) {
    const response = await $axios.post('session', {
      username,
      password,
      rememberMe,
    })
    return response.data.access_token
  }

  @Action({ rawError: true, commit: 'setAccessToken' })
  async renew() {
    const response = await $axios.put('session')
    return response.data.access_token
  }

  @Action({ commit: 'setUser' })
  async fetchUser() {
    const response = await $axios.get(`users/${this.sub}`)
    const user = plainToClass(User, response.data)

    return user
  }
}
