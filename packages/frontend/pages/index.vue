<template>
  <v-row justify="center" align="center">
    <v-col lg="6" cols="12" class="col-left">
      <Title class="title" :subtitle="titles[titleNum]" :size="titleSize" />
    </v-col>
    <v-col lg="6" md="8" sm="8" cols="12">
      <v-card>
        <v-card-title>Sign in</v-card-title>
        <v-card-text>
          <v-alert v-model="alertVisible" dense type="error" dismissible>
            {{ alertText }}
          </v-alert>
          <v-form>
            <v-text-field
              v-model="username"
              label="Username"
              prepend-icon="mdi-account"
              :error-messages="$v.username.$errors.map((e) => e.$message)"
              @keydown.enter="submit"
            />
            <v-text-field
              v-model="password"
              label="Password"
              type="password"
              prepend-icon="mdi-lock"
              :error-messages="$v.password.$errors.map((e) => e.$message)"
              @keydown.enter="submit"
            />
            <v-checkbox v-model="rememberMe" label="Remember me" />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" @click="submit">Sign in</v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
import {
  onBeforeUnmount,
  onMounted,
  ref,
  useContext,
} from '@nuxtjs/composition-api'
import { required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { sessionStore } from '~/store'

export default Vue.extend({
  layout: 'login',
  computed: {
    titleSize(): number {
      switch (true) {
        case this.$vuetify.breakpoint.mdAndUp:
          return 18
        default:
          return 12
      }
    },
  },

  head() {
    return {
      title: 'Welcome',
    }
  },
  setup(_props, _ctx) {
    const titles = [
      'app',
      'shopping',
      'watering',
      'lists',
      'relations',
      'love',
      'living',
    ]
    const titleNum = ref(0)
    let interval: NodeJS.Timeout
    onMounted(
      () =>
        (interval = setInterval(() => {
          titleNum.value = (titleNum.value + 1) % titles.length
        }, 3000))
    )
    onBeforeUnmount(() => {
      clearInterval(interval)
    })

    const username = ref('')
    const password = ref('')
    const rememberMe = ref(false)
    const alertVisible = ref(false)
    const alertText = ref('')
    const $v = useVuelidate(
      {
        username: { required },
        password: { required },
      },
      { username, password }
    )
    const context = useContext()
    async function submit() {
      $v.value.$touch()
      if (!$v.value.$invalid) {
        try {
          await sessionStore.login({
            username: username.value,
            password: password.value,
            rememberMe: rememberMe.value,
          })
          await sessionStore.fetchUser()
          context.app.router?.push({ name: 'app' })
        } catch (e) {
          alertVisible.value = true
          if (e.response.status === 404) {
            alertText.value = 'Invalid username or password'
          } else {
            alertText.value = 'Server error'
          }
        }
      }
    }

    return {
      $v,
      titles,
      titleNum,
      username,
      password,
      rememberMe,
      alertVisible,
      alertText,
      submit,
    }
  },
})
</script>
<style lang="scss" scoped>
.col-left {
  display: flex;
  align-items: center;
}
</style>
