import { Context } from '@nuxt/types'
import cookieparser from 'cookieparser'
import { sessionStore } from '~/store'
export default function ({ route, redirect, req }: Context) {
  // recover session
  const token = process.browser
    ? localStorage.getItem('access_token')
    : cookieparser.parse(req.headers.cookie).access_token

  if (token) sessionStore.setAccessToken(token)

  if (!sessionStore.isLoggedIn) {
    if (route.path !== '/') return redirect('/')
  } else if (!route.path.startsWith('/app')) {
    return redirect('/app')
  } else {
    sessionStore.renew()
  }

  // TODO: refresh when first load
}
