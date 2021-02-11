<template>
  <v-row justify="center" align="center" fluid>
    <v-col>
      <v-data-table
        :headers="headers"
        :items="datatable.items"
        :options.sync="datatable.options"
        :loading="datatable.loading"
      >
        <template v-slot:item.avatar="{ item }">
          <Avatar :size="36" :color="item.color" :sex="item.sex" />
        </template>
        <template v-slot:item.actions="{ item }">
          <action-buttons
            :item-id="item.id"
            :delete-one="userCrud.deleteOne"
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
  head() {
    return {
      title,
    }
  },
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
      (msg: string) => snackbarStore.showSuccess(msg),
      (msg: string) => snackbarStore.showError(msg)
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
}
</script>
