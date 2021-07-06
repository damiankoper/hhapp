<template>
  <v-row justify="center" align="center" fluid>
    <v-col>
      <v-data-table
        :headers="headers"
        :items="datatable.items"
        :options.sync="datatable.options"
        :loading="datatable.loading"
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
            :reload-datatable="datatable.reload"
          />
        </template>
      </v-data-table>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { reactive, ref, useContext } from '@nuxtjs/composition-api'
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
    const ctx = useContext()
    const users = ref('')
    const datatable = useDatatable(ctx.$axios, User, 'users')
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

    return { users, datatable: reactive(datatable), headers, userCrud }
  },
  head() {
    return {
      title,
    }
  },
}
</script>
