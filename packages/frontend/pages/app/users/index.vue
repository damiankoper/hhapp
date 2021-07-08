<template>
  <v-sheet style="position: relative" class="pt-8 mt-8">
    <v-data-table
      :headers="headers"
      :items="items"
      :options.sync="options"
      :loading="loading"
      @dblclick:row="(e, { item }) => $router.push(userCrud.showOne(item.id))"
    >
      <template #[`item.avatar`]="{ item }">
        <Avatar :size="36" :color="item.color" :sex="item.sex" />
      </template>
      <template #[`item.actions`]="{ item }">
        <action-buttons
          :item-id="item.id"
          :delete-one="userCrud.deleteOne"
          :delete-enabled="$auth.user.id !== item.id"
          :show-one="userCrud.showOne"
          :reload-datatable="fetch"
        />
      </template>
    </v-data-table>
    <v-btn color="secondary" absolute top right fab :to="createUrl">
      <v-icon>mdi-plus</v-icon>
    </v-btn>
    <v-btn
      color="secondary lighten-2"
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
import User from '~/store/session/user.model'
import ActionButtons from '~/components/datatable/ActionButtons.vue'
import { useCrud } from '~/composables/useCrud'

const title = 'Users'

export default {
  components: { ActionButtons },
  middleware() {
    navigationStore.setTitle('Users')
  },
  setup() {
    const { items, fetch, loading, serverItemsLength, options } = useDatatable(
      User,
      'users'
    )
    const userCrud = useCrud(
      'users',
      User,
      'user',
      snackbarStore.showSuccess,
      snackbarStore.showError
    )

    const headers: DataTableHeader[] = [
      {
        text: '',
        value: 'avatar',
        width: 1,
        sortable: false,
      },
      {
        text: 'First name',
        value: 'firstname',
      },
      {
        text: 'Surname',
        value: 'surname',
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
      userCrud,
      loading,
      serverItemsLength,
      options,
      fetch,
      createUrl: userCrud.createUrl,
    }
  },
  head() {
    return {
      title,
    }
  },
}
</script>
