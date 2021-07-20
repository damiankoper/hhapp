<template>
  <v-row>
    <v-col cols="12" md="6">
      <category-form
        v-model="category"
        :loading="loading"
        create
        @submit="submit"
      />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { useContext } from '@nuxtjs/composition-api'
import { navigationStore, snackbarStore } from '~/store'
import { useCrud } from '~/composables/useCrud'
import CategoryForm from '~/components/category/CategoryForm.vue'
import { Category } from '~/store/models/category.model'
const title = 'Categories'

export default {
  components: { CategoryForm },
  middleware() {
    navigationStore.setTitle(title)
  },
  setup() {
    const { app } = useContext()
    const categoryCrud = useCrud(
      'shopping/categories',
      Category,
      'category',
      snackbarStore.showSuccess,
      snackbarStore.showError
    )
    const category = new Category()

    return {
      category,
      loading: categoryCrud.loading,
      async submit(submitCategory: Category) {
        await categoryCrud.createOne(submitCategory)
        app.router?.push(
          categoryCrud.showOne(categoryCrud.findOneResult.value?.id || 0)
        )
      },
    }
  },
  head() {
    return {
      title,
    }
  },
}
</script>
