import { Plugin } from '@nuxt/types'
import { sessionStore } from '~/store'
import { initializeAxios } from '~/utils/api'

export const accessor: Plugin = ({ $axios, redirect }): void => {
  initializeAxios($axios)

  $axios.onError((err) => {
    if (err.response?.status === 401) {
      sessionStore.logout()
      redirect('/')
    }
  })
}

export default accessor
