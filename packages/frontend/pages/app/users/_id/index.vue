<template>
  <v-row>
    <v-col cols="12" md="6">
      <v-card :loading="loading">
        <v-card-text>
          <v-row align="center">
            <v-col cols="auto">
              <v-fade-transition leave-absolute tag="span">
                <v-skeleton-loader v-if="!user" type="avatar" width="48" />
                <Avatar v-else :size="48" :color="user.color" :sex="user.sex" />
              </v-fade-transition>
            </v-col>
            <v-col cols="auto">
              <v-fade-transition leave-absolute>
                <v-skeleton-loader
                  v-if="!user"
                  key="1"
                  type="list-item-two-line"
                />
                <h1 v-else key="3">{{ user.firstname }} {{ user.surname }}</h1>
              </v-fade-transition>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-form>
                <v-text-field
                  v-model="formUser.firstname"
                  label="First name"
                  prepend-icon="mdi-text"
                  :error-messages="$v.firstname.$errors.map((e) => e.$message)"
                  @keydown.enter="submit"
                />
                <v-text-field
                  v-model="formUser.surname"
                  label="Surname"
                  prepend-icon="mdi-text"
                  :error-messages="$v.surname.$errors.map((e) => e.$message)"
                  @keydown.enter="submit"
                />
                color
                <v-text-field
                  v-model="formUser.password"
                  label="Password"
                  type="password"
                  prepend-icon="mdi-lock"
                  :error-messages="$v.password.$errors.map((e) => e.$message)"
                  @keydown.enter="submit"
                />
                <v-text-field
                  v-model="formUser.passRepeat"
                  label="Repeat password"
                  type="password"
                  prepend-icon="mdi-lock"
                  :error-messages="$v.passRepeat.$errors.map((e) => e.$message)"
                  @keydown.enter="submit"
                />
              </v-form>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" @click="submit"> Save </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>

    <v-col cols="12" md="6">
      <v-card> <v-card-text></v-card-text> </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import {
  reactive,
  ref,
  toRefs,
  useContext,
  watch,
} from '@nuxtjs/composition-api'
import useVuelidate from '@vuelidate/core'
import { required, sameAs } from '@vuelidate/validators'
import { navigationStore } from '~/store'
import Avatar from '~/components/Avatar.vue'
import { useCrud } from '~/composables/useCrud'
import User from '~/store/session/user.model'

const title = 'Users'

export default {
  components: { Avatar },
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
    const userCrud = useCrud('users', User)
    const formUser = reactive(Object.assign(new User(), { passRepeat: '' }))
    const $v = useVuelidate(
      {
        firstname: { required },
        surname: { required },
        password: {},
        passRepeat: { sameAs: sameAs(toRefs(formUser).password, 'Password') },
      },
      formUser
    )

    watch(userCrud.findOneResult, () => {
      Object.assign(formUser, userCrud.findOneResult.value)
    })

    userCrud.findOne(+ctx.route.value.params.id)

    return {
      user: userCrud.findOneResult,
      formUser,
      loading: userCrud.loading,
      $v,
      submit() {
        $v.value.$touch()
      },
    }
  },
}
</script>
