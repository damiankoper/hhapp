import { RequestQueryBuilder } from '@nestjsx/crud-request'
import { computed, Ref, ref, useContext } from '@nuxtjs/composition-api'
import { AxiosError } from 'axios'
import { ClassConstructor, plainToClass } from 'class-transformer'
import _ from 'lodash'
import { snackbarStore } from '~/store'
export function useCrud<T>(
  url: string,
  entity: ClassConstructor<T>,
  entityName: string,
  onSuccess: (msg: string) => void = snackbarStore.showSuccess,
  onError: (msg: string) => void = snackbarStore.showError
) {
  const { $axios } = useContext()
  const loading = ref(false)
  const error = ref(false)

  const findOneResult = ref<T>()
  const findManyResult = ref<T[]>([]) as unknown as Ref<T[]>

  const actionWrapper = async (
    cb: () => Promise<void>,
    success: (e: string) => string,
    error: (e: string) => string
  ) => {
    try {
      loading.value = true
      await cb()
      onSuccess(success(entityName))
    } catch (e) {
      const response = (e as AxiosError).response
      if (response?.status === 409) {
        onError(
          'Cannot perform this action because of conflict with other entities!'
        )
      } else onError(error(entityName))
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    findOneResult,
    findManyResult,
    createUrl: computed(() => `/app/${url}/create`),

    showOne(id: number) {
      return `/app/${url}/${id}`
    },

    async findOne(
      id: number,
      qbFn: (qb: RequestQueryBuilder) => void = () => {}
    ) {
      const qb = new RequestQueryBuilder()
      qbFn(qb)
      loading.value = true
      const response = await $axios.get(`${url}/${id}?${qb.query()}`)
      const model = plainToClass(entity, response.data)
      findOneResult.value = model
      loading.value = false
    },

    async findMany(qbFn: (qb: RequestQueryBuilder) => void = () => {}) {
      const qb = new RequestQueryBuilder()
      qbFn(qb)
      loading.value = true
      const response = await $axios.get(`${url}?${qb.query()}`)
      const model = plainToClass(entity, response.data.data as T[])
      findManyResult.value = model
      loading.value = false
    },

    async createOne(
      newModel: T,
      qbFn: (qb: RequestQueryBuilder) => void = () => {}
    ) {
      await actionWrapper(
        async () => {
          const qb = new RequestQueryBuilder()
          qbFn(qb)
          const response = await $axios.post(`${url}?${qb.query()}`, newModel)
          const model = plainToClass(entity, response.data)
          findOneResult.value = model
        },
        (e: string) => `${_.capitalize(e)} created successfully!`,
        (e: string) => `Error while creating ${e.toLowerCase()}!`
      )
    },

    async updateOne(
      id: number,
      updatedModel: T,
      qbFn: (qb: RequestQueryBuilder) => void = () => {}
    ) {
      await actionWrapper(
        async () => {
          const qb = new RequestQueryBuilder()
          qbFn(qb)
          const response = await $axios.patch(
            `${url}/${id}?${qb.query()}`,
            updatedModel
          )
          const model = plainToClass(entity, response.data)
          findOneResult.value = model
        },
        (e: string) => `${_.capitalize(e)} updated successfully!`,
        (e: string) => `Error while updating ${e.toLowerCase()}!`
      )
    },

    async deleteOne(id: number) {
      await actionWrapper(
        async () => {
          const response = await $axios.delete(`${url}/${id}`)
          const model = plainToClass(entity, response.data)
          findOneResult.value = model
        },
        (e: string) => `${_.capitalize(e)} deleted successfully!`,
        (e: string) => `Error while deleting ${e.toLowerCase()}!`
      )
    },
  }
}
