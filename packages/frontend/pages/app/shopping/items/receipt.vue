<template>
  <v-row>
    <v-col :cols="12" :md="6">
      <item-form
        v-model="item"
        :loading="loading"
        :create="!item.id"
        @submit="submit"
      />
    </v-col>
    <v-col :cols="12" :md="6">
      <item-list :items="items" :loading="loading" @click="itemClick" />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { ref } from '@nuxtjs/composition-api'
import _ from 'lodash'
import { RequestQueryBuilder } from '@nestjsx/crud-request'
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
    function qbFn(qb: RequestQueryBuilder) {
      qb.setJoin([['category'], ['shop'], ['boughtBy'], ['boughtFor']])
    }
    const itemCrud = useCrud(
      'shopping/items',
      Item,
      'item',
      snackbarStore.showSuccess,
      snackbarStore.showError
    )
    const item = ref(new Item())
    const items = ref<Item[]>([])

    return {
      item,
      items,
      loading: itemCrud.loading,
      itemClick(clicked: Item) {
        item.value = clicked
      },
      async submit(submitItem: Item) {
        if (submitItem.id) {
          await itemCrud.updateOne(submitItem.id, submitItem, qbFn)
          const index = items.value.findIndex((i) => i.id === submitItem.id)
          if (index >= 0)
            Object.assign(items.value[index], itemCrud.findOneResult.value)
        } else {
          await itemCrud.createOne(submitItem, qbFn)
          if (itemCrud.findOneResult.value)
            items.value.push(itemCrud.findOneResult.value)
        }
        item.value = Object.assign(
          new Item(),
          _.pick(
            submitItem,
            'boughtBy',
            'boughtFor',
            'shop',
            'category',
            'date',
            'shared'
          )
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
