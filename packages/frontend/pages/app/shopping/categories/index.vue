<template>
  <v-sheet style="position: relative" class="pt-8 mt-8">
    <v-data-table
      :headers="headers"
      :items="items"
      :options.sync="options"
      :loading="loading"
      :server-items-length="serverItemsLength"
      @dblclick:row="
        (e, { item }) => $router.push(categoryCrud.showOne(item.id))
      "
    >
      <template #[`item.icon`]="{ item }">
        <v-icon color="primary">{{ item.icon }}</v-icon>
      </template>
      <template #[`item.color`]="{ item }">
        <v-icon :color="item.color">mdi-checkbox-blank</v-icon>
      </template>
      <template #[`item.sharedByDefault`]="{ item }">
        <v-simple-checkbox :value="item.sharedByDefault" />
      </template>
      <template #[`item.actions`]="{ item }">
        <action-buttons
          :item-id="item.id"
          :delete-one="categoryCrud.deleteOne"
          :show-one="categoryCrud.showOne"
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
import { navigationStore, snackbarStore } from '~/store'
import { useDatatable } from '~/composables/useDatatable'
import ActionButtons from '~/components/datatable/ActionButtons.vue'
import { useCrud } from '~/composables/useCrud'
import { Category } from '~/store/models/category.model'

const title = 'Shopping categories'

export default {
  components: { ActionButtons },
  middleware() {
    navigationStore.setTitle(title)
  },
  setup() {
    const { items, fetch, loading, serverItemsLength, options } = useDatatable(
      Category,
      'shopping/categories'
    )
    const categoryCrud = useCrud(
      'shopping/categories',
      Category,
      'category',
      snackbarStore.showSuccess,
      snackbarStore.showError
    )

    const headers: DataTableHeader[] = [
      {
        text: '',
        value: 'icon',
        width: 1,
        sortable: false,
      },
      {
        text: 'Name',
        value: 'name',
      },
      {
        text: 'Color',
        value: 'color',
        align: 'center',
        class: 'text-center',
        width: 80,
        sortable: false,
      },
      {
        text: 'Shared',
        value: 'sharedByDefault',
        align: 'center',
        class: 'text-center',
        width: 80,
        sortable: false,
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
      categoryCrud,
      loading,
      serverItemsLength,
      options,
      fetch,
      createUrl: categoryCrud.createUrl,
    }
  },
  head() {
    return {
      title,
    }
  },
}
</script>
