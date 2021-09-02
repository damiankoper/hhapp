<template>
  <v-row justify="center" align="center">
    <v-col :xl="6" :lg="6" :sm="12" cols="auto" class="d-flex justify-center">
      <Title
        class="title pr-sm-16 mb-md-0 mb-12"
        :subtitle="titles[titleNum]"
        :size="titleSize"
      />
    </v-col>
    <v-col :xl="6" :lg="6" sm="auto" cols="auto">
      <v-card elevation="4" class="pa-4" rounded="xl" max-width="400">
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
            <v-btn color="primary" block @click="submit">Sign in</v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
import {
  computed,
  onBeforeUnmount,
  onMounted,
  ref,
  useContext,
} from '@nuxtjs/composition-api'
import { required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { AxiosError } from 'axios'

export default Vue.extend({
  layout: 'login',
  setup() {
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

    onMounted(() => {
      if ($auth.loggedIn) router?.replace('/app')

      interval = setInterval(() => {
        titleNum.value = (titleNum.value + 1) % titles.length
      }, 3000)
    })
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
    const {
      $auth,
      app: { vuetify, router },
    } = useContext()
    async function submit() {
      $v.value.$touch()
      if (!$v.value.$invalid) {
        try {
          await $auth.loginWith('local', {
            data: {
              username: username.value,
              password: password.value,
              rememberMe: rememberMe.value,
            },
          })
        } catch (e) {
          const err = e as AxiosError
          alertVisible.value = true
          if (err.response && err.response.status === 404) {
            alertText.value = 'Invalid username or password'
          } else {
            alertText.value = 'Server error'
          }
        }
      }
    }

    const titleSize = computed(() => {
      switch (true) {
        case vuetify?.framework.breakpoint.smAndUp:
          return 18
        default:
          return 12
      }
    })

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
      titleSize,
    }
  },

  head() {
    return {
      title: 'Welcome',
    }
  },
})
</script>
