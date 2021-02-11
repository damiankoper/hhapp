<template>
  <v-row>
    <v-col cols="12" md="6">
      <user-form
        v-model="user"
        :readonly="readonly"
        :loading="loading"
        @submit="submit"
      />
    </v-col>

    <v-col cols="12" md="6">
      <v-card>
        <v-card-text> </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { computed, useContext } from '@nuxtjs/composition-api'
import { navigationStore, sessionStore, snackbarStore } from '~/store'
import { useCrud } from '~/composables/useCrud'
import User from '~/store/session/user.model'
import UserForm from '~/components/user/UserForm.vue'
const title = 'Users'

export default {
  components: { UserForm },
  head() {
    return {
      title,
    }
  },
  middleware() {
    navigationStore.setTitle(title)
  },
  setup() {
    const ctx = useContext()
    const userCrud = useCrud(
      'users',
      User,
      'user',
      (msg: string) => snackbarStore.showSuccess(msg),
      (msg: string) => snackbarStore.showError(msg)
    )
    const user = userCrud.findOneResult

    userCrud.findOne(+ctx.route.value.params.id)

    return {
      user,
      loading: userCrud.loading,
      readonly: computed(
        () => user.value && sessionStore.user?.id !== user.value.id
      ),
      submit(user: User) {
        if (user.id) userCrud.updateOne(user.id, user)
      },
    }
  },
}
</script>
