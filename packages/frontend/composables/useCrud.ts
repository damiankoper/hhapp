import { ref } from '@nuxtjs/composition-api'
import { ClassConstructor, plainToClass } from 'class-transformer'
import { $axios } from '~/utils/api'

export function useCrud<T>(url: string, entity: ClassConstructor<T>) {
  const loading = ref(false)
  const error = ref(false)

  const findOneResult = ref<T>()

  return {
    loading,
    error,
    findOneResult,
    async findOne(id: number) {
      loading.value = true
      const response = await $axios.get(`${url}/${id}`)
      const model = plainToClass(entity, response.data)
      findOneResult.value = model
      loading.value = false
    },
    async updateOne(id: number, updatedModel: T) {
      loading.value = true
      const response = await $axios.patch(`${url}/${id}`, updatedModel)
      const model = plainToClass(entity, response.data)
      findOneResult.value = model
      loading.value = false
    },
  }
}
