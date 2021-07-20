<template>
  <v-row>
    <v-col cols="12" md="6">
      <category-form v-model="user" :loading="loading" @submit="submit" />
    </v-col>

    <v-col cols="12" md="6">
      <v-card class="mb-6">
        <v-card-text class="text-center">
          <v-icon size="120px" color="primary lighten-2">
            mdi-home-lightbulb-outline
          </v-icon>
          <br />
          <span class="text-h4 font-weight-bold">Card placeholder</span>
        </v-card-text>
      </v-card>
      <v-card>
        <v-card-text class="text-center">
          <v-icon size="120px" color="primary lighten-2">
            mdi-home-heart
          </v-icon>
          <br />
          <span class="text-h4 font-weight-bold">Card placeholder</span>
        </v-card-text>
      </v-card>
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
    const ctx = useContext()
    const categoryCrud = useCrud(
      'shopping/categories',
      Category,
      'category',
      snackbarStore.showSuccess,
      snackbarStore.showError
    )
    const user = categoryCrud.findOneResult

    categoryCrud.findOne(+ctx.route.value.params.id)

    return {
      user,
      loading: categoryCrud.loading,
      async submit(submitCategory: Category) {
        if (submitCategory.id) {
          await categoryCrud.updateOne(submitCategory.id, submitCategory)
        }
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
