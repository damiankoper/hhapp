<template>
  <v-row>
    <v-col cols="12" md="6">
      <item-form v-model="item" :loading="loading" @submit="submit" />
    </v-col>

    <v-col cols="12" md="6">
      <v-card class="mb-6">
        <v-card-text class="text-center">
          <v-icon size="120px" color="primary lighten-2">
            mdi-home-lightbulb-outline
          </v-icon>
          <br />
          <span class="text-h4">Card placeholder</span>
        </v-card-text>
      </v-card>
      <v-card>
        <v-card-text class="text-center">
          <v-icon size="120px" color="primary lighten-2">
            mdi-home-heart
          </v-icon>
          <br />
          <span class="text-h4">Card placeholder</span>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { useContext } from '@nuxtjs/composition-api'
import { RequestQueryBuilder } from '@nestjsx/crud-request'
import { navigationStore } from '~/store'
import { useCrud } from '~/composables/useCrud'
import ItemForm from '~/components/item/ItemForm.vue'
import { Item } from '~/store/models/item.model'
const title = 'Shopping items'

export default {
  components: { ItemForm },
  middleware() {
    navigationStore.setTitle(title)
  },
  setup() {
    const ctx = useContext()
    const itemCrud = useCrud('shopping/items', Item, 'item')
    const item = itemCrud.findOneResult

    function qbFn(qb: RequestQueryBuilder) {
      qb.setJoin([['category'], ['shop'], ['boughtBy'], ['boughtFor']])
    }

    itemCrud.findOne(+ctx.route.value.params.id, qbFn)

    return {
      item,
      loading: itemCrud.loading,
      async submit(submitItem: Item) {
        if (submitItem.id) {
          await itemCrud.updateOne(submitItem.id, submitItem, qbFn)
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
