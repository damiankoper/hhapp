<template>
  <v-row>
    <v-col cols="12" md="6">
      <user-form v-model="user" :loading="loading" create @submit="submit" />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { useContext } from '@nuxtjs/composition-api'
import { navigationStore, snackbarStore } from '~/store'
import { useCrud } from '~/composables/useCrud'
import User from '~/store/session/user.model'
import UserForm from '~/components/user/UserForm.vue'
const title = 'Users'

export default {
  components: { UserForm },
  middleware() {
    navigationStore.setTitle(title)
  },
  setup() {
    const { app } = useContext()
    const userCrud = useCrud(
      'users',
      User,
      'user',
      snackbarStore.showSuccess,
      snackbarStore.showError
    )
    const user = new User()

    return {
      user,
      loading: userCrud.loading,
      async submit(submitUser: User) {
        await userCrud.createOne(submitUser)
        app.router?.push(
          userCrud.showOne(userCrud.findOneResult.value?.id || 0)
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
