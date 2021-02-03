import { Context } from '@nuxt/types'
import { sessionStore } from '~/store'
export default function ({ route, redirect, req }: Context) {
  if (!sessionStore.isLoggedIn) {
    if (route.path !== '/') return redirect('/')
  } else if (!route.path.startsWith('/app')) {
    return redirect('/app')
  }
}
