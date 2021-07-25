<template>
  <v-row>
    <v-col :cols="12" :md="6">
      <item-form v-model="item" :loading="loading" create @submit="submit" />
    </v-col>
    <v-col :cols="12" :md="6">
      <item-list v-model="item" :loading="loading" create @submit="submit" />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { useContext } from '@nuxtjs/composition-api'
import { navigationStore, snackbarStore } from '~/store'
import { useCrud } from '~/composables/useCrud'
import ItemForm from '~/components/item/ItemForm.vue'
import ItemList from '~/components/item/ItemList.vue'
import { Item } from '~/store/models/item.model'
const title = 'Shopping items'

export default {
  components: { ItemForm, ItemList },
  middleware() {
    navigationStore.setTitle(title)
  },
  setup() {
    const { app } = useContext()
    const itemCrud = useCrud(
      'shopping/items',
      Item,
      'item',
      snackbarStore.showSuccess,
      snackbarStore.showError
    )
    const item = new Item()

    return {
      item,
      loading: itemCrud.loading,
      async submit(submitItem: Item) {
        await itemCrud.createOne(submitItem)
        app.router?.push(
          itemCrud.showOne(itemCrud.findOneResult.value?.id || 0)
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
