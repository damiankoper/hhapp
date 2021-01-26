<template>
  <v-row justify="center" align="center" fluid>
    <v-col>{{ users }}</v-col>
  </v-row>
</template>

<script>
import { onMounted, ref, useContext } from '@nuxtjs/composition-api'
import { navigationStore } from '~/store'

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
    onMounted(async () => {
      const res = await ctx.$axios.get('/users')
      users.value = res.data
    })

    return { users }
  },
}
</script>
