<template>
  <v-sheet style="position: relative" class="pt-8 mt-8">
    <v-data-table
      :headers="headers"
      :items="items"
      :options.sync="options"
      :loading="loading"
      :server-items-length="serverItemsLength"
      @dblclick:row="(e, { item }) => $router.push(shopCrud.showOne(item.id))"
    >
      <template #[`item.actions`]="{ item }">
        <action-buttons
          :item-id="item.id"
          :delete-one="shopCrud.deleteOne"
          :show-one="shopCrud.showOne"
          :reload-datatable="fetch"
        />
      </template>
    </v-data-table>
    <v-btn color="primary" absolute top right fab :to="createUrl">
      <v-icon>mdi-plus</v-icon>
    </v-btn>
    <v-btn
      color="primary lighten-2"
      style="margin-right: 72px"
      small
      absolute
      top
      right
      fab
      :disabled="loading"
      @click="fetch"
    >
      <v-icon>mdi-refresh</v-icon>
    </v-btn>
  </v-sheet>
</template>

<script lang="ts">
import { DataTableHeader } from 'vuetify'
import { navigationStore } from '~/store'
import { useDatatable } from '~/composables/useDatatable'
import ActionButtons from '~/components/datatable/ActionButtons.vue'
import { useCrud } from '~/composables/useCrud'
import { Shop } from '~/store/models/shop.model'

const title = 'Shops'

export default {
  components: { ActionButtons },
  middleware() {
    navigationStore.setTitle(title)
  },
  setup() {
    const { items, fetch, loading, serverItemsLength, options } = useDatatable(
      Shop,
      'shopping/shops'
    )
    const shopCrud = useCrud('shopping/shops', Shop, 'shop')

    const headers: DataTableHeader[] = [
      {
        text: 'Name',
        value: 'name',
      },
      {
        text: 'Actions',
        value: 'actions',
        sortable: false,
        width: 100,
        align: 'end',
        class: 'text-right',
      },
    ]

    return {
      items,
      headers,
      shopCrud,
      loading,
      serverItemsLength,
      options,
      fetch,
      createUrl: shopCrud.createUrl,
    }
  },
  head() {
    return {
      title,
    }
  },
}
</script>
