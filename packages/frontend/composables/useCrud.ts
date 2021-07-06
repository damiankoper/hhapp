import { ref, useContext } from '@nuxtjs/composition-api'
import { ClassConstructor, plainToClass } from 'class-transformer'
import _ from 'lodash'
export function useCrud<T>(
  url: string,
  entity: ClassConstructor<T>,
  entityName: string,
  onSuccess: (msg: string) => void,
  onError: (msg: string) => void
) {
  const {$axios} = useContext()
  const loading = ref(false)
  const error = ref(false)

  const findOneResult = ref<T>()

  const actionWrapper = async (
    cb: () => Promise<void>,
    success: (e: string) => string,
    error: (e: string) => string
  ) => {
    try {
      loading.value = true
      await cb()
      onSuccess(success(entityName))
    } catch {
      onError(error(entityName))
    }
    loading.value = false
  }

  return {
    loading,
    error,
    findOneResult,
    showOne(id: number) {
      return `${url}/${id}`
    },

    async findOne(id: number) {
      loading.value = true
      const response = await $axios.get(`${url}/${id}`)
      const model = plainToClass(entity, response.data)
      findOneResult.value = model
      loading.value = false
    },

    async updateOne(id: number, updatedModel: T) {
      await actionWrapper(
        async () => {
          const response = await $axios.patch(`${url}/${id}`, updatedModel)
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
