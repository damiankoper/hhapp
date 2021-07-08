import { QuerySortOperator, RequestQueryBuilder } from '@nestjsx/crud-request'
import { ref, watch, useContext } from '@nuxtjs/composition-api'
import { ClassConstructor, plainToClass } from 'class-transformer'
import { DataOptions } from 'vuetify'
import { snackbarStore } from '~/store'
export function useDatatable<T>(entity: ClassConstructor<T>, baseUrl: string) {
  const { $axios } = useContext()
  const items = ref<T[]>([])
  const options = ref<DataOptions>({
    page: 1,
    itemsPerPage: 10,
    sortBy: [],
    sortDesc: [],
    groupBy: [],
    groupDesc: [],
    multiSort: false,
    mustSort: false,
  })
  const serverItemsLength = ref(0)
  const loading = ref(false)

  async function fetch() {
    loading.value = true
    const qb = new RequestQueryBuilder()
    qb.setPage(options.value.page)

    options.value.sortBy.forEach((field, i) => {
      let direction: QuerySortOperator = 'ASC'
      if (options.value.sortDesc)
        direction = options.value.sortDesc[i] ? 'DESC' : 'ASC'
      qb.sortBy({ field, order: direction })
    })

    if (options.value.itemsPerPage >= 0) qb.setLimit(options.value.itemsPerPage)

    try {
      const response = await $axios.get(`${baseUrl}?${qb.query()}`)
      const data = response.data
      items.value = plainToClass(entity, data.data) as any
      serverItemsLength.value = data.total
      loading.value = false
    } catch {
      snackbarStore.showError('Error while loading data!')
    }
  }

  watch(options, () => fetch())

  return {
    items,
    options,
    serverItemsLength,
    loading,
    fetch,
  }
}
