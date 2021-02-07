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
      </v-data-table>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { reactive, ref, useContext } from '@nuxtjs/composition-api'
import { DataTableHeader } from 'vuetify'
import { navigationStore } from '~/store'
import { useDatatable } from '~/composables/useDatatable'
import User from '~/store/session/user.model'

const title = 'Users'

export default {
  components: {},
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
    const headers: DataTableHeader[] = [
      {
        text: '',
        value: 'avatar',
        width: 1,
      },
      {
        text: 'First name',
        value: 'firstname',
      },
      {
        text: 'Surname',
        value: 'surname',
      },
    ]

    return { users, datatable: reactive(datatable), headers }
  },
}
</script>
