import { ref, UnwrapRef, useContext } from '@nuxtjs/composition-api'
import { AxiosError, AxiosRequestConfig } from 'axios'

export function useApi<T>(
  url: string | (() => string),
  params: AxiosRequestConfig | (() => AxiosRequestConfig)
) {
  const { $axios } = useContext()
  const data = ref<T | null>(null)
  const loading = ref(false)
  const err = ref<AxiosError | null>(null)

  async function fetch() {
    loading.value = true
    try {
      const _params = params instanceof Function ? params() : params
      const _url = url instanceof Function ? url() : url

      const response = await $axios.get(_url, _params)
      data.value = response.data as UnwrapRef<T>
    } catch (e) {
      err.value = e as AxiosError
    } finally {
      loading.value = false
    }
  }

  return { fetch, data, loading, err }
}