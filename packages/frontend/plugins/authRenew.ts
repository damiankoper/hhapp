import { Plugin } from '@nuxt/types'
import cookieparser from 'cookieparser'
import { sessionStore } from '~/store'

export const authRenew: Plugin = ({ req }: any): void => {
  const token = process.browser
    ? localStorage.getItem('access_token')
    : cookieparser.parse(req.headers.cookie).access_token

  if (token) sessionStore.setAccessToken(token)

  if (process.browser) {
    sessionStore.renew()
  }
}

export default authRenew
